'use client';

import { motion } from 'framer-motion';
import { TOKENS } from './signs';

/**
 * TigerBG — a dramatic Japanese woodblock (ukiyo-e) tiger rendered purely in SVG.
 * Bold black outlines, flat orange fills, gold eyes, cream fangs. Sits in the
 * bottom-right as a ghost background layer that fades up after the wall settles.
 */
export default function TigerBG() {
  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.1 }} // ghost layer
      transition={{ duration: 2, ease: 'easeOut' }}
      style={{ position: 'absolute', right: '-12%', bottom: '-8%', height: '42vh', width: 'auto', zIndex: 0, pointerEvents: 'none' }}
    >
      <svg viewBox="0 0 600 700" height="100%" width="auto" fill="none" style={{ display: 'block' }}>
        <g stroke={TOKENS.void} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
          {/* shoulders / body hint */}
          <path d="M150 690 C140 560 190 500 300 500 C410 500 460 560 450 690 Z" fill={TOKENS.orange} />
          {/* ears */}
          <path d="M205 165 C170 105 120 110 135 175 C160 195 190 190 210 168 Z" fill={TOKENS.orange} />
          <path d="M395 165 C430 105 480 110 465 175 C440 195 410 190 390 168 Z" fill={TOKENS.orange} />
          <path d="M183 150 C165 120 142 124 150 165 Z" fill={TOKENS.dark} stroke="none" />
          <path d="M417 150 C435 120 458 124 450 165 Z" fill={TOKENS.dark} stroke="none" />
          {/* head */}
          <path
            d="M300 120 C228 120 188 172 184 248 C118 270 108 338 162 366 C132 398 152 440 206 450
               C228 482 262 502 300 502 C338 502 372 482 394 450 C448 440 468 398 438 366
               C492 338 482 270 416 248 C412 172 372 120 300 120 Z"
            fill={TOKENS.orange}
          />
          {/* cream muzzle */}
          <path d="M300 360 C258 360 232 388 240 424 C258 470 300 478 300 478 C300 478 342 470 360 424 C368 388 342 360 300 360 Z" fill={TOKENS.cream} stroke="none" />

          {/* forehead 王 stripes */}
          <g fill={TOKENS.void} stroke="none">
            <path d="M293 138 L307 138 L304 250 L296 250 Z" />
            <path d="M252 156 C268 196 268 222 262 252 L250 250 C254 220 252 196 240 162 Z" />
            <path d="M348 156 C332 196 332 222 338 252 L350 250 C346 220 348 196 360 162 Z" />
            {/* cheek stripes — left */}
            <path d="M170 286 C206 300 230 330 244 372 L232 380 C214 340 192 312 160 300 Z" />
            <path d="M156 330 C196 342 222 372 236 414 L224 420 C206 384 182 356 148 346 Z" />
            <path d="M168 392 C200 404 224 428 238 458 L228 464 C210 438 188 418 160 408 Z" />
            {/* cheek stripes — right */}
            <path d="M430 286 C394 300 370 330 356 372 L368 380 C386 340 408 312 440 300 Z" />
            <path d="M444 330 C404 342 378 372 364 414 L376 420 C394 384 418 356 452 346 Z" />
            <path d="M432 392 C400 404 376 428 362 458 L372 464 C390 438 412 418 440 408 Z" />
          </g>

          {/* eyes */}
          <path d="M206 286 C236 266 276 274 292 296 C262 312 224 308 200 298 Z" fill={TOKENS.gold} />
          <path d="M394 286 C364 266 324 274 308 296 C338 312 376 308 400 298 Z" fill={TOKENS.gold} />
          <circle cx="250" cy="290" r="11" fill={TOKENS.void} stroke="none" />
          <circle cx="350" cy="290" r="11" fill={TOKENS.void} stroke="none" />

          {/* nose + snarl */}
          <path d="M300 352 L276 322 C292 310 308 310 324 322 Z" fill={TOKENS.void} stroke="none" />
          <path d="M300 352 L300 378 M300 378 C282 398 256 396 244 380 M300 378 C318 398 344 396 356 380" fill="none" />
          {/* fangs */}
          <path d="M272 384 L282 384 L277 410 Z" fill={TOKENS.cream} strokeWidth="2.5" />
          <path d="M318 384 L328 384 L323 410 Z" fill={TOKENS.cream} strokeWidth="2.5" />
          {/* whisker base dots */}
          <g fill={TOKENS.void} stroke="none">
            <circle cx="252" cy="372" r="3" />
            <circle cx="268" cy="384" r="3" />
            <circle cx="348" cy="372" r="3" />
            <circle cx="332" cy="384" r="3" />
          </g>
        </g>
      </svg>
    </motion.div>
  );
}
