/**
 * StringTune by Fiddle Digital
 * Extends React's HTMLAttributes so we can write string="parallax" in JSX
 * without TypeScript errors.
 */
import 'react';

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface HTMLAttributes<T> {
    /** StringTune module selector: "parallax" | "progress" | "scrollbar" | "lazy" */
    string?: string;
    /** Override the viewport start point (0–1, default auto) */
    'string-from'?: string;
    /** Override the viewport end point (0–1, default auto) */
    'string-to'?: string;
    /** Clamp floor (default "0") */
    'string-min'?: string;
    /** Clamp ceiling (default "1") */
    'string-max'?: string;
  }
}
