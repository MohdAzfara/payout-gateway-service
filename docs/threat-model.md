# STRIDE Threat Model: Payout Gateway Service

This document outlines the comprehensive threat analysis and cryptographic mitigation strategies implemented within `payout-gateway-service` based on the Microsoft STRIDE framework.

## 1. Spoofing Identity
* **Threat**: Malicious actors forging payout dispatch requests or spoofing settlement webhooks from banking partners.
* **Mitigation**:
  * Strict HMAC-SHA256 cryptographic signature verification on all inbound webhook callbacks.
  * Mutual authentication and recipient account verification prior to fund disbursement.

## 2. Tampering with Data
* **Threat**: Unauthorized modification of payout destination bank accounts (IBAN/Routing) or disbursement amounts in transit or memory.
* **Mitigation**:
  * Immutable payout instruction records locked upon creation.
  * Minor-unit integer arithmetic validation preventing floating-point manipulation or negative-amount injection.

## 3. Repudiation
* **Threat**: Connected vendors denying receipt of settled funds or disputing balance deductions.
* **Mitigation**:
  * Mandatory `Idempotency-Key` enforcement on every state-mutating request.
  * Immutable audit trails recording every state transition (`PENDING` -> `PROCESSING` -> `SETTLED` / `FAILED`) correlated with external PSP settlement reference IDs.

## 4. Information Disclosure
* **Threat**: Accidental leakage of sensitive bank account numbers, routing codes, or vendor PII in application logs or error stack traces.
* **Mitigation**:
  * Automated sensitive field scrubbing in telemetry pipelines, masking bank account numbers to last-4 digits only.

## 5. Denial of Service (DoS)
* **Threat**: High-velocity payout bursts exhausting worker queues or downstream banking partner rate limits.
* **Mitigation**:
  * Asynchronous queue decoupling with concurrency throttling and AWS-style Full Jitter exponential backoff.
  * Dead-Letter Queue (DLQ) isolation preventing poison-pill transactions from blocking healthy vendor disbursements.

## 6. Elevation of Privilege
* **Threat**: Compromised client contexts attempting to bypass balance eligibility checks or trigger unauthorized manual payouts.
* **Mitigation**:
  * Strict separation between balance reservation logic, eligibility verification, and external PSP execution privileges.
