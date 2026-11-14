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
const whatsappEnvironment = [
  'WHATSAPP_CLOUD_ACCESS_TOKEN',
  'WHATSAPP_CLOUD_PHONE_NUMBER_ID',
  'WHATSAPP_NOTIFICATION_RECIPIENT',
  'WHATSAPP_TEMPLATE_NAME',
  'WHATSAPP_TEMPLATE_LANGUAGE',
  'WHATSAPP_GRAPH_API_VERSION',
] as const;

const configureWhatsApp = () => {
  process.env.WHATSAPP_CLOUD_ACCESS_TOKEN = 'test-secret';
  process.env.WHATSAPP_CLOUD_PHONE_NUMBER_ID = '123456789';
  process.env.WHATSAPP_NOTIFICATION_RECIPIENT = '919602730789';
  process.env.WHATSAPP_TEMPLATE_NAME = 'new_flowpilot_enquiry';
  process.env.WHATSAPP_TEMPLATE_LANGUAGE = 'en_US';
  process.env.WHATSAPP_GRAPH_API_VERSION = 'v27.0';
};

afterEach(() => {
  globalThis.fetch = originalFetch;
  for (const key of whatsappEnvironment) delete process.env[key];
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
test('sends validated data to the configured WhatsApp template', async () => {
  configureWhatsApp();
  globalThis.fetch = async (url, options) => {
    assert.equal(
      String(url),
      'https://graph.facebook.com/v27.0/123456789/messages',
    );
    assert.equal(
      (options?.headers as Record<string, string>).Authorization,
      'Bearer test-secret',
    );
    const body = JSON.parse(String(options?.body));
    assert.equal(body.messaging_product, 'whatsapp');
    assert.equal(body.to, '919602730789');
    assert.equal(body.template.name, 'new_flowpilot_enquiry');
    assert.deepEqual(
      body.template.components[0].parameters.map(
        (parameter: { text: string }) => parameter.text,
      ),
      [valid.name, valid.email, 'AI Automation', valid.description],
    );
    assert.ok(!String(options?.body).includes(valid.submissionId));
    return Response.json({ messages: [{ id: 'wamid.test' }] });
  };
  assert.equal((await POST(request())).status, 200);
});
test('Meta failure and timeout never produce success or expose secrets', async () => {
  configureWhatsApp();
  globalThis.fetch = async () => new Response(null, { status: 500 });
  assert.equal((await POST(request())).status, 502);
  globalThis.fetch = async () => {
    throw new DOMException('secret Meta response', 'TimeoutError');
  };
  const response = await POST(request());
  assert.equal(response.status, 502);
  assert.ok(!(await response.text()).includes('secret Meta'));
});
test('rejects invalid WhatsApp configuration', async () => {
  configureWhatsApp();
  process.env.WHATSAPP_CLOUD_PHONE_NUMBER_ID = 'not-a-phone-id';
  assert.equal((await POST(request())).status, 503);
});
