# Security scope and reporting

[English](SECURITY.md) · [Italiano](SECURITY.it.md) · [Documentation](docs/README.md)

## Current scope

QUIVER is in early development. No production release or supported production
version has been announced. The existing scaffold and lint rules do not provide
a working skill scanner, agent sandbox or verified runtime permission model.
See [development status](docs/presentation/development-status.md).

The security design covers untrusted skills, filesystem and process access,
network boundaries, secrets, provider permissions and audit records in
[project.md Part B](project.md#part-b--security) and
[Part C](project.md#part-c--secure-coding-standard). These are requirements to
implement and verify, not guarantees already delivered.

## Reporting a potential vulnerability

The intended channel is GitHub private vulnerability reporting, as specified in
project.md §25. This document does not confirm that the feature is enabled.

1. Open the repository's [Security tab](https://github.com/chiaraberti13/QUIVER/security).
   Use **Report a vulnerability** if private reporting is available.
2. Otherwise, contact the maintainer through a private channel you already know.
   If none is established, open a non-sensitive issue asking for a private
   reporting channel, without the vulnerability details.
3. In the private report, include the affected commit, component, impact,
   reproduction steps and sanitized evidence. Never include live credentials.

Response targets, a confirmed private contact and supported-version policy
remain part of roadmap task P0-T017. No response-time commitment is claimed here.
Dependency issues should identify the affected version and its use in QUIVER.

## Contribution boundaries

Security-relevant changes follow the Secure Coding Standard and protected-path
review process in [CONTRIBUTING.md](CONTRIBUTING.md). Findings in documentation,
translation or links can use public issues if they disclose no sensitive detail.
