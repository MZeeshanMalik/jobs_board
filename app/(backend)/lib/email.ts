export function sendEmail({
  email,
  subject,
  html,
}: {
  email: string;
  subject: string;
  html: string;
}) {
  console.log("email received", email, subject, html);
}

// lib/email.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(
  email: string,
  resetToken: string,
  name: string,
) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Fraudhawkai <noreply@Fraudhawkai.com>",
      to: [email],
      subject: "Reset Your fraudhawkai Password",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f9fafb;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <tr>
                <td style="padding: 40px 30px;">
                  <div style="text-align: center; margin-bottom: 30px;">
                    <span style="font-size: 28px; font-weight: 700; color: #ec4899;">Fraud</span>
                    <span style="font-size: 28px; font-weight: 700; color: #1a1a2e;">hawkai</span>
                  </div>
                  
                  <h1 style="color: #1a1a2e; font-size: 24px; font-weight: 700; margin: 0 0 10px 0;">
                    Reset Your Password
                  </h1>
                  
                  <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    Hi ${name || "there"},
                  </p>
                  
                  <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                    We received a request to reset your password for your fraudhawkai account. 
                    Click the button below to create a new password.
                  </p>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" 
                       style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #ec4899, #8b5cf6); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      Reset Password
                    </a>
                  </div>
                  
                  <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
                    This link will expire in <strong>1 hour</strong>. If you didn't request this, 
                    please ignore this email or contact support if you have concerns.
                  </p>
                  
                  <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 10px 0;">
                    Or copy and paste this link into your browser:
                  </p>
                  
                  <p style="color: #6b7280; font-size: 12px; background-color: #f3f4f6; padding: 12px; border-radius: 6px; word-break: break-all; margin: 0 0 30px 0;">
                    ${resetUrl}
                  </p>
                  
                  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                  
                  <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
                    fraudhawkai • Protecting global e-commerce stores from COD fraud
                  </p>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
      text: `Reset Your fraudhawkai Password\n\nHi ${name || "there"},\n\nWe received a request to reset your password. Click the link below to create a new password:\n\n${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.\n\nfraudhawkai Team`,
    });

    if (error) {
      console.error("Email sending error:", error);
      throw new Error("Failed to send reset email");
    }

    return { success: true, data };
  } catch (error) {
    console.error("Email error:", error);
    throw error;
  }
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(email: string, name: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "fraudhawkai <noreply@fraudhawkai.com>",
      to: [email],
      subject: "Welcome to fraudhawkai! 🛡️",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f9fafb;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <tr>
                <td style="padding: 40px 30px;">
                  <!-- Logo -->
                  <div style="text-align: center; margin-bottom: 30px;">
                    <span style="font-size: 28px; font-weight: 700; color: #ec4899;">Fraud</span>
                    <span style="font-size: 28px; font-weight: 700; color: #1a1a2e;">hawkai</span>
                  </div>
                  
                  <!-- Hero Image/Icon -->
                  <div style="text-align: center; margin-bottom: 30px;">
                    <div style="display: inline-block; background: linear-gradient(135deg, #ec4899, #8b5cf6); padding: 20px; border-radius: 50%;">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        <path d="M9 12l2 2 4-4" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  
                  <h1 style="color: #1a1a2e; font-size: 26px; font-weight: 700; text-align: center; margin: 0 0 10px 0;">
                    Welcome to fraudhawkai, ${name}! 🎉
                  </h1>
                  
                  <p style="color: #6b7280; font-size: 16px; line-height: 1.6; text-align: center; margin: 0 0 30px 0;">
                    Thank you for joining worlds's leading COD fraud detection network. 
                    We're excited to help you protect your e-commerce store.
                  </p>
                  
                  <!-- Quick Start Guide -->
                  <div style="background-color: #fdf2f8; border-radius: 12px; padding: 24px; margin-bottom: 30px; border: 1px solid #fce7f3;">
                    <h3 style="color: #1a1a2e; font-size: 16px; font-weight: 600; margin: 0 0 15px 0;">
                      🚀 Quick Start Guide
                    </h3>
                    <div style="color: #6b7280; font-size: 14px; line-height: 1.8;">
                      <div style="display: flex; align-items: flex-start; gap: 12px; margin-bottom: 8px;">
                        <span style="background: #ec4899; color: white; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0;">1</span>
                        <span><strong>Create Your Store</strong> — Set up your store profile and get your API keys</span>
                      </div>
                      <div style="display: flex; align-items: flex-start; gap: 12px; margin-bottom: 8px;">
                        <span style="background: #8b5cf6; color: white; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0;">2</span>
                        <span><strong>Install Plugin</strong> — Install our WordPress plugin or integrate via API</span>
                      </div>
                      <div style="display: flex; align-items: flex-start; gap: 12px;">
                        <span style="background: #ec4899; color: white; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0;">3</span>
                        <span><strong>Start Protecting</strong> — Your store is now protected from COD fraud</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Action Buttons -->
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.NEXTAUTH_URL}/dashboard" 
                       style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #ec4899, #8b5cf6); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      Go to Your Dashboard
                    </a>
                  </div>
                  
                  <div style="text-align: center; margin: 20px 0;">
                    <a href="${process.env.NEXTAUTH_URL}/integrations" 
                       style="display: inline-block; padding: 12px 28px; border: 2px solid #e5e7eb; color: #6b7280; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 14px; margin-right: 10px;">
                      View Integrations
                    </a>
                    <a href="${process.env.NEXTAUTH_URL}/docs" 
                       style="display: inline-block; padding: 12px 28px; border: 2px solid #e5e7eb; color: #6b7280; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 14px;">
                      Read Documentation
                    </a>
                  </div>
                  
                  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                  
                  <!-- Features Overview -->
                  <div style="margin: 30px 0;">
                    <h3 style="color: #1a1a2e; font-size: 16px; font-weight: 600; text-align: center; margin: 0 0 15px 0;">
                      What You Get with fraudhawkai
                    </h3>
                    <table width="100%" style="color: #6b7280; font-size: 14px; line-height: 1.8;">
                      <tr>
                        <td style="padding: 6px 0;">✅ Real-time fraud detection</td>
                        <td style="padding: 6px 0;">✅ Shared intelligence network</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0;">✅ Risk scoring for every order</td>
                        <td style="padding: 6px 0;">✅ Easy WordPress plugin</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0;">✅ Detailed fraud analytics</td>
                        <td style="padding: 6px 0;">✅ WhatsApp & Email alerts</td>
                      </tr>
                    </table>
                  </div>
                  
                  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                  
                  <p style="color: #9ca3af; font-size: 14px; text-align: center; margin: 0 0 10px 0;">
                    Need help getting started? Check out our 
                    <a href="${process.env.NEXTAUTH_URL}/docs" style="color: #ec4899; text-decoration: none;">
                      Documentation
                    </a> 
                    or 
                    <a href="${process.env.NEXTAUTH_URL}/contact" style="color: #ec4899; text-decoration: none;">
                      Contact Support
                    </a>
                  </p>
                  
                  <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
                    fraudhawkai • Protecting global e-commerce stores from COD fraud
                  </p>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
      text: `
Welcome to fraudhawkai, ${name}! 🛡️

Thank you for joining worlds's leading COD fraud detection network.

Quick Start Guide:
1. Create Your Store — Set up your store profile and get your API keys
2. Install Plugin — Install our WordPress plugin or integrate via API
3. Start Protecting — Your store is now protected from COD fraud

Visit your dashboard to get started:
${process.env.NEXTAUTH_URL}/dashboard

Need help? Check our documentation:
${process.env.NEXTAUTH_URL}/docs

fraudhawkai Team
      `,
    });

    if (error) {
      console.error("Welcome email error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Welcome email error:", error);
    return { success: false, error };
  }
}

