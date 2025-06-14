const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.sendMail({
      from: '"WeatherApp" <alladurgaprasad1996@gmail.com>',
      to,
      subject,
      text,
      html,
    });

    console.log("✅ Email sent to:", to);
  } catch (err) {
    console.error("❌ Error sending email:", err.message);
    throw new Error("Email sending failed");
  }
};

module.exports = { sendEmail };
