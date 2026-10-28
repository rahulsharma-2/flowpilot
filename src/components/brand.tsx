import Link from 'next/link';
import { BRAND } from '@/lib/config';
export function Brand() {
  return (
    <Link className="brand" href="/" aria-label={`${BRAND.fullName} home`}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M3 12c5-9 10-9 15-2s8 3 11-2M3 24c5-9 10-9 15-2s8 3 11-2"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <span>
        {BRAND.name}
        <span className="brand-sub">AUTOMATION</span>
      </span>
    </Link>
  );
}
