/**
 * Email Templates for Codelearnify Platform
 * Handles streak reminders, referral bonuses, achievements, and events
 */

export interface EmailTemplate {
  id: string;
  subject: string;
  preview: string;
  template: (data: Record<string, any>) => string;
}

/**
 * Streak Reminder Email Template
 */
export const streakReminderTemplate: EmailTemplate = {
  id: "streak_reminder",
  subject: "🔥 Keep Your Streak Alive! Complete a Lesson Today",
  preview: "You have a {streak_days}-day streak! Complete a lesson to maintain it.",
  template: (data) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; }
    .header { text-align: center; color: #ff6b35; margin-bottom: 20px; }
    .flame { font-size: 48px; margin-bottom: 10px; }
    .content { color: #333; line-height: 1.6; }
    .streak-info { background-color: #fff3e0; padding: 15px; border-radius: 5px; margin: 20px 0; }
    .streak-number { font-size: 32px; font-weight: bold; color: #ff6b35; }
    .cta-button { display: inline-block; background-color: #ff6b35; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="flame">🔥</div>
      <h1>Keep Your Streak Alive!</h1>
    </div>
    
    <div class="content">
      <p>Hi ${data.userName},</p>
      
      <p>You're on an amazing learning streak! Don't let it break today.</p>
      
      <div class="streak-info">
        <div class="streak-number">${data.streakDays}</div>
        <p>days of continuous learning</p>
        <p>Next milestone: ${data.nextMilestone} days (${data.daysUntilMilestone} more to go!)</p>
      </div>
      
      <p>Complete any lesson, exercise, or challenge today to keep your streak going. Your learning momentum is incredible!</p>
      
      <p><strong>Streak Rewards:</strong></p>
      <ul>
        <li>+${data.streakBonus} XP for completing a lesson today</li>
        <li>Unlock new badges as you reach milestones</li>
        <li>Compete on the streak leaderboard</li>
      </ul>
      
      <a href="${data.actionUrl}" class="cta-button">Start Learning Now</a>
    </div>
    
    <div class="footer">
      <p>© 2026 Codelearnify. All rights reserved.</p>
      <p><a href="${data.preferencesUrl}">Manage notification preferences</a></p>
    </div>
  </div>
</body>
</html>
  `,
};

/**
 * Referral Bonus Email Template
 */
export const referralBonusTemplate: EmailTemplate = {
  id: "referral_bonus",
  subject: "🎉 Referral Bonus Earned! +{bonus_xp} XP",
  preview: "{referred_name} completed their first course. You earned {bonus_xp} XP!",
  template: (data) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; }
    .header { text-align: center; color: #6c5ce7; margin-bottom: 20px; }
    .celebration { font-size: 48px; margin-bottom: 10px; }
    .content { color: #333; line-height: 1.6; }
    .reward-box { background-color: #f0e6ff; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #6c5ce7; }
    .reward-amount { font-size: 36px; font-weight: bold; color: #6c5ce7; }
    .tier-badge { display: inline-block; background-color: #6c5ce7; color: white; padding: 8px 16px; border-radius: 20px; margin-top: 10px; }
    .cta-button { display: inline-block; background-color: #6c5ce7; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="celebration">🎉</div>
      <h1>Referral Bonus Earned!</h1>
    </div>
    
    <div class="content">
      <p>Hi ${data.userName},</p>
      
      <p><strong>${data.referredName}</strong> just completed their first course on Codelearnify! 🎓</p>
      
      <div class="reward-box">
        <p>You've earned:</p>
        <div class="reward-amount">+${data.bonusXP} XP</div>
        ${data.bonusCourse ? `<p>+ Free course: <strong>${data.bonusCourse}</strong></p>` : ""}
        <div class="tier-badge">${data.tier} Tier</div>
      </div>
      
      <p><strong>Your Referral Progress:</strong></p>
      <ul>
        <li>Total Referrals: ${data.totalReferrals}</li>
        <li>Total Bonus XP: ${data.totalBonusXP}</li>
        <li>Next Tier: ${data.nextTier} (${data.referralsUntilNextTier} more referrals)</li>
      </ul>
      
      <p>Keep sharing your referral code to unlock higher tiers and earn more rewards!</p>
      
      <a href="${data.referralUrl}" class="cta-button">View Your Referrals</a>
    </div>
    
    <div class="footer">
      <p>© 2026 Codelearnify. All rights reserved.</p>
      <p><a href="${data.preferencesUrl}">Manage notification preferences</a></p>
    </div>
  </div>
</body>
</html>
  `,
};

/**
 * Achievement Unlocked Email Template
 */
export const achievementTemplate: EmailTemplate = {
  id: "achievement_unlocked",
  subject: "🏆 Achievement Unlocked: {achievement_name}",
  preview: "You've unlocked a new achievement! {achievement_name}",
  template: (data) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; }
    .header { text-align: center; color: #ffd700; margin-bottom: 20px; }
    .trophy { font-size: 48px; margin-bottom: 10px; }
    .content { color: #333; line-height: 1.6; }
    .achievement-box { background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%); padding: 30px; border-radius: 10px; margin: 20px 0; text-align: center; }
    .achievement-name { font-size: 28px; font-weight: bold; color: #333; margin: 10px 0; }
    .achievement-icon { font-size: 64px; margin-bottom: 10px; }
    .achievement-description { color: #555; margin-top: 10px; }
    .reward-info { background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin-top: 15px; }
    .cta-button { display: inline-block; background-color: #ffd700; color: #333; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; font-weight: bold; }
    .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="trophy">🏆</div>
      <h1>Achievement Unlocked!</h1>
    </div>
    
    <div class="content">
      <p>Hi ${data.userName},</p>
      
      <div class="achievement-box">
        <div class="achievement-icon">${data.icon}</div>
        <div class="achievement-name">${data.achievementName}</div>
        <div class="achievement-description">${data.description}</div>
      </div>
      
      <div class="reward-info">
        <p><strong>Rewards:</strong></p>
        <ul>
          <li>+${data.xpReward} XP</li>
          <li>New Badge: ${data.badgeName}</li>
          ${data.specialReward ? `<li>${data.specialReward}</li>` : ""}
        </ul>
      </div>
      
      <p>You're making amazing progress on Codelearnify! Keep up the great work and unlock more achievements.</p>
      
      <a href="${data.profileUrl}" class="cta-button">View Your Achievements</a>
    </div>
    
    <div class="footer">
      <p>© 2026 Codelearnify. All rights reserved.</p>
      <p><a href="${data.preferencesUrl}">Manage notification preferences</a></p>
    </div>
  </div>
</body>
</html>
  `,
};

/**
 * Community Event Email Template
 */
export const eventInvitationTemplate: EmailTemplate = {
  id: "event_invitation",
  subject: "🎯 You're Invited: {event_name}",
  preview: "Join us for {event_name} on {event_date}",
  template: (data) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; }
    .header { text-align: center; color: #00b894; margin-bottom: 20px; }
    .event-icon { font-size: 48px; margin-bottom: 10px; }
    .content { color: #333; line-height: 1.6; }
    .event-details { background-color: #e8f5e9; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #00b894; }
    .event-title { font-size: 24px; font-weight: bold; color: #00b894; margin-bottom: 10px; }
    .detail-row { margin: 8px 0; }
    .detail-label { font-weight: bold; color: #555; }
    .cta-button { display: inline-block; background-color: #00b894; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
    .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="event-icon">🎯</div>
      <h1>You're Invited!</h1>
    </div>
    
    <div class="content">
      <p>Hi ${data.userName},</p>
      
      <p>We'd love to have you join us for an exciting event!</p>
      
      <div class="event-details">
        <div class="event-title">${data.eventName}</div>
        <div class="detail-row">
          <span class="detail-label">📅 Date:</span> ${data.eventDate}
        </div>
        <div class="detail-row">
          <span class="detail-label">🕐 Time:</span> ${data.eventTime}
        </div>
        <div class="detail-row">
          <span class="detail-label">📍 Location:</span> ${data.eventLocation}
        </div>
        <div class="detail-row">
          <span class="detail-label">👥 Participants:</span> ${data.participantCount} registered
        </div>
      </div>
      
      <p><strong>Event Description:</strong></p>
      <p>${data.eventDescription}</p>
      
      <p><strong>What to Expect:</strong></p>
      <ul>
        ${data.highlights.map((h: string) => `<li>${h}</li>`).join("")}
      </ul>
      
      <a href="${data.registerUrl}" class="cta-button">Register Now</a>
    </div>
    
    <div class="footer">
      <p>© 2026 Codelearnify. All rights reserved.</p>
      <p><a href="${data.preferencesUrl}">Manage notification preferences</a></p>
    </div>
  </div>
</body>
</html>
  `,
};

/**
 * Course Completion Certificate Email Template
 */
export const certificateTemplate: EmailTemplate = {
  id: "certificate_earned",
  subject: "🎓 Congratulations! Your Certificate is Ready",
  preview: "You've completed {course_name}. Download your certificate!",
  template: (data) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; }
    .header { text-align: center; color: #2c3e50; margin-bottom: 20px; }
    .graduation { font-size: 48px; margin-bottom: 10px; }
    .content { color: #333; line-height: 1.6; }
    .certificate-preview { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; border-radius: 10px; margin: 20px 0; text-align: center; color: white; }
    .certificate-title { font-size: 32px; font-weight: bold; margin: 20px 0; }
    .course-name { font-size: 24px; margin: 10px 0; }
    .completion-date { font-size: 14px; margin-top: 20px; }
    .stats { background-color: #f0f0f0; padding: 20px; border-radius: 5px; margin: 20px 0; }
    .stat-item { display: inline-block; margin: 10px 20px; }
    .stat-number { font-size: 24px; font-weight: bold; color: #667eea; }
    .cta-button { display: inline-block; background-color: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
    .secondary-button { display: inline-block; background-color: #e0e0e0; color: #333; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; margin-left: 10px; }
    .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="graduation">🎓</div>
      <h1>Congratulations!</h1>
    </div>
    
    <div class="content">
      <p>Hi ${data.userName},</p>
      
      <p>You've successfully completed <strong>${data.courseName}</strong>! Your certificate is ready to download and share.</p>
      
      <div class="certificate-preview">
        <div>Certificate of Completion</div>
        <div class="certificate-title">${data.courseName}</div>
        <div class="course-name">Awarded to ${data.userName}</div>
        <div class="completion-date">Completed on ${data.completionDate}</div>
      </div>
      
      <div class="stats">
        <div class="stat-item">
          <div class="stat-number">${data.lessonsCompleted}</div>
          <div>Lessons Completed</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">${data.xpEarned}</div>
          <div>XP Earned</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">${data.skillsLearned}</div>
          <div>Skills Learned</div>
        </div>
      </div>
      
      <p>Share your achievement on social media and add this certificate to your LinkedIn profile!</p>
      
      <a href="${data.certificateUrl}" class="cta-button">Download Certificate</a>
      <a href="${data.shareUrl}" class="secondary-button">Share on LinkedIn</a>
    </div>
    
    <div class="footer">
      <p>© 2026 Codelearnify. All rights reserved.</p>
      <p><a href="${data.preferencesUrl}">Manage notification preferences</a></p>
    </div>
  </div>
</body>
</html>
  `,
};

/**
 * Email template registry
 */
export const emailTemplates: Record<string, EmailTemplate> = {
  streak_reminder: streakReminderTemplate,
  referral_bonus: referralBonusTemplate,
  achievement_unlocked: achievementTemplate,
  event_invitation: eventInvitationTemplate,
  certificate_earned: certificateTemplate,
};

/**
 * Get email template by ID
 */
export function getEmailTemplate(templateId: string): EmailTemplate | null {
  return emailTemplates[templateId] || null;
}

/**
 * Render email template with data
 */
export function renderEmailTemplate(templateId: string, data: Record<string, any>): { subject: string; html: string } | null {
  const template = getEmailTemplate(templateId);
  if (!template) return null;

  // Replace template variables in subject
  let subject = template.subject;
  Object.entries(data).forEach(([key, value]) => {
    subject = subject.replace(`{${key}}`, String(value));
  });

  return {
    subject,
    html: template.template(data),
  };
}
