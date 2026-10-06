# ISIE_Hack4
Hack_4_Social_Cause

## Local demonstration prototype

The demo sign-in opens a **non-operational simulation**. All included cases, map overlays, measurements, alerts, resource quantities, timelines, and evidence are synthetic exercise fixtures. They are not live, verified, or suitable for real-world response. New demo records and status changes are stored only in browser-local storage; they never write to operational Firestore or trigger external dispatch. The workspace banner can reset only records under the `isie-prototype-demo-*` storage namespace.

The Python backend remains a separate, fail-closed prototype; `/health` reports `productionReady: false`. See [backend/README.md](backend/README.md) for limitations and outstanding production blockers. Do not use this prototype for customer operations or emergency-response decisions.
