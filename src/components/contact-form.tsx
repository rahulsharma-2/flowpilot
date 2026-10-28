'use client';
import { useRef, useState, type FormEvent } from 'react';
import { CONTACT_LIMITS, SERVICE_OPTIONS } from '@/lib/config';
import { validateContact, type ContactErrors } from '@/lib/contact';
export function ContactForm({
  enabled,
  email,
}: {
  enabled: boolean;
  email: string;
}) {
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [errors, setErrors] = useState<ContactErrors>({});
  const [message, setMessage] = useState('');
  const busy = useRef(false);
  const submissionId = useRef('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current || !enabled || status === 'success') return;
    const form = event.currentTarget;
    if (!submissionId.current) submissionId.current = crypto.randomUUID();
    const input = {
      ...Object.fromEntries(new FormData(form)),
      submissionId: submissionId.current,
    };
    const validation = validateContact(input);
    setErrors(validation.errors);
    if (!validation.data) {
      setStatus('error');
      setMessage('Please check the highlighted fields.');
      const field = Object.keys(validation.errors)[0];
      (form.elements.namedItem(field) as HTMLElement | null)?.focus();
      return;
    }
    busy.current = true;
    setStatus('loading');
    setMessage('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validation.data),
        signal: AbortSignal.timeout(15000),
      });
      const result = await response.json();
      if (!response.ok) {
        setErrors(result.errors ?? {});
        throw new Error(
          result.message ?? 'Something went wrong. Please try again later.',
        );
      }
      setStatus('success');
      setMessage(result.message);
      form.reset();
    } catch (error) {
      setStatus('error');
      setMessage(
        error instanceof Error && error.name !== 'TimeoutError'
          ? error.message
          : 'Delivery could not be confirmed. Please contact us directly before sending again.',
      );
    } finally {
      busy.current = false;
    }
  }
  const error = (key: keyof ContactErrors) =>
    errors[key] ? (
      <span className="field-error" id={`${key}-error`}>
        {errors[key]}
      </span>
    ) : null;
  return (
    <form
      onSubmit={submit}
      noValidate
      className="contact-form"
      aria-label="Project enquiry"
      aria-busy={status === 'loading'}
    >
      {!enabled && (
        <p className="form-notice">
          Online enquiries are being set up.
          {email ? (
            <>
              {' '}
              For now, email <a href={`mailto:${email}`}>{email}</a>.
            </>
          ) : (
            ' Please check back soon.'
          )}
        </p>
      )}
      <div className="form-row">
        <label>
          Your name
          <input
            name="name"
            autoComplete="name"
            placeholder="Alex Morgan"
            required
            maxLength={CONTACT_LIMITS.name}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {error('name')}
        </label>
        <label>
          Business email
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="alex@yourbusiness.com"
            required
            maxLength={CONTACT_LIMITS.email}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {error('email')}
        </label>
      </div>
      <label>
        What can we help with?
        <select
          name="service"
          required
          defaultValue=""
          aria-invalid={!!errors.service}
          aria-describedby={errors.service ? 'service-error' : undefined}
        >
          <option value="" disabled>
            Select a service
          </option>
          {SERVICE_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        {error('service')}
      </label>
      <label>
        A little about your project
        <textarea
          name="description"
          rows={4}
          required
          minLength={CONTACT_LIMITS.minDescription}
          maxLength={CONTACT_LIMITS.description}
          placeholder="What are you working on? What would you like to improve?"
          aria-invalid={!!errors.description}
          aria-describedby={
            errors.description ? 'description-error' : undefined
          }
        />
        {error('description')}
      </label>
      <div className="honeypot" aria-hidden="true">
        <label>
          Leave this empty
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <button
        className="button form-submit"
        type="submit"
        disabled={!enabled || status === 'loading' || status === 'success'}
      >
        {status === 'loading'
          ? 'Sending…'
          : status === 'success'
            ? 'Enquiry received ✓'
            : 'Send your enquiry ↗'}
      </button>
      <p className="form-fine">
        By sending, you agree to our <a href="/privacy">privacy notice</a>. No
        mailing lists. Just a conversation.
      </p>
      <p
        className={`form-status ${status === 'error' ? 'field-error' : ''}`}
        role="status"
        aria-live="polite"
      >
        {message}
      </p>
    </form>
  );
}