/**
 * Send admin notification when contact form is submitted
 */
export async function sendContactFormNotification(formData: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  try {
    const { name, email, phone, subject, message } = formData;

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "fraudhawkai <noreply@fraudhawkai.com>",
      to: [process.env.ADMIN_EMAIL || "m121zeeshan@gmail.com"], // Your email
      subject: `📩 New Contact Form Submission: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f9fafb;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <tr>
                <td style="padding: 40px 30px;">
                  <!-- Header -->
                  <div style="text-align: center; margin-bottom: 30px;">
                    <span style="font-size: 28px; font-weight: 700; color: #ec4899;">Fraud</span>
                    <span style="font-size: 28px; font-weight: 700; color: #1a1a2e;">hawkai</span>
                  </div>
                  
                  <div style="background: #fdf2f8; border-left: 4px solid #ec4899; padding: 16px 20px; border-radius: 4px; margin-bottom: 24px;">
                    <h1 style="color: #1a1a2e; font-size: 22px; font-weight: 700; margin: 0;">
                      📩 New Contact Form Submission
                    </h1>
                    <p style="color: #6b7280; font-size: 14px; margin: 4px 0 0 0;">
                      A new message has been submitted through your contact form.
                    </p>
                  </div>

                  <!-- Submission Details -->
                  <table width="100%" style="border-collapse: collapse; margin-bottom: 24px;">
                    <tr>
                      <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                        <strong style="color: #6b7280;">Name:</strong>
                        <span style="color: #1a1a2e; display: block; margin-top: 2px;">${name}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                        <strong style="color: #6b7280;">Email:</strong>
                        <span style="color: #1a1a2e; display: block; margin-top: 2px;">
                          <a href="mailto:${email}" style="color: #ec4899; text-decoration: none;">
                            ${email}
                          </a>
                        </span>
                      </td>
                    </tr>
                    ${
                      phone
                        ? `
                    <tr>
                      <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                        <strong style="color: #6b7280;">Phone:</strong>
                        <span style="color: #1a1a2e; display: block; margin-top: 2px;">
                          <a href="tel:${phone}" style="color: #ec4899; text-decoration: none;">
                            ${phone}
                          </a>
                        </span>
                      </td>
                    </tr>
                    `
                        : ""
                    }
                    <tr>
                      <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
                        <strong style="color: #6b7280;">Subject:</strong>
                        <span style="color: #1a1a2e; display: block; margin-top: 2px;">${subject}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0;">
                        <strong style="color: #6b7280;">Message:</strong>
                        <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin-top: 6px; border: 1px solid #f3f4f6;">
                          <p style="color: #1a1a2e; margin: 0; line-height: 1.6; white-space: pre-wrap;">
                            ${message}
                          </p>
                        </div>
                      </td>
                    </tr>
                  </table>

                  <!-- Quick Actions -->
                  <div style="margin: 24px 0; padding: 16px; background: #f9fafb; border-radius: 8px;">
                    <h3 style="color: #1a1a2e; font-size: 14px; font-weight: 600; margin: 0 0 12px 0;">
                      🔗 Quick Actions
                    </h3>
                    <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                      <a href="mailto:${email}?subject=Re: ${subject}" 
                         style="display: inline-block; padding: 8px 16px; background: linear-gradient(135deg, #ec4899, #8b5cf6); color: white; text-decoration: none; border-radius: 6px; font-size: 14px;">
                        Reply to Customer
                      </a>
                      <a href="${process.env.NEXTAUTH_URL}/admin/contacts" 
                         style="display: inline-block; padding: 8px 16px; border: 1px solid #e5e7eb; color: #6b7280; text-decoration: none; border-radius: 6px; font-size: 14px;">
                        View in Admin
                      </a>
                    </div>
                  </div>

                  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                  
                  <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
                    fraudhawkai • Protecting global e-commerce stores from COD fraud
                  </p>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
      text: `
📩 New Contact Form Submission

Name: ${name}
Email: ${email}
${phone ? `Phone: ${phone}` : ""}
Subject: ${subject}

Message:
${message}
---
Reply to: ${email}
View in admin: ${process.env.NEXTAUTH_URL}/admin/contacts
      `,
    });

    if (error) {
      console.error("Contact form notification error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Contact form notification error:", error);
    return { success: false, error };
  }
}

/**
 * Send auto-reply to the user who submitted the contact form
 */
export async function sendContactFormAutoReply(formData: {
  name: string;
  email: string;
  subject: string;
}) {
  try {
    const { name, email, subject } = formData;

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "fraudhawkai <noreply@fraudhawkai.com>",
      to: [email],
      subject: `Thank you for contacting fraudhawkai`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f9fafb;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <tr>
                <td style="padding: 40px 30px;">
                  <div style="text-align: center; margin-bottom: 30px;">
                    <span style="font-size: 28px; font-weight: 700; color: #ec4899;">Fraud</span>
                    <span style="font-size: 28px; font-weight: 700; color: #1a1a2e;">hawkai</span>
                  </div>
                  
                  <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 16px 20px; border-radius: 4px; margin-bottom: 24px;">
                    <h1 style="color: #1a1a2e; font-size: 22px; font-weight: 700; margin: 0;">
                      Thank You for Contacting Us! 🙌
                    </h1>
                  </div>

                  <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
                    Hi ${name},
                  </p>
                  
                  <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
                    Thank you for reaching out to us. We have received your inquiry about 
                    <strong>"${subject}"</strong> and will get back to you within 24 hours.
                  </p>
                  
                  <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
                    In the meantime, you can explore these resources:
                  </p>

                  <div style="margin: 24px 0; padding: 16px; background: #f9fafb; border-radius: 8px;">
                    <h3 style="color: #1a1a2e; font-size: 14px; font-weight: 600; margin: 0 0 12px 0;">
                      📚 Helpful Resources
                    </h3>
                    <ul style="color: #6b7280; font-size: 14px; line-height: 2; margin: 0; padding-left: 20px;">
                      <li><a href="${process.env.NEXTAUTH_URL}/docs" style="color: #ec4899; text-decoration: none;">📖 Documentation</a></li>
                      <li><a href="${process.env.NEXTAUTH_URL}/blog" style="color: #ec4899; text-decoration: none;">📝 Fraud Prevention Blog</a></li>
                      <li><a href="${process.env.NEXTAUTH_URL}/integrations" style="color: #ec4899; text-decoration: none;">🔌 Integrations</a></li>
                    </ul>
                  </div>

                  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                  
                  <p style="color: #9ca3af; font-size: 14px; text-align: center; margin: 0 0 10px 0;">
                    For urgent matters, please call us at 
                    <a href="tel:+923444997472" style="color: #ec4899; text-decoration: none;">
                      +92 344 4997472
                    </a>
                  </p>
                  
                  <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
                    fraudhawkai • Protecting global e-commerce stores from COD fraud
                  </p>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
      text: `
Thank You for Contacting fraudhawkai! 🙌

Hi ${name},

Thank you for reaching out to us. We have received your inquiry about "${subject}" 
and will get back to you within 24 hours.

In the meantime, explore these resources:
📖 Documentation: ${process.env.NEXTAUTH_URL}/docs
📝 Blog: ${process.env.NEXTAUTH_URL}/blog
🔌 Integrations: ${process.env.NEXTAUTH_URL}/integrations

For urgent matters, call us at: +92 344 4997472

Best regards,
fraudhawkai Team
      `,
    });

    if (error) {
      console.error("Auto-reply email error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Auto-reply email error:", error);
    return { success: false, error };
  }
}
