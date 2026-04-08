import nodemailer from 'nodemailer';
import { env } from '../config/env';

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  if (transporter) return transporter;
  if (!env.smtpHost || !env.smtpPort) {
    console.warn('SMTP not configured (SMTP_HOST, SMTP_PORT). Emails will not be sent.');
    return null;
  }
  transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpPort === 465,
    auth: env.smtpUser && env.smtpPass ? { user: env.smtpUser, pass: env.smtpPass } : undefined,
  });
  return transporter;
}

export interface InviteEmailParams {
  name: string;
  email: string;
  password: string;
  appUrl: string;
}

export function renderInviteEmail(params: InviteEmailParams): string {
  const { name, email, password, appUrl } = params;
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Your TaskFlow account</title></head>
<body style="font-family: system-ui, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #4f46e5;">Welcome to TaskFlow</h2>
  <p>Hi ${escapeHtml(name)},</p>
  <p>Your TaskFlow account has been created. Use the credentials below to sign in:</p>
  <p><strong>Email:</strong> ${escapeHtml(email)}<br><strong>Password:</strong> <code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">${escapeHtml(password)}</code></p>
  <p>Please change your password after your first login (from your profile or Forgot password).</p>
  <p><a href="${escapeHtml(appUrl)}/login" style="color: #4f46e5;">Sign in to TaskFlow</a></p>
  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
  <p style="font-size: 12px; color: #64748b;">This is an automated message. Do not reply.</p>
</body>
</html>
  `.trim();
}

export interface ForgotPasswordEmailParams {
  name: string;
  appUrl: string;
  resetLink: string;
}

export function renderForgotPasswordEmail(params: ForgotPasswordEmailParams): string {
  const { name, resetLink } = params;
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Reset your password</title></head>
<body style="font-family: system-ui, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #4f46e5;">Reset your TaskFlow password</h2>
  <p>Hi ${escapeHtml(name)},</p>
  <p>You requested a password reset. Click the link below to set a new password:</p>
  <p><a href="${escapeHtml(resetLink)}" style="color: #4f46e5;">Reset password</a></p>
  <p>If you didn't request this, you can ignore this email.</p>
  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
  <p style="font-size: 12px; color: #64748b;">This link will expire in 1 hour.</p>
</body>
</html>
  `.trim();
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function sendInviteEmail(params: InviteEmailParams): Promise<void> {
  const transport = getTransporter();
  if (!transport) return;
  await transport.sendMail({
    from: env.mailFrom,
    to: params.email,
    subject: 'Your TaskFlow account',
    html: renderInviteEmail(params),
  });
}

export async function sendForgotPasswordEmail(to: string, params: ForgotPasswordEmailParams): Promise<void> {
  const transport = getTransporter();
  if (!transport) return;
  await transport.sendMail({
    from: env.mailFrom,
    to,
    subject: 'Reset your TaskFlow password',
    html: renderForgotPasswordEmail(params),
  });
}

export interface ProjectInviteEmailParams {
  projectName: string;
  inviterName: string;
  appUrl: string;
}

export function renderProjectInviteEmail(params: ProjectInviteEmailParams): string {
  const { projectName, inviterName, appUrl } = params;
  const inboxUrl = `${appUrl}/inbox`;
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Project invitation</title></head>
<body style="font-family: system-ui, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #4f46e5;">Project invitation</h2>
  <p>You've been invited to the project <strong>${escapeHtml(projectName)}</strong> by ${escapeHtml(inviterName)}.</p>
  <p>Open your inbox in TaskFlow to accept or decline the invitation.</p>
  <p><a href="${escapeHtml(inboxUrl)}" style="color: #4f46e5;">Open inbox</a></p>
  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
  <p style="font-size: 12px; color: #64748b;">This is an automated message. Do not reply.</p>
</body>
</html>
  `.trim();
}

export async function sendProjectInviteEmail(to: string, params: ProjectInviteEmailParams): Promise<void> {
  const transport = getTransporter();
  if (!transport) return;
  await transport.sendMail({
    from: env.mailFrom,
    to,
    subject: `Project invitation: ${params.projectName}`,
    html: renderProjectInviteEmail(params),
  });
}

export interface WatcherNotificationParams {
  type: string;
  title: string;
  body?: string;
  issueKey: string;
  issueUrl: string;
}

export function renderWatcherNotificationEmail(params: WatcherNotificationParams): string {
  const { title, body, issueUrl } = params;
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${escapeHtml(title)}</title></head>
<body style="font-family: system-ui, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #4f46e5;">${escapeHtml(title)}</h2>
  ${body ? `<p>${escapeHtml(body)}</p>` : ''}
  <p><a href="${escapeHtml(issueUrl)}" style="color: #4f46e5;">View issue</a></p>
  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
  <p style="font-size: 12px; color: #64748b;">This is an automated message. Do not reply.</p>
</body>
</html>
  `.trim();
}

export async function sendWatcherNotificationEmail(to: string, params: WatcherNotificationParams): Promise<void> {
  const transport = getTransporter();
  if (!transport) return;
  await transport.sendMail({
    from: env.mailFrom,
    to,
    subject: params.title,
    html: renderWatcherNotificationEmail(params),
  });
}

// ── Customer Portal Email Templates ──────────────────────────────────────────

export function renderCustomerOrgAdminInviteEmail(
  name: string,
  email: string,
  password: string,
  orgName: string,
  appUrl: string
): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Welcome to ${escapeHtml(orgName)} Customer Portal</title></head>
<body style="font-family: system-ui, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #4f46e5;">Welcome to ${escapeHtml(orgName)} on TaskFlow</h2>
  <p>Hi ${escapeHtml(name)},</p>
  <p>Your customer portal account has been created as the Organization Admin for <strong>${escapeHtml(orgName)}</strong>. Use the credentials below to sign in:</p>
  <p><strong>Email:</strong> ${escapeHtml(email)}<br><strong>Temporary Password:</strong> <code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">${escapeHtml(password)}</code></p>
  <p>Please change your password after your first login.</p>
  <p><a href="${escapeHtml(appUrl)}/portal/login" style="color: #4f46e5;">Sign in to Customer Portal</a></p>
  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
  <p style="font-size: 12px; color: #64748b;">This is an automated message. Do not reply.</p>
</body>
</html>
  `.trim();
}

export function renderCustomerMemberInviteEmail(
  name: string,
  email: string,
  password: string,
  orgName: string,
  appUrl: string
): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>You've been invited to ${escapeHtml(orgName)}</title></head>
<body style="font-family: system-ui, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #4f46e5;">You've been invited to ${escapeHtml(orgName)}</h2>
  <p>Hi ${escapeHtml(name)},</p>
  <p>You've been invited to join the <strong>${escapeHtml(orgName)}</strong> customer portal. Use the credentials below to sign in:</p>
  <p><strong>Email:</strong> ${escapeHtml(email)}<br><strong>Temporary Password:</strong> <code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">${escapeHtml(password)}</code></p>
  <p>Please change your password after your first login.</p>
  <p><a href="${escapeHtml(appUrl)}/portal/login" style="color: #4f46e5;">Sign in to Customer Portal</a></p>
  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
  <p style="font-size: 12px; color: #64748b;">This is an automated message. Do not reply.</p>
</body>
</html>
  `.trim();
}

