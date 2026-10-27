# Financial Settlement Controls & ISO 20022 Alignment Matrix

This document maps internal `payout-gateway-service` engineering controls to global financial messaging and settlement compliance standards.

| Control Domain | Engineering Implementation | Standard / Regulatory Alignment |
| :--- | :--- | :--- |
| **Idempotent Execution** | Mandatory `Idempotency-Key` enforcement on all payout creation and retry paths | ISO 20022 `EndToEndIdentification` (`pain.001`) |
| **Balance Integrity** | Two-phase synchronous reservation (`available` $\rightarrow$ `pending`) prior to external dispatch | SOC 1 Type II / Financial Ledger Integrity |
| **Precision Arithmetic** | Strict integer minor-unit (`cents` / `bigint`) calculations; zero IEEE 754 floats | Monetary Precision & Rounding Compliance |
| **Webhook Attestation** | HMAC-SHA256 payload verification with timestamp replay window guards | PCI-DSS v4.0 / Zero-Trust Webhook Security |
| **PII & IBAN Redaction** | Automated masking of destination bank account numbers and routing identifiers | GDPR / Banking Data Privacy Controls |
