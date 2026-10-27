# Security Policy & Financial Compliance Boundary

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0.0 | :x:                |

## Financial Data Protection & Settlement Boundaries

`payout-gateway-service` is architected under strict financial compliance and zero-trust backend security standards:

1. **Cryptographic Webhook & Dispatch Attestation**: All inbound payout triggers require strict HMAC-SHA256 payload verification coupled with replay-protection timestamps.
2. **Idempotent Fund Disbursement**: Every state-mutating payout request enforces a mandatory `Idempotency-Key` locked at the database constraint layer to guarantee zero double-payout anomalies.
3. **PII & IBAN Redaction**: Sensitive recipient banking details (account numbers, routing codes, tax identifiers) are automatically masked before telemetry emission.
4. **Serializable Balance Locking**: Platform balance deductions enforce strict ACID transaction boundaries prior to external banking PSP dispatch.

## Reporting a Vulnerability

Please **DO NOT** report security vulnerabilities through public GitHub issues.

If you discover a potential vulnerability in the payout orchestration or reconciliation flow, please report it privately via email:

* **Email**: lumilieju@hotmail.com
* **RFC 9116 Policy**: See [`.well-known/security.txt`](.well-known/security.txt)

We acknowledge receipt of all vulnerability reports within **24 hours** and provide a remediation timeline within **72 hours**.
