# Security Policy

## Supported versions
Security fixes target the latest revision on the default branch unless a release is explicitly documented as supported.

## Scope
Agent Skill ingestion/inspection, provenance and trust metadata, provider adapters, orchestration permissions, budgets, workflows, future runtime execution, local storage and the build/dependency supply chain.

## Reporting
Do not open a public issue for an unpatched vulnerability. Use GitHub private vulnerability reporting / Security Advisories when available. Include affected commit/version, impact, reproducible steps or minimal proof of concept, environment assumptions and possible mitigations. Remove unrelated sensitive data.

## Security requirements
Never commit secrets, credentials, private keys or production/private data. Validate untrusted input, use least privilege, review dependency and build-script changes, and keep authorization/permission decisions explicit and auditable. A static scan result must never be treated as a universal safety guarantee. Future execution features must default to explicit permissions, bounded resources and auditable actions.

## Responsible testing
Test only systems, files, providers and accounts you own or are explicitly authorized to use. No destructive testing, denial of service, unauthorized access or collection of third-party data.

## Private reporting process

Use **Report a vulnerability** in the repository Security tab if private reporting is available. Otherwise use a verified private contact published by the repository owner. If no private contact is available, open a public issue asking only for a private contact, without vulnerability details. Do not publish exploit details, credentials, personal data or sensitive logs in public issues.

Include the affected revision, environment, impact and minimal synthetic reproduction. Coordinate disclosure with the maintainer. Acknowledgement and remediation depend on availability and severity; no fixed response deadline is guaranteed.

## Development-stage limits

No supported production releases have been announced. Scaffold and lint rules do not establish a working skill scanner, agent sandbox or verified permission model. The filesystem, process, network, secret, provider-permission and audit requirements in project.md Parts B and C require implementation and verification. Private reporting availability is not confirmed by this document. A confirmed contact, response policy and supported versions remain part of P0-T017; no response time is promised here.
