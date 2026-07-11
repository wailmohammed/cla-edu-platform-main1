import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  cc?: string[];
  bcc?: string[];
}

interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
}

class SMTPService {
  private transporter: any = null;
  private config: SMTPConfig | null = null;

  /**
   * Initialize SMTP service with configuration
   */
  initialize(config: SMTPConfig) {
    this.config = config;
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.auth.user,
        pass: config.auth.pass,
      },
    });
    console.log("[SMTP] Service initialized successfully");
  }

  /**
   * Send email via SMTP
   */
  async sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.transporter) {
      return {
        success: false,
        error: "SMTP service not initialized. Call initialize() first.",
      };
    }

    try {
      const mailOptions = {
        from: options.from || this.config?.from || "noreply@codelearnify.com",
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        replyTo: options.replyTo,
        cc: options.cc,
        bcc: options.bcc,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`[SMTP] Email sent to ${options.to}: ${info.messageId}`);

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      console.error(`[SMTP] Failed to send email to ${options.to}:`, error);
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }

  /**
   * Send bulk emails
   */
  async sendBulkEmails(
    emails: EmailOptions[]
  ): Promise<{ success: number; failed: number; errors: string[] }> {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const email of emails) {
      const result = await this.sendEmail(email);
      if (result.success) {
        results.success++;
      } else {
        results.failed++;
        results.errors.push(`Failed to send to ${email.to}: ${result.error}`);
      }
    }

    return results;
  }

  /**
   * Verify SMTP connection
   */
  async verifyConnection(): Promise<boolean> {
    if (!this.transporter) {
      console.error("[SMTP] Service not initialized");
      return false;
    }

    try {
      await this.transporter.verify();
      console.log("[SMTP] Connection verified successfully");
      return true;
    } catch (error) {
      console.error("[SMTP] Connection verification failed:", error);
      return false;
    }
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      initialized: this.transporter !== null,
      config: this.config ? { host: this.config.host, port: this.config.port } : null,
    };
  }
}

// Export singleton instance
export const smtpService = new SMTPService();

/**
 * Initialize SMTP with environment variables
 */
export function initializeSMTP() {
  const config: SMTPConfig = {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASSWORD || "",
    },
    from: process.env.SMTP_FROM || "noreply@codelearnify.com",
  };

  if (!config.auth.user || !config.auth.pass) {
    console.warn("[SMTP] Email credentials not configured. Email sending will be disabled.");
    return false;
  }

  smtpService.initialize(config);
  return true;
}

/**
 * Email template helpers
 */
