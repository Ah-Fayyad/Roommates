import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter;

// Asynchronously initialize the transporter to support Ethereal Test Accounts
const initTransporter = async () => {
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    } else {
        console.log('📧 SMTP credentials missing. Spinning up Ethereal Sandbox Mailbox for development...');
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: testAccount.smtp.host,
            port: testAccount.smtp.port,
            secure: testAccount.smtp.secure,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
    }
};

// Fire initialization on boot
initTransporter();

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
    try {
        if (!transporter) {
           await initTransporter();
        }

        const mailOptions = {
            from: `"Roommates Platform" <${process.env.SMTP_USER || 'test@roommates.com'}>`,
            to: options.to,
            subject: options.subject,
            html: options.html,
            text: options.text,
        };

        const info = await transporter.sendMail(mailOptions);
        
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.log('----------------------------------------------------');
            console.log(`✨ TEST EMAIL SENT TO: ${options.to}`);
            console.log(`🔍 PREVIEW IN BROWSER: ${nodemailer.getTestMessageUrl(info)}`);
            console.log('----------------------------------------------------');
        } else {
            console.log(`✅ Production Email sent to ${options.to}`);
        }
    } catch (error) {
        console.error('❌ Email sending failed:', error);
        throw new Error('Failed to send email');
    }
};

export const sendPasswordResetEmail = async (email: string, resetToken: string): Promise<void> => {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4F46E5;">Password Reset Request</h2>
      <p>You requested to reset your password. Click the button below to proceed:</p>
      <a href="${resetUrl}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">
        Reset Password
      </a>
      <p style="color: #666; font-size: 14px;">This link will expire in 1 hour.</p>
      <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
    </div>
  `;

    await sendEmail({
        to: email,
        subject: 'Reset Your Password - Roommates Platform',
        html,
        text: `Reset your password: ${resetUrl}`,
    });
};

export const sendVisitRequestEmail = async (ownerEmail: string, requesterName: string, listingTitle: string): Promise<void> => {
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4F46E5;">New Visit Request</h2>
      <p><strong>${requesterName}</strong> has requested to visit your listing:</p>
      <p style="font-size: 18px; font-weight: bold;">${listingTitle}</p>
      <p>Please log in to your dashboard to review and respond to this request.</p>
      <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard" style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">
        View Request
      </a>
    </div>
  `;

    await sendEmail({
        to: ownerEmail,
        subject: `New Visit Request for ${listingTitle}`,
        html,
        text: `${requesterName} has requested to visit your listing: ${listingTitle}`,
    });
};
