import nodemailer from 'nodemailer';
import Settings from '@/model/settings';
import mongoose from 'mongoose';

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

/**
 * Creates a transporter for sending emails using tenant's settings
 */
export async function createEmailTransporter(tenantId: string) {
  try {
    // Find the settings for the tenant
    const settings = await Settings.findOne({ tenantId: new mongoose.Types.ObjectId(tenantId) });
    
    if (!settings || !settings.emailSettings || !settings.emailSettings.smtpServer) {
      throw new Error('Email settings not configured for this tenant');
    }
    
    const { smtpServer, smtpPort, smtpUsername, smtpPassword, fromEmail } = settings.emailSettings;
    
    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: smtpServer,
      port: smtpPort || 587,
      secure: smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: smtpUsername,
        pass: smtpPassword,
      },
    });
    
    return { transporter, fromEmail };
  } catch (error) {
    console.error('Error creating email transporter:', error);
    throw error;
  }
}

/**
 * Send an email using tenant's SMTP settings
 */
export async function sendEmail(tenantId: string, options: EmailOptions): Promise<boolean> {
  try {
    const { transporter, fromEmail } = await createEmailTransporter(tenantId);
    
    const mailOptions = {
      from: options.from || fromEmail,
      to: options.to,
      cc: options.cc,
      bcc: options.bcc,
      subject: options.subject,
      html: options.html,
      attachments: options.attachments,
    };
    
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

/**
 * Generate email templates for various notifications
 */
export const emailTemplates = {
  /**
   * Password change notification email template
   */
  passwordChange: (userName: string, companyName: string) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .footer { background-color: #f8f9fa; padding: 10px; text-align: center; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>${companyName}</h2>
            </div>
            <div class="content">
              <p>Hello ${userName},</p>
              <p>Your password has been successfully changed. If you did not make this change, please contact your administrator immediately.</p>
              <p>Thank you for using our service.</p>
              <p>Best regards,<br>${companyName} Team</p>
            </div>
            <div class="footer">
              <p>This is an automated message, please do not reply directly to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  },
  
  /**
   * New user created notification email template
   */
  newUser: (userName: string, email: string, password: string, companyName: string, loginUrl: string) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .button { display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 4px; }
            .credentials { background-color: #f8f9fa; padding: 15px; margin: 15px 0; border-left: 4px solid #007bff; }
            .footer { background-color: #f8f9fa; padding: 10px; text-align: center; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Welcome to ${companyName}</h2>
            </div>
            <div class="content">
              <p>Hello ${userName},</p>
              <p>Your account has been created in our CRM system. Below are your login credentials:</p>
              
              <div class="credentials">
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Password:</strong> ${password}</p>
              </div>
              
              <p>Please login and change your password as soon as possible.</p>
              
              <p style="text-align: center; margin: 30px 0;">
                <a href="${loginUrl}" class="button">Login to Your Account</a>
              </p>
              
              <p>If you have any questions, please contact your system administrator.</p>
              
              <p>Best regards,<br>${companyName} Team</p>
            </div>
            <div class="footer">
              <p>This is an automated message, please do not reply directly to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  },
  
  /**
   * Deal assigned or changed notification email template
   */
  dealUpdate: (userName: string, dealTitle: string, dealValue: number, status: string, assignedBy: string, companyName: string, dealUrl: string) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .deal-info { background-color: #f8f9fa; padding: 15px; margin: 15px 0; border-left: 4px solid #28a745; }
            .button { display: inline-block; padding: 10px 20px; background-color: #28a745; color: #ffffff; text-decoration: none; border-radius: 4px; }
            .footer { background-color: #f8f9fa; padding: 10px; text-align: center; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Deal Update</h2>
            </div>
            <div class="content">
              <p>Hello ${userName},</p>
              <p>A deal has been ${status} to you:</p>
              
              <div class="deal-info">
                <p><strong>Deal:</strong> ${dealTitle}</p>
                <p><strong>Value:</strong> $${dealValue.toLocaleString()}</p>
                <p><strong>Status:</strong> ${status}</p>
                <p><strong>Assigned by:</strong> ${assignedBy}</p>
              </div>
              
              <p style="text-align: center; margin: 30px 0;">
                <a href="${dealUrl}" class="button">View Deal Details</a>
              </p>
              
              <p>Best regards,<br>${companyName} Team</p>
            </div>
            <div class="footer">
              <p>This is an automated message, please do not reply directly to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  },
  
  /**
   * Lead assigned or changed notification email template
   */
  leadUpdate: (userName: string, leadName: string, company: string, status: string, assignedBy: string, companyName: string, leadUrl: string) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .lead-info { background-color: #f8f9fa; padding: 15px; margin: 15px 0; border-left: 4px solid #17a2b8; }
            .button { display: inline-block; padding: 10px 20px; background-color: #17a2b8; color: #ffffff; text-decoration: none; border-radius: 4px; }
            .footer { background-color: #f8f9fa; padding: 10px; text-align: center; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Lead Update</h2>
            </div>
            <div class="content">
              <p>Hello ${userName},</p>
              <p>A lead has been ${status} to you:</p>
              
              <div class="lead-info">
                <p><strong>Lead:</strong> ${leadName}</p>
                <p><strong>Company:</strong> ${company}</p>
                <p><strong>Status:</strong> ${status}</p>
                <p><strong>Assigned by:</strong> ${assignedBy}</p>
              </div>
              
              <p style="text-align: center; margin: 30px 0;">
                <a href="${leadUrl}" class="button">View Lead Details</a>
              </p>
              
              <p>Best regards,<br>${companyName} Team</p>
            </div>
            <div class="footer">
              <p>This is an automated message, please do not reply directly to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  },
};