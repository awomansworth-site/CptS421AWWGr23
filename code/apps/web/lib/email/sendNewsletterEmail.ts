/**
 * Email sending utility for AWW Newsletter.
 *
 * Default provider: Resend (https://resend.com)
 * Uses plain fetch — no SDK dependency required.
 *
 * Required env variables:
 *   RESEND_API_KEY          — Resend API key
 *   NEWSLETTER_FROM_EMAIL   — e.g. "AWW Newsletter <newsletter@awomansworth.org>"
 *   NEXT_PUBLIC_SITE_URL    — e.g. "https://awomansworth.org"
 */

export interface SendNewsletterOptions {
  to: string;
  subject: string;
  previewText: string;
  title: string;
  excerpt: string;
  articleUrl: string;
  unsubscribeUrl: string;
}

export interface SendResult {
  success: boolean;
  error?: string;
}

/** Build a clean, branded HTML email */
function buildHtml(opts: SendNewsletterOptions): string {
  const { title, previewText, excerpt, articleUrl, unsubscribeUrl } = opts;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://awomansworth.co";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escHtml(title)}</title>
  <!--[if mso]><style>td,th,div,p,a{font-family:Arial,sans-serif!important}</style><![endif]-->
</head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif">
  <!-- Preview text (hidden) -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all">
    ${escHtml(previewText || title)}&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f6f9">
    <tr>
      <td align="center" style="padding:32px 16px">
        <table width="600" cellpadding="0" cellspacing="0" border="0"
          style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08)">

          <!-- Header band -->
          <tr>
            <td style="background:linear-gradient(135deg,#0a3680 0%,#0d4ea6 60%,#f79520 100%);padding:32px 40px;text-align:center">
              <a href="${siteUrl}" style="text-decoration:none">
                <img src="${siteUrl}/branding/logo.png" alt="A Woman's Worth" width="80"
                  style="display:inline-block;margin-bottom:12px;border:0" />
              </a>
              <p style="margin:0;color:rgba(255,255,255,.75);font-size:13px;letter-spacing:1px;text-transform:uppercase">
                AWW Newsletter
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px">
              <h1 style="margin:0 0 16px;font-size:26px;font-weight:800;color:#004080;line-height:1.3">
                ${escHtml(title)}
              </h1>
              <p style="margin:0 0 28px;font-size:15px;color:#444;line-height:1.7">
                ${escHtml(excerpt)}
              </p>
              <!-- CTA button -->
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="border-radius:10px;background:#f7941D">
                    <a href="${articleUrl}"
                      style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:10px">
                      Read Full Article →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px">
              <hr style="border:none;border-top:1px solid #eee;margin:0" />
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;text-align:center">
              <p style="margin:0 0 8px;font-size:12px;color:#999">
                You're receiving this because you subscribed at
                <a href="${siteUrl}" style="color:#f7941D;text-decoration:none">awomansworth.org</a>
              </p>
              <p style="margin:0;font-size:12px;color:#bbb">
                <a href="${unsubscribeUrl}" style="color:#bbb">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Send a single newsletter email via Resend */
export async function sendNewsletterEmail(opts: SendNewsletterOptions): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.NEWSLETTER_FROM_EMAIL || "AWW Newsletter <newsletter@awomansworth.org>";

  if (!apiKey) {
    return { success: false, error: "RESEND_API_KEY is not configured." };
  }

  const html = buildHtml(opts);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [opts.to],
        subject: opts.subject,
        html,
      }),
    });

    if (res.ok) return { success: true };

    const body = await res.json().catch(() => ({}));
    return {
      success: false,
      error: (body as any)?.message ?? `Resend error ${res.status}`,
    };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
