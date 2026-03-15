# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| Latest  | Yes       |

## Reporting a Vulnerability

If you discover a security vulnerability in recraft-mcp, please report it responsibly:

1. **Do not** open a public GitHub issue for security vulnerabilities.
2. Email **security@bartwaardenburg.nl** with:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
3. You will receive a response within 48 hours.

## Security Considerations

- **API tokens** are passed via environment variables and never logged or persisted to disk.
- **Image data** is transmitted to Recraft's API over HTTPS and is not cached locally.
- **No filesystem access** — this server does not read from or write to the local filesystem.
- **Network scope** — outbound requests are limited to `external.api.recraft.ai` and `registry.npmjs.org`.
