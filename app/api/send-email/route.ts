import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Email service is not configured. Please add RESEND_API_KEY to your environment variables.' },
        { status: 500 }
      );
    }

    // Initialize Resend with API key
    const resend = new Resend(apiKey);

    const body = await request.json();
    const { to, subject, postId, postTitle, postBody, postAuthor, senderName } = body;

    // Validate required fields
    if (!to || !subject || !postTitle || !postBody) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create HTML email content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f8fafc;
            }
            .container {
              background: white;
              border-radius: 12px;
              padding: 32px;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            .header {
              border-bottom: 2px solid #e2e8f0;
              padding-bottom: 20px;
              margin-bottom: 24px;
            }
            .post-id {
              display: inline-block;
              background: linear-gradient(135deg, #3b82f6, #8b5cf6);
              color: white;
              padding: 4px 12px;
              border-radius: 6px;
              font-size: 12px;
              font-weight: 600;
              margin-bottom: 12px;
            }
            .post-title {
              font-size: 24px;
              font-weight: 700;
              color: #1f2937;
              margin: 0;
              text-transform: capitalize;
            }
            .post-author {
              color: #6b7280;
              font-size: 14px;
              margin-top: 8px;
            }
            .post-content {
              font-size: 16px;
              line-height: 1.7;
              color: #374151;
              margin: 24px 0;
              padding: 20px;
              background-color: #f9fafb;
              border-radius: 8px;
              border-left: 4px solid #3b82f6;
            }
            .footer {
              margin-top: 32px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              font-size: 12px;
              color: #6b7280;
              text-align: center;
            }
            .sender-info {
              background-color: #eff6ff;
              border: 1px solid #dbeafe;
              border-radius: 8px;
              padding: 16px;
              margin-bottom: 24px;
            }
            .sender-info strong {
              color: #1d4ed8;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="post-id">POST #${postId}</div>
              <h1 class="post-title">${postTitle}</h1>
              ${postAuthor ? `<div class="post-author">By ${postAuthor}</div>` : ''}
            </div>
            
            ${senderName ? `
              <div class="sender-info">
                <strong>${senderName}</strong> shared this post with you from the Post Dashboard.
              </div>
            ` : ''}
            
            <div class="post-content">
              ${postBody}
            </div>
            
            <div class="footer">
              <p>This email was sent from Post Dashboard.<br>
              If you didn't request this email, you can safely ignore it.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Create plain text version
    const textContent = `
${subject}

Post #${postId}: ${postTitle}
${postAuthor ? `By ${postAuthor}` : ''}

${senderName ? `${senderName} shared this post with you from the Post Dashboard.\n` : ''}

Content:
${postBody}

---
This email was sent from Post Dashboard.
If you didn't request this email, you can safely ignore it.
    `;

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Post Dashboard <onboarding@resend.dev>', // You can customize this later
      to: [to],
      subject: subject,
      html: htmlContent,
      text: textContent,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: data?.id,
      message: 'Email sent successfully'
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
