# Security Policy

## Supported versions

Only the live site at <https://maniarnamra.com> and the `main` branch of this
repository are supported. Fixes are deployed from `main`.

## Reporting a vulnerability

Please **do not open a public issue** for security problems.

Report privately using either:

- GitHub's [private vulnerability reporting](https://github.com/namra4122/my-portfolio/security/advisories/new)
  (Security tab, then "Report a vulnerability"), or
- email to **hey@maniarnamra.com** with the subject `SECURITY:`.

Please include what you found, how to reproduce it, and the impact you expect.
You can expect an acknowledgement within 5 days. Once a fix is deployed, I'm
happy to credit you if you'd like.

## Scope

In scope: this site's code, configuration and response headers (for example
the CSP, XSS, open redirects, or exposure of anything that should not be
public).

Out of scope: third-party services the site uses (Vercel, Google Analytics,
GitHub), denial-of-service and volumetric testing, social engineering, and
reports from automated scanners with no demonstrated impact.

## Practices in this repo

- Dependencies are locked with `bun.lock` and updated weekly by Dependabot.
  CI runs `bun audit` on every PR.
- CodeQL scans every PR and runs weekly.
- Security headers and the Content-Security-Policy are defined in
  `next.config.mjs`.
- Secrets must never be committed. `.env*` files are gitignored (except
  `.env.example`).
