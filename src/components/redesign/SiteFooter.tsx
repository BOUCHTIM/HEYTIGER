import { FOOTER } from '@/data/site';
import { restaurantInfo } from '@/data/restaurant';
import { Logo } from './primitives';

function Instagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" />
    </svg>
  );
}
function Facebook() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M14 8h2.5V4.5H14c-2.5 0-4 1.6-4 4V11H7.5v3.5H10V21h3.5v-6.5h2.6l.5-3.5h-3.1V8.9c0-.6.3-.9 1-.9z" fill="currentColor" />
    </svg>
  );
}

/* Matches the frame: red band, wordmark bottom-left, FOLLOW US + icons bottom-right. */
export default function SiteFooter() {
  return (
    <footer className="rd-footer" data-reveal="fade">
      <Logo tone="ivory" />
      <div className="rd-footer__follow rd-label">
        <span>{FOOTER.follow}</span>
        {restaurantInfo.socialLinks.instagram && (
          <a href={restaurantInfo.socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram /></a>
        )}
        <a href="https://facebook.com/heytigerdubai" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook /></a>
      </div>
    </footer>
  );
}
