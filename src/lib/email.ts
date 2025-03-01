import { Resend } from 'resend';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Default sender email
const DEFAULT_FROM_EMAIL = 'onboarding@resend.dev';

/**
 * Send a single email
 */
export async function sendEmail({
  to,
  subject,
  html,
  from = DEFAULT_FROM_EMAIL,
  replyTo,
}: {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      replyTo,
    });

    if (error) {
      console.error('Error sending email:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

/**
 * Send a newsletter to multiple recipients
 */
export async function sendNewsletter({
  recipients,
  subject,
  html,
  from = DEFAULT_FROM_EMAIL,
}: {
  recipients: string[];
  subject: string;
  html: string;
  from?: string;
}) {
  try {
    // For small batches, we can send individually
    // For larger batches, consider using Resend's batch sending feature
    const results = await Promise.all(
      recipients.map(async (recipient) => {
        try {
          const result = await sendEmail({
            to: recipient,
            subject,
            html,
            from,
          });
          return { email: recipient, success: true, messageId: result.messageId };
        } catch (error) {
          console.error(`Failed to send to ${recipient}:`, error);
          return { email: recipient, success: false, error };
        }
      })
    );

    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    return {
      success: failed === 0,
      sent: successful,
      failed,
      total: recipients.length,
      results,
    };
  } catch (error) {
    console.error('Error sending newsletter:', error);
    throw error;
  }
}

/**
 * Send a welcome email to a new subscriber
 */
export async function sendWelcomeEmail(email: string, name?: string) {
  const subject = 'Welcome to Sparkling World Events Newsletter';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${subject}</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
        }
        .container { padding: 20px; }
        .header { 
          background: linear-gradient(to right, #ff7e5f, #feb47b);
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content { padding: 20px; }
        .footer { 
          text-align: center;
          font-size: 12px;
          color: #666;
          padding: 20px;
        }
        .button {
          display: inline-block;
          background-color: #ff7e5f;
          color: white;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 4px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Sparkling World Events!</h1>
        </div>
        <div class="content">
          <p>Hello ${name || 'there'},</p>
          <p>Thank you for subscribing to our newsletter! We're excited to keep you updated with our latest events, promotions, and news.</p>
          <p>Here's what you can expect from us:</p>
          <ul>
            <li>Updates on upcoming events</li>
            <li>Exclusive offers and promotions</li>
            <li>Tips and inspiration for your next celebration</li>
          </ul>
          <p>Visit our website to explore our services:</p>
          <a href="https://sparklingworldevents.com" class="button">Visit Our Website</a>
          <p>If you have any questions, feel free to reply to this email.</p>
          <p>Best regards,<br>The Sparkling World Events Team</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Sparkling World Events. All rights reserved.</p>
          <p>
            <a href="https://sparklingworldevents.com/unsubscribe?email=${encodeURIComponent(email)}">Unsubscribe</a> | 
            <a href="https://sparklingworldevents.com/privacy">Privacy Policy</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return sendEmail({
    to: email,
    subject,
    html,
  });
}

/**
 * Send a confirmation email for unsubscribing
 */
export async function sendUnsubscribeConfirmation(email: string) {
  const subject = 'You have been unsubscribed';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${subject}</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
        }
        .container { padding: 20px; }
        .header { 
          background: linear-gradient(to right, #ff7e5f, #feb47b);
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content { padding: 20px; }
        .footer { 
          text-align: center;
          font-size: 12px;
          color: #666;
          padding: 20px;
        }
        .button {
          display: inline-block;
          background-color: #ff7e5f;
          color: white;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 4px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Unsubscribe Confirmation</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>We're sorry to see you go. You have been successfully unsubscribed from our newsletter.</p>
          <p>If you unsubscribed by mistake or would like to resubscribe in the future, you can do so on our website:</p>
          <a href="https://sparklingworldevents.com/newsletter" class="button">Resubscribe</a>
          <p>We appreciate your interest in Sparkling World Events and hope to see you again soon.</p>
          <p>Best regards,<br>The Sparkling World Events Team</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Sparkling World Events. All rights reserved.</p>
          <p>
            <a href="https://sparklingworldevents.com/privacy">Privacy Policy</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return sendEmail({
    to: email,
    subject,
    html,
  });
} 