/**
 * NailDetail — the tiny hanging-nail + string at a board's top-centre that sells
 * the illusion each sign is physically hung on the wall. Pure decoration.
 */
export default function NailDetail({ color = '#c8a96e' }: { color?: string }) {
  return (
    <span
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: -16,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pointerEvents: 'none',
      }}
    >
      {/* nail head */}
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
      {/* string */}
      <span style={{ width: 1, height: 12, background: color, opacity: 0.7 }} />
    </span>
  );
}
