import { CONTACT_LIMITS, SERVICE_OPTIONS } from './config';

type EnquiryNotification = {
  name: string;
  email: string;
  service: string;
  description: string;
};

type WhatsAppConfiguration = {
  accessToken: string;
  apiVersion: string;
  phoneNumberId: string;
  recipient: string;
  templateLanguage: string;
  templateName: string;
};

const getConfiguration = (): WhatsAppConfiguration | null => {
  const configuration = {
    accessToken: process.env.WHATSAPP_CLOUD_ACCESS_TOKEN?.trim() ?? '',
    apiVersion: process.env.WHATSAPP_GRAPH_API_VERSION?.trim() ?? 'v27.0',
    phoneNumberId: process.env.WHATSAPP_CLOUD_PHONE_NUMBER_ID?.trim() ?? '',
    recipient: process.env.WHATSAPP_NOTIFICATION_RECIPIENT?.trim() ?? '',
    templateLanguage: process.env.WHATSAPP_TEMPLATE_LANGUAGE?.trim() ?? 'en_US',
    templateName: process.env.WHATSAPP_TEMPLATE_NAME?.trim() ?? '',
  };

  if (
    !configuration.accessToken ||
    !/^v\d+\.\d+$/.test(configuration.apiVersion) ||
    !/^\d{5,30}$/.test(configuration.phoneNumberId) ||
    !/^\d{7,15}$/.test(configuration.recipient) ||
    !/^[a-z0-9_]{1,512}$/.test(configuration.templateName) ||
    !/^[a-z]{2,3}(?:_[A-Z]{2})?$/.test(configuration.templateLanguage)
  ) {
    return null;
  }

  return configuration;
};

const compact = (value: string, maxLength: number) =>
  value.replace(/\s+/g, ' ').trim().slice(0, maxLength);

export const isWhatsAppConfigured = () => getConfiguration() !== null;

export async function sendEnquiryToWhatsApp(
  enquiry: EnquiryNotification,
): Promise<boolean> {
  const configuration = getConfiguration();
  if (!configuration) return false;

  const service =
    SERVICE_OPTIONS.find((option) => option.id === enquiry.service)?.label ??
    enquiry.service;

  const response = await fetch(
    `https://graph.facebook.com/${configuration.apiVersion}/${configuration.phoneNumberId}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${configuration.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: configuration.recipient,
        type: 'template',
        template: {
          name: configuration.templateName,
          language: { code: configuration.templateLanguage },
          components: [
            {
              type: 'body',
              parameters: [
                { type: 'text', text: compact(enquiry.name, 100) },
                { type: 'text', text: compact(enquiry.email, 254) },
                { type: 'text', text: compact(service, 100) },
                { type: 'text', text: compact(enquiry.description, 600) },
              ],
            },
          ],
        },
      }),
      signal: AbortSignal.timeout(CONTACT_LIMITS.timeoutMs),
      redirect: 'error',
    },
  );

  return response.ok;
}
