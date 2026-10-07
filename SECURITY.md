# Security Policy

<p align="center"><a href="#english">🇬🇧 English</a> · <a href="#italiano">🇮🇹 Italiano</a></p>

## English
### Supported versions
Security fixes target the latest revision on the default branch unless a release is explicitly documented as supported.

### Scope
Agent Skill ingestion/inspection, provenance and trust metadata, provider adapters, orchestration permissions, budgets, workflows, future runtime execution, local storage and the build/dependency supply chain.

### Reporting
Do not open a public issue for an unpatched vulnerability. Use GitHub private vulnerability reporting / Security Advisories when available. Include affected commit/version, impact, reproducible steps or minimal proof of concept, environment assumptions and possible mitigations. Remove unrelated sensitive data.

### Security requirements
Never commit secrets, credentials, private keys or production/private data. Validate untrusted input, use least privilege, review dependency and build-script changes, and keep authorization/permission decisions explicit and auditable. A static scan result must never be treated as a universal safety guarantee. Future execution features must default to explicit permissions, bounded resources and auditable actions.

### Responsible testing
Test only systems, files, providers and accounts you own or are explicitly authorized to use. No destructive testing, denial of service, unauthorized access or collection of third-party data.

## Italiano
### Versioni supportate
Le correzioni riguardano la revisione più recente del branch predefinito salvo release esplicitamente supportate.

### Ambito
Agent Skill ingestion/inspection, provenance and trust metadata, provider adapters, orchestration permissions, budgets, workflows, future runtime execution, local storage and the build/dependency supply chain.

### Segnalazione
Non aprire issue pubbliche per vulnerabilità non corrette. Usa la segnalazione privata / Security Advisories quando disponibile. Indica commit/versione, impatto, passaggi riproducibili o PoC minimo, assunzioni ambientali e mitigazioni, rimuovendo dati sensibili non necessari.

### Requisiti di sicurezza
Non committare segreti, credenziali, chiavi private o dati privati/di produzione. Valida gli input non fidati, usa privilegi minimi, controlla dipendenze e script di build e mantieni esplicite e auditabili le decisioni di autorizzazione/permesso. A static scan result must never be treated as a universal safety guarantee. Future execution features must default to explicit permissions, bounded resources and auditable actions.

### Test responsabili
Esegui test solo su sistemi, file, provider e account propri o esplicitamente autorizzati. Sono esclusi test distruttivi, DoS, accessi non autorizzati e raccolta di dati di terzi.
