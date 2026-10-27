# Changelog

All notable changes to `payout-gateway-service` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-10-27

### Added
- Asynchronous vendor payout orchestration engine with deterministic state machine transitions (`PENDING`, `PROCESSING`, `SETTLED`, `FAILED`, `REVERSED`).
- Available and pending platform balance tracking with strict reservation locks.
- Automated settlement reconciliation module for matching internal payout records against external banking partner statements.
- Exponential backoff retry strategies and Dead-Letter Queue (DLQ) isolation for transient banking gateway timeouts.
- Formal TLA+ verification specification (`docs/formal-verification/`) proving balance conservation and zero double-payout invariants.
- Comprehensive STRIDE threat model (`docs/threat-model.md`) and RFC 9116 vulnerability disclosure policy (`.well-known/security.txt`).
