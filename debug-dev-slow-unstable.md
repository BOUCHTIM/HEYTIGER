# Debug Session: dev-slow-unstable
- **Status**: [OPEN]
- **Issue**: Dev experience is slow and unstable (intermittent aborts/404s/jank)
- **Debug Server**: (pending startup)
- **Log File**: .dbg/trae-debug-log-dev-slow-unstable.ndjson

## Reproduction Steps
1. Start dev server.
2. Open `/` and `/menu`.
3. Scroll hero, interact with the section index, open/close sections.
4. Observe slow loads, freezes, aborts, or route instability.

## Hypotheses & Verification
| ID | Hypothesis | Likelihood | Effort | Evidence |
|----|------------|------------|--------|----------|
| A | Dev bundler/caching instability (Turbopack/lockfile root/cache invalidation) causes random 404/aborts | Med | Med | Pending |
| B | Client-side runtime errors/unhandled rejections trigger hydration failures and abort requests | Med | Low | Pending |
| C | Main-thread saturation (long tasks) from animations/overdraw causes jank and “unstable” feel | High | Low | Pending |
| D | Oversized assets (video/images) or network churn causes stalls and aborted requests | Med | Low | Pending |
| E | Custom proxy/intercepts interfere with dev HMR/runtime requests | Low | Med | Pending |

## Log Evidence
- Pending

## Verification Conclusion
- Pending
