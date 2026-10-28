import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { validateContact } from '../src/lib/contact';
import { POST } from '../src/app/api/contact/route';
const valid = {
  name: 'Alex Morgan',
  email: 'alex@gmail.com',
  service: 'automation',
  description: 'We would like to connect our enquiry form to our CRM.',
  website: '',
  submissionId: '22e93ca0-1713-4a5e-8f34-57094bcd1526',
};
const originalFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = originalFetch;
  delete process.env.N8N_WEBHOOK_URL;
  delete process.env.N8N_WEBHOOK_TOKEN;
});
const request = (body: unknown = valid, headers: Record<string, string> = {}) =>
  new Request('https://flowpilot.test/api/contact', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: 'https://flowpilot.test',
      ...headers,
    },
    body: JSON.stringify(body),
  });
test('accepts valid enquiry and consumer email addresses', () =>
  assert.ok(validateContact(valid).data));
test('trims input and rejects invalid fields', () => {
  assert.equal(
    validateContact({ ...valid, name: ' Alex ' }).data?.name,
    'Alex',
  );
  const result = validateContact({
    ...valid,
    name: '',
    email: 'bad',
    service: 'invented',
    description: 'short',
    submissionId: 'bad',
  });
  assert.equal(Object.keys(result.errors).length, 5);
});
test('rejects oversized fields and non-object payloads', () => {
  assert.ok(
    validateContact({
      ...valid,
      name: 'a'.repeat(101),
      description: 'a'.repeat(4001),
    }).errors.name,
  );
  assert.ok(validateContact(null).errors.name);
  assert.ok(validateContact([]).errors.name);
});
test('missing endpoint fails honestly', async () =>
  assert.equal((await POST(request())).status, 503));
test('rejects cross-origin, invalid types, malformed JSON and invalid fields', async () => {
  assert.equal(
    (await POST(request(valid, { origin: 'https://other.test' }))).status,
    403,
  );
  assert.equal(
    (await POST(request(valid, { 'content-type': 'text/plain' }))).status,
    415,
  );
  assert.equal(
    (
      await POST(
        new Request('https://flowpilot.test/api/contact', {
          method: 'POST',
          headers: {
            origin: 'https://flowpilot.test',
            'content-type': 'application/json',
          },
          body: 'broken',
        }),
      )
    ).status,
    400,
  );
  assert.equal((await POST(request({ ...valid, email: 'bad' }))).status, 400);
});
test('rejects oversized request and honeypot', async () => {
  assert.equal(
    (await POST(request({ ...valid, description: 'a'.repeat(17000) }))).status,
    413,
  );
  assert.equal(
    (await POST(request({ ...valid, website: 'spam.test' }))).status,
    400,
  );
});
test('forwards validated data, id and token only to configured endpoint', async () => {
  process.env.N8N_WEBHOOK_URL = 'https://n8n.test/webhook/contact';
  process.env.N8N_WEBHOOK_TOKEN = 'test-secret';
  globalThis.fetch = async (url, options) => {
    assert.equal(String(url), 'https://n8n.test/webhook/contact');
    assert.equal(
      (options?.headers as Record<string, string>).Authorization,
      'Bearer test-secret',
    );
    const body = JSON.parse(String(options?.body));
    assert.equal(body.submissionId, valid.submissionId);
    assert.ok(body.submittedAt);
    assert.equal(body.website, undefined);
    return new Response(null, { status: 204 });
  };
  assert.equal((await POST(request())).status, 200);
});
test('upstream failure and timeout never produce success or expose secrets', async () => {
  process.env.N8N_WEBHOOK_URL = 'https://n8n.test/webhook/contact';
  globalThis.fetch = async () => new Response(null, { status: 500 });
  assert.equal((await POST(request())).status, 502);
  globalThis.fetch = async () => {
    throw new DOMException('secret upstream URL', 'TimeoutError');
  };
  const response = await POST(request());
  assert.equal(response.status, 502);
  assert.ok(!(await response.text()).includes('secret upstream'));
});
test('rejects insecure webhook configuration', async () => {
  process.env.N8N_WEBHOOK_URL = 'http://n8n.test';
  assert.equal((await POST(request())).status, 503);
});
