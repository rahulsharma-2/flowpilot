import { CONTACT_LIMITS } from '@/lib/config';
import { validateContact } from '@/lib/contact';
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
  const endpoint = process.env.N8N_WEBHOOK_URL;
  if (!endpoint) return respond('Online enquiries are not connected yet.', 503);
  try {
    const url = new URL(endpoint);
    if (url.protocol !== 'https:')
      return respond('Online enquiries are temporarily unavailable.', 503);
    const result = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.N8N_WEBHOOK_TOKEN
          ? { Authorization: `Bearer ${process.env.N8N_WEBHOOK_TOKEN}` }
          : {}),
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        service: data.service,
        description: data.description,
        submissionId: data.submissionId,
        submittedAt: new Date().toISOString(),
        source: 'flowpilot-website',
      }),
      signal: AbortSignal.timeout(CONTACT_LIMITS.timeoutMs),
      redirect: 'error',
    });
    if (!result.ok)
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
