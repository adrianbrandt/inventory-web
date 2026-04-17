// inventory-web/src/components/VendorBadge.tsx
const PALETTE = ['#f0a500', '#5b8ff9', '#3ecf8e', '#f06060', '#a78bfa', '#2dd4bf', '#fb923c', '#f472b6'];

function hashColor(str: string): string {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

export default function VendorBadge({ vendor }: { vendor: string }) {
  const color = hashColor(vendor);
  return (
    <span style={{
      background: `${color}22`,
      border: `1px solid ${color}55`,
      color,
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: 11,
      padding: '1px 7px',
      borderRadius: 4,
      whiteSpace: 'nowrap',
    }}>
      {vendor}
    </span>
  );
}
