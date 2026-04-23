import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail({ to, subject, html }) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || "FreshCart <noreply@freshcart.com>",
    to,
    subject,
    html,
  });
}

export function resetCodeEmail(name, code) {
  return `
    <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e2e8f0;border-radius:12px;">
      <h2 style="color:#01854c;">FreshCart Password Reset</h2>
      <p>Hi <strong>${name}</strong>,</p>
      <p>Your password reset code is:</p>
      <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#00cc74;padding:16px;background:#f0f3f2;border-radius:8px;text-align:center;margin:16px 0;">
        ${code}
      </div>
      <p style="color:#64748b;font-size:14px;">This code expires in 10 minutes. If you didn't request this, ignore this email.</p>
    </div>
  `;
}

export function orderConfirmationEmail(name, order) {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:32px;border:1px solid #e2e8f0;border-radius:12px;">
      <h2 style="color:#01854c;">Order Confirmed!</h2>
      <p>Hi <strong>${name}</strong>, your order <strong>#${order._id}</strong> has been placed.</p>
      <p>Total: <strong style="color:#00cc74;">EGP ${order.totalOrderPrice}</strong></p>
      <p>Payment: ${order.paymentMethodType}</p>
      <p style="color:#64748b;font-size:14px;">Thank you for shopping with FreshCart!</p>
    </div>
  `;
}
