# ISIE Python backend (prototype)

This backend uses only the Python 3.10+ standard library. It does not call external providers, connect to Firebase, persist data, or issue operational alerts. Without an authentication adapter, analysis endpoints return `503`; `/health` reports the service as limited. No operational sample data is seeded.

## Run

From the repository root:

```sh
python -m unittest discover -s backend/tests -v
python -m compileall -q backend/isie_backend backend/tests
python -m backend.isie_backend.server
```

The server listens on `127.0.0.1:3100` by default. Set `HOST` and `PORT` through the environment to change that. Do not expose it publicly without deployment-specific transport, rate limiting, monitoring, and security review.

## API and provenance

`POST /v1/assessments/capacity`, `POST /v1/assessments/relocation`, and `POST /v1/simulations/capacity` accept caller-supplied JSON. Each measurement includes a finite non-negative value, unit, and provenance (`kind`, source ID/name, observation and record timestamps, processing version, and confidence). `verified_real` additionally requires a verifier and verification timestamp. Live prototype assessments reject stale, future-dated, or non-verified inputs; absent measurements produce `status: unavailable` and list missing inputs. The default freshness window is 24 hours.

Capacity and relocation responses are `prototype_estimate`, not validated hazard science. Their arithmetic and limitations are included with every result. Relocation scoring uses an explicitly illustrative equal weighting between capacity deficit ratio and caller-supplied hazard index (0–1); it is not a relocation order. No endpoint issues evacuation orders; human approval is required for operational decisions. Simulation accepts only explicitly simulated or user-provided values, labels results hypothetical, and is not connected to live stores.

## Adapter boundaries

Provider, identity, and persistence integrations are not configured. `MeasurementProvider` in `isie_backend.providers` defines the read boundary; `read_verified_measurement` validates coordinates, provenance, freshness, and adapter source identity before normalizing a result. No concrete provider is bundled or called. Add one only after source access, license, verification, freshness, and failure behavior are established. An auth module supplied through `ISIE_AUTH_ADAPTER_MODULE` must expose `verify_bearer_token(token)` returning `{ "uid": ..., "role": ... }`; only `ADMIN`, `OPERATOR`, and `ANALYST` may call analysis/simulation endpoints. Use a verifier that validates Firebase ID tokens and reads roles from trusted custom claims, never request JSON or user-editable profile data. The optional `ISIE_STORAGE_ADAPTER_MODULE` is only reported by health; no persistence interface or adapter is implemented.

## Production blockers

- No production identity verifier, storage adapter, external source adapters, key management, rate limiting, or deployment configuration is included.
- Firestore-backed frontend records are not connected to these endpoints and are not backend-validated analyses.
- Prototype formulas are not scientifically validated and must not be used for live disaster decisions.
- Existing static map geography is illustrative; it is not a live hazard, road, shelter, or resource feed.
