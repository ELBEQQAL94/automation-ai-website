#!/usr/bin/env node

// Converts raster images (.jpg/.jpeg/.png) to .webp for smaller page weight.
//
// Usage:
//   node scripts/convert-to-webp.mjs [dir] [options]
//
// Options:
//   --quality=N   webp quality, 1-100 (default: 80)
//   --replace     delete the original file after a successful conversion
//   --force       re-convert even if an up-to-date .webp already exists
//   --dry-run     list what would happen without writing/deleting anything
//
// Examples:
//   node scripts/convert-to-webp.mjs public/blog/images
//   node scripts/convert-to-webp.mjs public --quality=75 --replace

import { readdir, stat, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SOURCE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png"]);

function parseArgs(argv) {
  const options = { dir: "public", quality: 80, replace: false, force: false, dryRun: false };

  for (const arg of argv) {
    if (arg === "--replace") options.replace = true;
    else if (arg === "--force") options.force = true;
    else if (arg === "--dry-run") options.dryRun = true;
    else if (arg.startsWith("--quality=")) options.quality = Number(arg.split("=")[1]);
    else if (!arg.startsWith("--")) options.dir = arg;
    else throw new Error(`Unknown option: ${arg}`);
  }

  if (!Number.isInteger(options.quality) || options.quality < 1 || options.quality > 100) {
    throw new Error(`--quality must be an integer between 1 and 100 (got ${options.quality})`);
  }

  return options;
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else if (SOURCE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }

  return files;
}

async function needsConversion(sourcePath, outputPath, force) {
  if (force) return true;

  try {
    const [sourceStat, outputStat] = await Promise.all([stat(sourcePath), stat(outputPath)]);
    return sourceStat.mtimeMs > outputStat.mtimeMs;
  } catch {
    return true; // .webp doesn't exist yet
  }
}

function formatBytes(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const rootDir = path.resolve(options.dir);
  const files = await walk(rootDir);

  if (files.length === 0) {
    console.log(`No .jpg/.jpeg/.png files found under ${rootDir}`);
    return;
  }

  let converted = 0;
  let skipped = 0;
  let totalBefore = 0;
  let totalAfter = 0;

  for (const sourcePath of files) {
    const outputPath = sourcePath.replace(path.extname(sourcePath), ".webp");
    const relative = path.relative(process.cwd(), sourcePath);

    if (!(await needsConversion(sourcePath, outputPath, options.force))) {
      skipped++;
      continue;
    }

    const sourceSize = (await stat(sourcePath)).size;

    if (options.dryRun) {
      console.log(`[dry-run] would convert ${relative} -> ${path.basename(outputPath)}`);
      continue;
    }

    await sharp(sourcePath).webp({ quality: options.quality }).toFile(outputPath);
    const outputSize = (await stat(outputPath)).size;

    totalBefore += sourceSize;
    totalAfter += outputSize;
    converted++;

    const savedPct = (100 * (1 - outputSize / sourceSize)).toFixed(0);
    console.log(
      `${relative} -> ${path.basename(outputPath)} (${formatBytes(sourceSize)} -> ${formatBytes(outputSize)}, -${savedPct}%)`
    );

    if (options.replace) {
      await unlink(sourcePath);
    }
  }

  if (!options.dryRun) {
    console.log("");
    console.log(`Converted: ${converted}, skipped (already up to date): ${skipped}`);
    if (converted > 0) {
      const savedPct = (100 * (1 - totalAfter / totalBefore)).toFixed(0);
      console.log(
        `Total size: ${formatBytes(totalBefore)} -> ${formatBytes(totalAfter)} (-${savedPct}%)`
      );
    }
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