export function renderCustomerRequestSubmittedEmail(
  requesterName: string,
  requestTitle: string,
  orgName: string,
  appUrl: string
): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Request Submitted</title></head>
<body style="font-family: system-ui, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #4f46e5;">Request Submitted</h2>
  <p>Hi ${escapeHtml(requesterName)},</p>
  <p>Your request <strong>${escapeHtml(requestTitle)}</strong> has been submitted to <strong>${escapeHtml(orgName)}</strong> and is pending approval.</p>
  <p><a href="${escapeHtml(appUrl)}/portal/requests" style="color: #4f46e5;">View your requests</a></p>
  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
  <p style="font-size: 12px; color: #64748b;">This is an automated message. Do not reply.</p>
</body>
</html>
  `.trim();
}

export function renderCustomerRequestApprovedByOrgAdminEmail(
  requesterName: string,
  requestTitle: string,
  orgName: string,
  appUrl: string
): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Request Approved</title></head>
<body style="font-family: system-ui, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #4f46e5;">Request Approved by Org Admin</h2>
  <p>Hi ${escapeHtml(requesterName)},</p>
  <p>Your request <strong>${escapeHtml(requestTitle)}</strong> from <strong>${escapeHtml(orgName)}</strong> has been approved by your organization admin and is now pending TaskFlow review.</p>
  <p><a href="${escapeHtml(appUrl)}/portal/requests" style="color: #4f46e5;">View your requests</a></p>
  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
  <p style="font-size: 12px; color: #64748b;">This is an automated message. Do not reply.</p>
</body>
</html>
  `.trim();
}

