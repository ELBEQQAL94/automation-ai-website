import nodemailer from "nodemailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: { name?: unknown; email?: unknown; message?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || !email || !message) {
    return Response.json(
      { error: "Name, email, and message are all required." },
      { status: 400 },
    );
  }

  if (!EMAIL_RE.test(email)) {
    return Response.json({ error: "Please provide a valid email address." }, { status: 400 });
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
  const contactToEmail = process.env.CONTACT_TO_EMAIL ?? gmailUser;

  if (!gmailUser || !gmailAppPassword || !contactToEmail) {
    console.error("Missing GMAIL_USER, GMAIL_APP_PASSWORD, or CONTACT_TO_EMAIL env vars.");
    return Response.json(
      { error: "Contact form is not configured yet. Please try again later." },
      { status: 500 },
    );
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailAppPassword,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Automatoro Contact Form" <${gmailUser}>`,
      to: contactToEmail,
      replyTo: email,
      subject: `New contact form message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });
  } catch (error) {
    console.error("Failed to send contact form email:", error);
    return Response.json(
      { error: "Failed to send message. Please try again later." },
      { status: 502 },
    );
  }

  return Response.json({ success: true });
}
