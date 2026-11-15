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
const deliveryEnvironment = [
  'GOOGLE_APPS_SCRIPT_URL',
  'GOOGLE_APPS_SCRIPT_SECRET',
] as const;

const configureDelivery = () => {
  process.env.GOOGLE_APPS_SCRIPT_URL =
    'https://script.google.com/macros/s/test-deployment_123/exec';
  process.env.GOOGLE_APPS_SCRIPT_SECRET = 's'.repeat(32);
};

afterEach(() => {
  globalThis.fetch = originalFetch;
  for (const key of deliveryEnvironment) delete process.env[key];
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
test('sends validated data to the configured Google Apps Script', async () => {
  configureDelivery();
  globalThis.fetch = async (url, options) => {
    assert.equal(
      String(url),
      'https://script.google.com/macros/s/test-deployment_123/exec',
    );
    const body = JSON.parse(String(options?.body));
    assert.equal(body.secret, 's'.repeat(32));
    assert.equal(body.submissionId, valid.submissionId);
    assert.equal(body.name, valid.name);
    assert.equal(body.email, valid.email);
    assert.equal(body.service, 'AI Automation');
    assert.equal(body.description, valid.description);
    return Response.json({ ok: true });
  };
  assert.equal((await POST(request())).status, 200);
});
test('delivery failure and timeout never produce success or expose secrets', async () => {
  configureDelivery();
  globalThis.fetch = async () => new Response(null, { status: 500 });
  assert.equal((await POST(request())).status, 502);
  globalThis.fetch = async () => {
    throw new DOMException('secret Google response', 'TimeoutError');
  };
  const response = await POST(request());
  assert.equal(response.status, 502);
  assert.ok(!(await response.text()).includes('secret Google'));
});
test('rejects invalid Google Apps Script configuration', async () => {
  configureDelivery();
  process.env.GOOGLE_APPS_SCRIPT_URL = 'https://example.com/not-allowed';
  assert.equal((await POST(request())).status, 503);
  process.env.GOOGLE_APPS_SCRIPT_URL =
    'https://script.google.com/macros/s/test-deployment_123/exec';
  process.env.GOOGLE_APPS_SCRIPT_SECRET = 'too-short';
  assert.equal((await POST(request())).status, 503);
});
