declare const Deno: {
  serve: (handler: (req: Request) => Promise<Response>) => void;
  env: {
    get: (key: string) => string | undefined;
  };
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  to: string;
  subject: string;
  template: 'assessment_sent' | 'assessment_submitted' | 'assessment_approved' | 'assessment_revision';
  data: {
    vendorName?: string;
    organizationName?: string;
    assessmentName?: string;
    assessmentId?: string;
    portalUrl?: string;
    comments?: string;
    dueDate?: string;
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Import Supabase client
    // @ts-expect-error - Dynamic import for Supabase client in Edge Functions
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2')
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { to, subject, template, data }: EmailRequest = await req.json()

    // Validate required fields
    if (!to || !subject || !template) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: to, subject, template' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const siteUrl = Deno.env.get('SITE_URL') || 'https://vendortal.vercel.app';
    const portalUrl = data.portalUrl || `${siteUrl}/vendor-assessments/${data.assessmentId}`;

    // Generate email content based on template
    let emailBody = '';
    let emailSubject = subject;

    switch (template) {
      case 'assessment_sent':
        emailSubject = `New Assessment Request: ${data.assessmentName || 'Security Assessment'}`;
        emailBody = `
          <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #7C4DFF;">New Assessment Request</h2>
                <p>Hello ${data.vendorName || 'Vendor'},</p>
                <p>You have been requested to complete a security assessment by <strong>${data.organizationName || 'our organization'}</strong>.</p>
                <p><strong>Assessment:</strong> ${data.assessmentName || 'Security Assessment'}</p>
                ${data.dueDate ? `<p><strong>Due Date:</strong> ${data.dueDate}</p>` : ''}
                <p>Please complete the assessment using the secure portal link below:</p>
                <p style="text-align: center; margin: 30px 0;">
                  <a href="${portalUrl}" style="background-color: #7C4DFF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                    Access Assessment Portal
                  </a>
                </p>
                <p>If you have any questions, please contact the requesting organization.</p>
                <p style="margin-top: 30px; font-size: 12px; color: #666;">
                  This is an automated message from VendorTal™ Risk Review.
                </p>
              </div>
            </body>
          </html>
        `;
        break;

      case 'assessment_submitted':
        emailSubject = `Assessment Submitted: ${data.assessmentName || 'Security Assessment'}`;
        emailBody = `
          <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #7C4DFF;">Assessment Submitted</h2>
                <p>Hello,</p>
                <p>The vendor <strong>${data.vendorName || 'Vendor'}</strong> has submitted their assessment response.</p>
                <p><strong>Assessment:</strong> ${data.assessmentName || 'Security Assessment'}</p>
                <p>You can review the assessment in your dashboard.</p>
                <p style="margin-top: 30px; font-size: 12px; color: #666;">
                  This is an automated message from VendorTal™ Risk Review.
                </p>
              </div>
            </body>
          </html>
        `;
        break;

      case 'assessment_approved':
        emailSubject = `Assessment Approved: ${data.assessmentName || 'Security Assessment'}`;
        emailBody = `
          <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #16A34A;">Assessment Approved</h2>
                <p>Hello ${data.vendorName || 'Vendor'},</p>
                <p>Your assessment has been reviewed and <strong>approved</strong> by ${data.organizationName || 'the requesting organization'}.</p>
                <p><strong>Assessment:</strong> ${data.assessmentName || 'Security Assessment'}</p>
                <p>Thank you for completing the assessment.</p>
                <p style="margin-top: 30px; font-size: 12px; color: #666;">
                  This is an automated message from VendorTal™ Risk Review.
                </p>
              </div>
            </body>
          </html>
        `;
        break;

      case 'assessment_revision':
        emailSubject = `Assessment Revision Requested: ${data.assessmentName || 'Security Assessment'}`;
        emailBody = `
          <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #EA580C;">Revision Requested</h2>
                <p>Hello ${data.vendorName || 'Vendor'},</p>
                <p>Your assessment has been reviewed by ${data.organizationName || 'the requesting organization'}, and they have requested revisions.</p>
                <p><strong>Assessment:</strong> ${data.assessmentName || 'Security Assessment'}</p>
                ${data.comments ? `
                  <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 20px 0;">
                    <p style="margin: 0;"><strong>Comments:</strong></p>
                    <p style="margin: 10px 0 0 0; white-space: pre-wrap;">${data.comments}</p>
                  </div>
                ` : ''}
                <p>Please review the comments and update your assessment using the portal link below:</p>
                <p style="text-align: center; margin: 30px 0;">
                  <a href="${portalUrl}" style="background-color: #7C4DFF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                    Access Assessment Portal
                  </a>
                </p>
                <p style="margin-top: 30px; font-size: 12px; color: #666;">
                  This is an automated message from VendorTal™ Risk Review.
                </p>
              </div>
            </body>
          </html>
        `;
        break;
    }

    // Send email using Resend API
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const fromEmail = Deno.env.get('RESEND_FROM_EMAIL') || 'VendorTal Risk Review <noreply@vendortal.com>';
    
    let emailStatus = 'failed';
    let emailError: string | null = null;
    
    if (resendApiKey) {
      try {
        // Create plain text version of email
        const plainTextBody = emailBody
          .replace(/<[^>]*>/g, '') // Remove HTML tags
          .replace(/&nbsp;/g, ' ')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .trim();

        // Send email via Resend API
        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [to],
            subject: emailSubject,
            html: emailBody.trim(),
            text: plainTextBody,
          }),
        });

        if (!resendResponse.ok) {
          const errorData = await resendResponse.json();
          throw new Error(`Resend API error: ${errorData.message || resendResponse.statusText}`);
        }

        const resendData = await resendResponse.json();
        emailStatus = 'sent';
        console.log('Email sent successfully via Resend:', resendData.id);
      } catch (error) {
        emailError = error instanceof Error ? error.message : 'Unknown error';
        console.error('Failed to send email via Resend:', error);
        // Continue to log in database even if email fails
      }
    } else {
      emailError = 'RESEND_API_KEY not configured';
      console.warn('RESEND_API_KEY not set - email not sent. Email would be sent to:', to);
    }

    // Store email notification in database for tracking
    const { error: dbError } = await supabaseClient
      .from('vs_email_notifications')
      .insert({
        to_email: to,
        subject: emailSubject,
        template: template,
        status: emailStatus,
        sent_at: emailStatus === 'sent' ? new Date().toISOString() : null,
        error_message: emailError,
        metadata: data
      });

    if (dbError) {
      console.error('Failed to log email notification:', dbError);
      // Don't fail the request if logging fails
    }

    // Return error if email failed and API key is configured
    if (emailStatus === 'failed' && resendApiKey) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to send email',
          details: emailError
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: emailStatus === 'sent', 
        message: emailStatus === 'sent' 
          ? 'Email notification sent successfully' 
          : 'Email notification logged (email service not configured)',
        template: template,
        status: emailStatus
      }),
      { 
        status: emailStatus === 'sent' ? 200 : 202, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

