import { ImageResponse } from 'next/og';
export const alt = 'FlowPilot Automation — Less busywork. More room to grow.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: '#17151d',
        color: '#f4f1fa',
        padding: 90,
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ fontSize: 26, color: '#b39aff', marginBottom: 65 }}>
        FlowPilot Automation
      </div>
      <div style={{ fontSize: 78, letterSpacing: -3 }}>Less busywork.</div>
      <div style={{ fontSize: 78, letterSpacing: -3, color: '#bfb0de' }}>
        More room to grow.
      </div>
      <div style={{ fontSize: 22, color: '#a39bac', marginTop: 40 }}>
        Websites · AI Automation · Business Integrations
      </div>
    </div>,
    size,
  );
}
