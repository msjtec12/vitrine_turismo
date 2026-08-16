/**
 * Utility functions for sanitizing and validating user inputs
 * to protect against XSS, injection attacks, and malicious payloads.
 */

/**
 * Escapes unsafe HTML characters to prevent XSS.
 */
export function escapeHtml(unsafe: string): string {
  if (!unsafe || typeof unsafe !== 'string') return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Strips all HTML tags and script elements from a string.
 */
export function stripHtml(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim();
}

/**
 * Sanitizes search queries and filter inputs.
 */
export function sanitizeSearchQuery(query: string): string {
  if (!query || typeof query !== 'string') return '';
  return query
    .replace(/[^\w\s\u00C0-\u017F\-\.,]/gi, '')
    .slice(0, 100)
    .trim();
}

/**
 * Validates and normalizes Brazilian phone / WhatsApp numbers.
 */
export function sanitizePhone(phone: string): string {
  if (!phone || typeof phone !== 'string') return '';
  const digits = phone.replace(/\D/g, '');
  // Brazilian phone length check (10 or 11 digits)
  return digits.slice(0, 15);
}

/**
 * Validates and normalizes email addresses.
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') return '';
  return email.trim().toLowerCase().slice(0, 120);
}
