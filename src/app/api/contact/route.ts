import { CONTACT_LIMITS } from '@/lib/config';
import { validateContact } from '@/lib/contact';
import {
  deliverEnquiry,
  isGoogleAppsScriptConfigured,
} from '@/lib/google-apps-script';
export const runtime = 'nodejs';
const respond = (message: string, status: number, extra = {}) =>
  Response.json({ message, ...extra }, { status });
export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin || origin !== new URL(request.url).origin)
    return respond('Request not allowed.', 403);
  if (!request.headers.get('content-type')?.startsWith('application/json'))
    return respond('Expected JSON.', 415);
  const reader = request.body?.getReader();
  if (!reader) return respond('Please complete the form.', 400);
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > CONTACT_LIMITS.requestBytes) {
      await reader.cancel();
      return respond('Your message is too large.', 413);
    }
    chunks.push(value);
  }
  let input: unknown;
  try {
    input = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    return respond('Invalid form data.', 400);
  }
  const { data, errors } = validateContact(input);
  if (!data)
    return respond('Please check the highlighted fields.', 400, { errors });
  if (data.website) return respond('Unable to accept this submission.', 400);
  if (!isGoogleAppsScriptConfigured())
    return respond('Online enquiries are not connected yet.', 503);
  try {
    const delivered = await deliverEnquiry(data);
    if (!delivered)
      return respond(
        'We could not confirm delivery. Please try again later or contact us directly.',
        502,
      );
    return respond(
      'Thanks! Your enquiry has been received. We’ll be in touch.',
      200,
    );
  } catch {
    return respond(
      'We could not confirm delivery. Please contact us directly before sending again.',
      502,
    );
  }
}
