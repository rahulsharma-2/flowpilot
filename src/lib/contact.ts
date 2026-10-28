import { CONTACT_LIMITS, SERVICE_OPTIONS } from './config';
export type ContactInput = {
  name: string;
  email: string;
  service: string;
  description: string;
  website: string;
  submissionId: string;
};
export type ContactErrors = Partial<Record<keyof ContactInput, string>>;
export function validateContact(value: unknown): {
  data?: ContactInput;
  errors: ContactErrors;
} {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    return { errors: { name: 'Please complete the form.' } };
  const record = value as Record<string, unknown>;
  const get = (key: string) =>
    typeof record[key] === 'string' ? record[key].trim() : '';
  const data: ContactInput = {
    name: get('name'),
    email: get('email'),
    service: get('service'),
    description: get('description'),
    website: get('website'),
    submissionId: get('submissionId'),
  };
  const errors: ContactErrors = {};
  if (!data.name || data.name.length > CONTACT_LIMITS.name)
    errors.name = 'Enter your name (up to 100 characters).';
  if (
    data.email.length > CONTACT_LIMITS.email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
  )
    errors.email = 'Enter a valid email address.';
  if (!SERVICE_OPTIONS.some((option) => option.id === data.service))
    errors.service = 'Choose a service.';
  if (
    data.description.length < CONTACT_LIMITS.minDescription ||
    data.description.length > CONTACT_LIMITS.description
  )
    errors.description = 'Tell us a little more (20–4,000 characters).';
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      data.submissionId,
    )
  )
    errors.submissionId = 'Please refresh and try again.';
  return { data: Object.keys(errors).length ? undefined : data, errors };
}
