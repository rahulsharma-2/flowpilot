import Image from 'next/image';
import Link from 'next/link';
import { BRAND } from '@/lib/config';

export function Brand() {
  return (
    <Link className="brand" href="/" aria-label={`${BRAND.fullName} home`}>
      <Image
        className="brand-logo brand-logo-light"
        src="/flowpilot-logo-light.svg"
        width={803}
        height={170}
        alt=""
        unoptimized
      />
      <Image
        className="brand-logo brand-logo-dark"
        src="/flowpilot-logo-dark.svg"
        width={803}
        height={170}
        alt=""
        unoptimized
      />
    </Link>
  );
}