export function renderCustomerRequestRejectedEmail(
  requesterName: string,
  requestTitle: string,
  reason: string,
  orgName: string,
  appUrl: string
): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Request Rejected</title></head>
<body style="font-family: system-ui, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #ef4444;">Request Rejected</h2>
  <p>Hi ${escapeHtml(requesterName)},</p>
  <p>Your request <strong>${escapeHtml(requestTitle)}</strong> from <strong>${escapeHtml(orgName)}</strong> has been rejected.</p>
  ${reason ? `<p><strong>Reason:</strong> ${escapeHtml(reason)}</p>` : ''}
  <p><a href="${escapeHtml(appUrl)}/portal/requests" style="color: #4f46e5;">View your requests</a></p>
  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
  <p style="font-size: 12px; color: #64748b;">This is an automated message. Do not reply.</p>
</body>
</html>
  `.trim();
}

export function renderTicketCreatedEmail(
  requesterName: string,
  requestTitle: string,
  issueKey: string,
  orgName: string,
  appUrl: string
): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Ticket Created</title></head>
<body style="font-family: system-ui, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #22c55e;">Ticket Created: ${escapeHtml(issueKey)}</h2>
  <p>Hi ${escapeHtml(requesterName)},</p>
  <p>Your request <strong>${escapeHtml(requestTitle)}</strong> from <strong>${escapeHtml(orgName)}</strong> has been approved and a ticket has been created: <strong>${escapeHtml(issueKey)}</strong>.</p>
  <p>Our team will begin working on it shortly.</p>
  <p><a href="${escapeHtml(appUrl)}/portal/requests" style="color: #4f46e5;">View your requests</a></p>
  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
  <p style="font-size: 12px; color: #64748b;">This is an automated message. Do not reply.</p>
</body>
</html>
  `.trim();
}

export function renderTfRejectedEmail(
  requesterName: string,
  requestTitle: string,
  reason: string,
  orgName: string,
  appUrl: string
): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Request Declined</title></head>
<body style="font-family: system-ui, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #ef4444;">Request Declined by TaskFlow</h2>
  <p>Hi ${escapeHtml(requesterName)},</p>
  <p>Your request <strong>${escapeHtml(requestTitle)}</strong> from <strong>${escapeHtml(orgName)}</strong> has been declined by the TaskFlow team.</p>
  ${reason ? `<p><strong>Reason:</strong> ${escapeHtml(reason)}</p>` : ''}
  <p><a href="${escapeHtml(appUrl)}/portal/requests" style="color: #4f46e5;">View your requests</a></p>
  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
  <p style="font-size: 12px; color: #64748b;">This is an automated message. Do not reply.</p>
</body>
</html>
  `.trim();
}

export function renderTicketClosedEmail(
  requesterName: string,
  requestTitle: string,
  issueKey: string,
  orgName: string,
  appUrl: string
): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Ticket Closed</title></head>
<body style="font-family: system-ui, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #4f46e5;">Ticket Closed: ${escapeHtml(issueKey)}</h2>
  <p>Hi ${escapeHtml(requesterName)},</p>
  <p>Your ticket <strong>${escapeHtml(issueKey)}</strong> for request <strong>${escapeHtml(requestTitle)}</strong> from <strong>${escapeHtml(orgName)}</strong> has been resolved and closed.</p>
  <p>Thank you for your patience!</p>
  <p><a href="${escapeHtml(appUrl)}/portal/requests" style="color: #4f46e5;">View your requests</a></p>
  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
  <p style="font-size: 12px; color: #64748b;">This is an automated message. Do not reply.</p>
</body>
</html>
  `.trim();
}

export async function sendCustomerEmail(to: string, subject: string, html: string): Promise<void> {
  const transport = getTransporter();
  if (!transport) return;
  await transport.sendMail({
    from: env.mailFrom,
    to,
    subject,
    html,
  });
}
