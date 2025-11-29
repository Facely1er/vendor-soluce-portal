// Email Templates for Marketing Automation
// File: src/templates/emailTemplates.ts

export interface EmailTemplateData {
  name: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailTemplates {
  private static baseUrl = import.meta.env.VITE_APP_URL || 'https://vendorsoluce.com';

  /**
   * Welcome Series - Email 1: Welcome & Quick Start
   */
  static welcomeEmail1(data: { name: string; dashboardUrl?: string }): EmailTemplateData {
    return {
      name: 'Welcome Email 1 - Quick Start',
      subject: 'Welcome to VendorSoluce - Let\'s Get Started!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Welcome to VendorSoluce!</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>Hi ${data.name || 'there'},</p>
            <p>Thanks for signing up! We're excited to help you manage your supply chain risk.</p>
            <h3 style="color: #10b981;">Get Started in 3 Steps:</h3>
            <ol style="padding-left: 20px;">
              <li style="margin: 10px 0;"><strong>Add Your First Vendor</strong> - Start tracking your suppliers</li>
              <li style="margin: 10px 0;"><strong>Run a Risk Assessment</strong> - Evaluate vendor security</li>
              <li style="margin: 10px 0;"><strong>Analyze an SBOM</strong> - Check for vulnerabilities</li>
            </ol>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.dashboardUrl || `${this.baseUrl}/dashboard`}" style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Go to Dashboard</a>
            </div>
            <p>Need help? Check out our <a href="${this.baseUrl}/docs">documentation</a> or reply to this email.</p>
            <p>Best regards,<br>The VendorSoluce Team</p>
          </div>
        </body>
        </html>
      `,
      text: `Welcome to VendorSoluce!\n\nHi ${data.name || 'there'},\n\nThanks for signing up! Get started by:\n1. Adding your first vendor\n2. Running a risk assessment\n3. Analyzing an SBOM\n\nVisit your dashboard: ${data.dashboardUrl || `${this.baseUrl}/dashboard`}`,
    };
  }

  /**
   * Welcome Series - Email 2: Feature Highlight
   */
  static welcomeEmail2(data: { name: string }): EmailTemplateData {
    return {
      name: 'Welcome Email 2 - Feature Highlight',
      subject: 'Discover VendorSoluce\'s Powerful Features',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Powerful Features at Your Fingertips</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>Hi ${data.name || 'there'},</p>
            <p>Here are some features that can help you reduce vendor risk:</p>
            <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #10b981;">
              <h3 style="margin-top: 0; color: #10b981;">🔍 NIST SP 800-161 Compliance</h3>
              <p>Built-in templates for supply chain security assessments aligned with NIST guidelines.</p>
            </div>
            <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #3b82f6;">
              <h3 style="margin-top: 0; color: #3b82f6;">📦 SBOM Analysis</h3>
              <p>Upload and analyze Software Bills of Materials to identify vulnerabilities and license risks.</p>
            </div>
            <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #8b5cf6;">
              <h3 style="margin-top: 0; color: #8b5cf6;">📊 Risk Dashboard</h3>
              <p>Visualize vendor risk scores and track compliance metrics in real-time.</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${this.baseUrl}/features" style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Explore Features</a>
            </div>
            <p>Best regards,<br>The VendorSoluce Team</p>
          </div>
        </body>
        </html>
      `,
    };
  }

  /**
   * Welcome Series - Email 3: Customer Success Story
   */
  static welcomeEmail3(data: { name: string }): EmailTemplateData {
    return {
      name: 'Welcome Email 3 - Success Story',
      subject: 'How Companies Reduce Vendor Risk with VendorSoluce',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Real Results from Real Customers</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>Hi ${data.name || 'there'},</p>
            <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 5px; border: 1px solid #e5e7eb;">
              <p style="font-style: italic; margin: 0 0 15px 0;">"VendorSoluce helped us reduce vendor risk assessment time by 80%. What used to take weeks now takes hours."</p>
              <p style="margin: 0; color: #6b7280;">— Sarah Chen, CISO at TechCorp</p>
            </div>
            <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 5px; border: 1px solid #e5e7eb;">
              <p style="font-style: italic; margin: 0 0 15px 0;">"The SBOM analysis feature caught critical vulnerabilities we would have missed. It's been a game-changer."</p>
              <p style="margin: 0; color: #6b7280;">— Michael Rodriguez, Security Manager at DataFlow Inc.</p>
            </div>
            <p>Ready to see similar results? Start your first assessment today!</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${this.baseUrl}/dashboard" style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Get Started</a>
            </div>
            <p>Best regards,<br>The VendorSoluce Team</p>
          </div>
        </body>
        </html>
      `,
    };
  }

  /**
   * Welcome Series - Email 4: Advanced Tips
   */
  static welcomeEmail4(data: { name: string }): EmailTemplateData {
    return {
      name: 'Welcome Email 4 - Advanced Tips',
      subject: 'Pro Tips: Get the Most Out of VendorSoluce',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Pro Tips for Success</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>Hi ${data.name || 'there'},</p>
            <p>Here are some tips to maximize your vendor risk management:</p>
            <div style="background: white; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #10b981;">
              <strong>💡 Tip #1: Use Custom Questionnaires</strong>
              <p style="margin: 5px 0 0 0;">Create industry-specific assessment templates for faster evaluations.</p>
            </div>
            <div style="background: white; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #3b82f6;">
              <strong>💡 Tip #2: Set Up Automated Reminders</strong>
              <p style="margin: 5px 0 0 0;">Never miss a vendor assessment renewal with automated notifications.</p>
            </div>
            <div style="background: white; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #8b5cf6;">
              <strong>💡 Tip #3: Export Reports Regularly</strong>
              <p style="margin: 5px 0 0 0;">Generate compliance reports for audits and stakeholder reviews.</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${this.baseUrl}/docs" style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">View Documentation</a>
            </div>
            <p>Best regards,<br>The VendorSoluce Team</p>
          </div>
        </body>
        </html>
      `,
    };
  }