export const emailTemplates = {
  /**
   * Streak reminder email
   */
  streakReminder: (userName: string, streakDays: number, nextMilestone: number) => ({
    subject: `🔥 Keep Your Streak Alive! ${streakDays} Days Strong`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #ff6b35;">🔥 Keep Your Streak Alive!</h1>
        <p>Hi ${userName},</p>
        <p>You're on a <strong>${streakDays}-day learning streak</strong>! That's amazing!</p>
        <p>You're just <strong>${nextMilestone - streakDays} days away</strong> from reaching the <strong>${nextMilestone}-day milestone</strong> and earning a special badge.</p>
        <p style="background-color: #f0f0f0; padding: 15px; border-radius: 5px;">
          <strong>Keep learning today to maintain your streak!</strong>
        </p>
        <a href="https://codelearnify.com/dashboard" style="display: inline-block; background-color: #ff6b35; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px;">
          Continue Learning
        </a>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="font-size: 12px; color: #666;">
          You're receiving this email because you have streak reminders enabled. 
          <a href="https://codelearnify.com/notification-preferences">Manage preferences</a>
        </p>
      </div>
    `,
  }),

  /**
   * Referral bonus email
   */
  referralBonus: (userName: string, referredName: string, bonusXP: number, tier: string) => ({
    subject: `🎉 Referral Bonus Earned! +${bonusXP} XP`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4CAF50;">🎉 Referral Bonus Earned!</h1>
        <p>Hi ${userName},</p>
        <p><strong>${referredName}</strong> just signed up using your referral link!</p>
        <p style="background-color: #e8f5e9; padding: 15px; border-radius: 5px; font-size: 18px; font-weight: bold;">
          You earned <span style="color: #4CAF50;">+${bonusXP} XP</span> and advanced to <span style="color: #4CAF50;">${tier} Tier</span>!
        </p>
        <p>Keep referring friends to unlock more rewards and exclusive badges!</p>
        <a href="https://codelearnify.com/referral" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px;">
          View Your Referrals
        </a>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="font-size: 12px; color: #666;">
          <a href="https://codelearnify.com/notification-preferences">Manage preferences</a>
        </p>
      </div>
    `,
  }),

  /**
   * Achievement unlocked email
   */
  achievementUnlocked: (userName: string, achievementName: string, xpReward: number) => ({
    subject: `🏆 Achievement Unlocked: ${achievementName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #FFB300;">🏆 Achievement Unlocked!</h1>
        <p>Hi ${userName},</p>
        <p style="background-color: #fff8e1; padding: 15px; border-radius: 5px; font-size: 16px; font-weight: bold;">
          Congratulations! You've unlocked: <span style="color: #FFB300;">${achievementName}</span>
        </p>
        <p style="background-color: #fff8e1; padding: 15px; border-radius: 5px; margin-top: 10px;">
          Reward: <span style="color: #FFB300;">+${xpReward} XP</span>
        </p>
        <p>Keep up the great work and unlock more achievements!</p>
        <a href="https://codelearnify.com/profile" style="display: inline-block; background-color: #FFB300; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px;">
          View Your Profile
        </a>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="font-size: 12px; color: #666;">
          <a href="https://codelearnify.com/notification-preferences">Manage preferences</a>
        </p>
      </div>
    `,
  }),

  /**
   * Event invitation email
   */
  eventInvitation: (
    userName: string,
    eventName: string,
    eventDate: string,
    eventTime: string,
    eventDescription: string
  ) => ({
    subject: `📅 You're Invited: ${eventName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2196F3;">📅 You're Invited!</h1>
        <p>Hi ${userName},</p>
        <p>We'd love to have you join us for:</p>
        <div style="background-color: #e3f2fd; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h2 style="color: #2196F3; margin-top: 0;">${eventName}</h2>
          <p><strong>📅 Date:</strong> ${eventDate}</p>
          <p><strong>⏰ Time:</strong> ${eventTime}</p>
          <p><strong>📝 Description:</strong> ${eventDescription}</p>
        </div>
        <a href="https://codelearnify.com/events" style="display: inline-block; background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px;">
          Register Now
        </a>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="font-size: 12px; color: #666;">
          <a href="https://codelearnify.com/notification-preferences">Manage preferences</a>
        </p>
      </div>
    `,
  }),

  /**
   * Certificate earned email
   */
  certificateEarned: (userName: string, courseName: string, completionDate: string) => ({
    subject: `🎓 Certificate Earned: ${courseName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #9C27B0;">🎓 Congratulations!</h1>
        <p>Hi ${userName},</p>
        <p>You have successfully completed:</p>
        <div style="background-color: #f3e5f5; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center;">
          <h2 style="color: #9C27B0; margin: 0;">${courseName}</h2>
          <p style="color: #666; margin: 10px 0;">Completed on ${completionDate}</p>
        </div>
        <p>Your certificate is ready to download and share with your network!</p>
        <a href="https://codelearnify.com/certificates" style="display: inline-block; background-color: #9C27B0; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px;">
          Download Certificate
        </a>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="font-size: 12px; color: #666;">
          <a href="https://codelearnify.com/notification-preferences">Manage preferences</a>
        </p>
      </div>
    `,
  }),
};
