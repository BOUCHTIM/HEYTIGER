'use client';

interface NavToggleProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function NavToggle({ isOpen, onClick }: NavToggleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="nav-overlay-toggle"
      aria-expanded={isOpen}
      aria-controls="nav-overlay-panel"
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
    >
      <span className={`nav-overlay-icon${isOpen ? ' is-open' : ''}`} aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      {isOpen ? 'CLOSE' : 'MENU'}
    </button>
  );
}
