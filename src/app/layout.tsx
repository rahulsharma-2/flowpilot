import type { Metadata } from 'next';
import { BRAND } from '@/lib/config';
import './globals.css';
import { DEFAULT_THEME, THEME_INIT_SCRIPT } from '@/lib/theme';
const siteUrl = process.env.SITE_URL;
export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: {
    default: `${BRAND.fullName} — Less busywork. More room to grow.`,
    template: `%s | ${BRAND.fullName}`,
  },
  description: BRAND.description,
  openGraph: {
    title: BRAND.fullName,
    description: BRAND.description,
    type: 'website',
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image' },
  ...(siteUrl ? { alternates: { canonical: '/' } } : {}),
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme={DEFAULT_THEME} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