  /**
   * Welcome Series - Email 5: Upgrade Prompt
   */
  static welcomeEmail5(data: { name: string; currentTier?: string }): EmailTemplateData {
    const isFreeTier = !data.currentTier || data.currentTier === 'free';
    
    return {
      name: 'Welcome Email 5 - Upgrade Prompt',
      subject: isFreeTier ? 'Unlock Full Potential with Professional Plan' : 'You\'re Doing Great!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">${isFreeTier ? 'Ready to Level Up?' : 'Keep Up the Great Work!'}</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>Hi ${data.name || 'there'},</p>
            ${isFreeTier ? `
              <p>You've been using VendorSoluce for a while. Ready to unlock more features?</p>
              <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 5px; border: 2px solid #10b981;">
                <h3 style="margin-top: 0; color: #10b981;">Professional Plan - $129/month</h3>
                <ul style="list-style: none; padding: 0;">
                  <li style="padding: 5px 0;">✓ Up to 100 vendor assessments</li>
                  <li style="padding: 5px 0;">✓ Advanced SBOM analysis</li>
                  <li style="padding: 5px 0;">✓ NIST SP 800-161 + CMMC compliance</li>
                  <li style="padding: 5px 0;">✓ Priority support</li>
                  <li style="padding: 5px 0;">✓ API access</li>
                </ul>
                <p style="margin: 15px 0 0 0;"><strong>Save 20% with annual billing!</strong></p>
              </div>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${this.baseUrl}/pricing" style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">View Plans</a>
              </div>
            ` : `
              <p>You're making great progress! Keep using VendorSoluce to manage your vendor risk effectively.</p>
              <p>If you need help or have questions, don't hesitate to reach out.</p>
            `}
            <p>Best regards,<br>The VendorSoluce Team</p>
          </div>
        </body>
        </html>
      `,
    };
  }

  /**
   * Abandoned Cart - User started checkout but didn't complete
   */
  static abandonedCartEmail(data: { name: string; planName?: string; pricingUrl?: string }): EmailTemplateData {
    return {
      name: 'Abandoned Cart - Checkout Reminder',
      subject: 'Complete Your VendorSoluce Subscription',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Don't Miss Out!</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>Hi ${data.name || 'there'},</p>
            <p>We noticed you started the checkout process but didn't complete it. ${data.planName ? `Your ${data.planName} plan` : 'Your subscription'} is waiting for you!</p>
            <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #10b981;">
              <h3 style="margin-top: 0;">What You'll Get:</h3>
              <ul style="list-style: none; padding: 0;">
                <li style="padding: 5px 0;">✓ Complete vendor risk management</li>
                <li style="padding: 5px 0;">✓ NIST SP 800-161 compliance tools</li>
                <li style="padding: 5px 0;">✓ SBOM analysis & vulnerability scanning</li>
                <li style="padding: 5px 0;">✓ Priority support</li>
              </ul>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.pricingUrl || `${this.baseUrl}/pricing`}" style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Complete Subscription</a>
            </div>
            <p>Questions? Reply to this email - we're here to help!</p>
            <p>Best regards,<br>The VendorSoluce Team</p>
          </div>
        </body>
        </html>
      `,
    };
  }

  /**
   * Win-Back Email - For inactive users
   */
  static winBackEmail(data: { name: string; lastActiveDate?: string; dashboardUrl?: string }): EmailTemplateData {
    return {
      name: 'Win-Back - Re-engagement',
      subject: 'We Miss You - Come Back to VendorSoluce',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">We Miss You!</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>Hi ${data.name || 'there'},</p>
            <p>It's been a while since you last used VendorSoluce. We've added new features and improvements:</p>
            <ul style="padding-left: 20px;">
              <li style="margin: 10px 0;">Enhanced SBOM analysis with real-time vulnerability detection</li>
              <li style="margin: 10px 0;">New NIST SP 800-161 assessment templates</li>
              <li style="margin: 10px 0;">Improved risk dashboard with better visualizations</li>
              <li style="margin: 10px 0;">Faster vendor assessment workflows</li>
            </ul>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.dashboardUrl || `${this.baseUrl}/dashboard`}" style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Return to Dashboard</a>
            </div>
            <p>Your data is safe and waiting for you. Come back and see what's new!</p>
            <p>Best regards,<br>The VendorSoluce Team</p>
          </div>
        </body>
        </html>
      `,
    };
  }

  /**
   * Feature Announcement Email
   */
  static featureAnnouncementEmail(data: { name: string; featureName: string; featureDescription: string; featureUrl?: string }): EmailTemplateData {
    return {
      name: 'Feature Announcement',
      subject: `New Feature: ${data.featureName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">🎉 New Feature Available!</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>Hi ${data.name || 'there'},</p>
            <h2 style="color: #10b981;">${data.featureName}</h2>
            <p>${data.featureDescription}</p>
            ${data.featureUrl ? `
              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.featureUrl}" style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Try It Now</a>
              </div>
            ` : ''}
            <p>We'd love to hear your feedback!</p>
            <p>Best regards,<br>The VendorSoluce Team</p>
          </div>
        </body>
        </html>
      `,
    };
  }
}

