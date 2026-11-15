import { CONTACT_LIMITS, SERVICE_OPTIONS } from './config';
import type { ContactInput } from './contact';

type GoogleAppsScriptConfiguration = {
  secret: string;
  url: string;
};

type GoogleAppsScriptResponse = {
  ok?: boolean;
};

const APPS_SCRIPT_URL =
  /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/;

const getConfiguration = (): GoogleAppsScriptConfiguration | null => {
  const configuration = {
    secret: process.env.GOOGLE_APPS_SCRIPT_SECRET ?? '',
    url: process.env.GOOGLE_APPS_SCRIPT_URL?.trim() ?? '',
  };

  if (
    !APPS_SCRIPT_URL.test(configuration.url) ||
    configuration.secret.length < 32 ||
    configuration.secret.length > 256
  ) {
    return null;
  }

  return configuration;
};

export const isGoogleAppsScriptConfigured = () => getConfiguration() !== null;

export async function deliverEnquiry(enquiry: ContactInput): Promise<boolean> {
  const configuration = getConfiguration();
  if (!configuration) return false;

  const service =
    SERVICE_OPTIONS.find((option) => option.id === enquiry.service)?.label ??
    enquiry.service;

  const response = await fetch(configuration.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: configuration.secret,
      submissionId: enquiry.submissionId,
      name: enquiry.name,
      email: enquiry.email,
      service,
      description: enquiry.description,
    }),
    cache: 'no-store',
    redirect: 'follow',
    signal: AbortSignal.timeout(CONTACT_LIMITS.timeoutMs),
  });

  if (!response.ok) return false;

  try {
    const result = (await response.json()) as GoogleAppsScriptResponse;
    return result.ok === true;
  } catch {
    return false;
  }
}
