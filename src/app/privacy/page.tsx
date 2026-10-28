import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Brand } from '@/components/brand';
import { getPublicContact } from '@/lib/config';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Privacy',
  alternates: { canonical: '/privacy' },
};
export default function Privacy() {
  const { email } = getPublicContact();
  return (
    <>
      <header className="container privacy-nav">
        <Brand />
        <ThemeToggle />
      </header>
      <main id="main" className="container privacy-page">
        <p className="eyebrow">THE DETAILS MATTER</p>
        <h1>Privacy, plainly.</h1>
        <p>
          This notice describes how FlowPilot Automation handles information
          submitted through this website.
        </p>
        <h2>What you share</h2>
        <p>
          The enquiry form collects your name, email address, service interest,
          and project description. Please do not include passwords, payment
          information, or sensitive personal data.
        </p>
        <h2>How it is used</h2>
        <p>
          When online enquiries are enabled, submissions are sent securely to
          our configured n8n workflow so we can review and respond to your
          request. A submission identifier and timestamp help process the
          enquiry and avoid duplicate actions. We do not automatically add you
          to a marketing list.
        </p>
        <h2>Website operations</h2>
        <p>
          This website does not use advertising trackers, analytics scripts, or
          non-essential cookies. Your light/dark theme preference is stored
          locally in your browser and is not sent to us. The hosting provider
          may process technical request information, such as IP addresses, as
          part of operating and securing the website. External links, including
          WhatsApp and LinkedIn when available, are subject to those providers’
          privacy policies.
        </p>
        <h2>Storage and your choices</h2>
        <p>
          Only share information necessary to discuss your project. You can
          request access, correction, or deletion of information you have
          submitted by contacting us
          {email ? (
            <>
              {' '}
              at <a href={`mailto:${email}`}>{email}</a>
            </>
          ) : (
            ' once our business contact channel is available'
          )}
          .
        </p>
        <h2>Launch information</h2>
        <p>
          Online enquiry processing remains disabled until configured. Before
          enabling it, this notice must be updated with the legal business
          identity, a working privacy contact, actual processors and storage
          locations, and retention periods that match the deployed workflow.
        </p>
        <p>
          <Link href="/">← Back to FlowPilot</Link>
        </p>
      </main>
    </>
  );
}
