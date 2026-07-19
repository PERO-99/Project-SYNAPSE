# Security & Privacy Posture (SYNAPSE)

The SYNAPSE platform is designed with security and privacy as foundational pillars, particularly given the scale and sensitivity of FIFA World Cup 2026 operations.

## Data Handling & Privacy
- **Zero Biometric Tracking:** The platform explicitly does not utilize facial recognition, persistent individual tracking, or biometric surveillance for crowd dynamics or navigation.
- **Ephemeral Fan Twins:** The "Fan Twin" accessibility profiles are opt-in and ephemeral. Data is stored on-device and locally cached at the edge only for the duration of the matchday journey, automatically purging post-match.
- **Federated Learning:** Agents learn crowd patterns and operational lessons locally at the edge (e.g., at specific stadium gates). The Conductor aggregates *lessons* and *patterns* across the 16 venues, but no raw personal data ever leaves the local stadium network.

## Front-end Security
- **Content Security Policy (CSP):** All pages enforce a strict CSP restricting scripts, styles, and fonts to trusted domains.
- **Input Sanitization:** Contact forms validate and sanitize inputs pre-flight before sending data to backend serverless functions.
- **No Inline Event Handlers:** The codebase adheres to strict separation of concerns, avoiding inline `onclick` or `onsubmit` handlers to mitigate XSS vulnerabilities.
- **External Links:** All external anchors are secured with `rel="noopener noreferrer"`.
