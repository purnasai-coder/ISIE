import json
import sys
import threading
import unittest
from datetime import datetime, timezone
from http.server import ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request, urlopen

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from isie_backend.analysis import (
    assess_capacity,
    assess_relocation,
    simulate_capacity,
)
from isie_backend.providers import read_verified_measurement
from isie_backend.server import create_handler
from isie_backend.validation import (
    InputError,
    validate_coordinates,
    validate_measurement,
    validate_provenance,
)

NOW = datetime(2026, 10, 6, 8, 0, tzinfo=timezone.utc)


def measurement(value, name, *, kind="verified_real", observed_at=None, confidence=0.8):
    provenance = {
        "kind": kind,
        "sourceId": f"source-{name}",
        "sourceName": f"Input supplied for {name}",
        "observedAt": observed_at or NOW.isoformat(),
        "recordedAt": NOW.isoformat(),
        "processingVersion": "source-revision-1",
        "confidence": confidence,
    }
    if kind == "verified_real":
        provenance["verification"] = {
            "verifiedBy": "authorized-reviewer",
            "verifiedAt": NOW.isoformat(),
        }
    return {"value": value, "unit": "people", "provenance": provenance}


class BackendTests(unittest.TestCase):
    def test_coordinates_and_provenance_validation(self):
        self.assertEqual(
            validate_coordinates({"latitude": 0, "longitude": 0}),
            {"latitude": 0.0, "longitude": 0.0},
        )
        with self.assertRaisesRegex(InputError, "latitude"):
            validate_coordinates({"latitude": 91, "longitude": 0})
        with self.assertRaisesRegex(InputError, "sourceId"):
            validate_provenance({"kind": "verified_real"})
        with self.assertRaisesRegex(InputError, "non-negative"):
            validate_measurement(measurement(-1, "population"), name="population", now=NOW)
        with self.assertRaisesRegex(InputError, "non-negative"):
            validate_measurement(
                measurement(float("inf"), "population"), name="population", now=NOW
            )

    def test_provider_boundary_validates_coordinates_provenance_and_source(self):
        class TestProvider:
            source_id = "source-population"

            def read_measurement(self, metric, coordinates):
                self.asserted_coordinates = coordinates
                return measurement(25, metric)

        provider = TestProvider()
        result = read_verified_measurement(
            provider,
            "population",
            {"latitude": 0, "longitude": 0},
            now=NOW,
        )
        self.assertEqual(result["value"], 25)
        self.assertEqual(provider.asserted_coordinates, {"latitude": 0.0, "longitude": 0.0})
        with self.assertRaisesRegex(InputError, "longitude"):
            read_verified_measurement(
                provider,
                "population",
                {"latitude": 0, "longitude": 181},
                now=NOW,
            )
        provider.source_id = "unexpected-source"
        with self.assertRaisesRegex(ValueError, "does not match"):
            read_verified_measurement(
                provider,
                "population",
                {"latitude": 0, "longitude": 0},
                now=NOW,
            )

    def test_bad_stale_future_and_unverified_timestamps_rejected(self):
        invalid = measurement(1, "population")["provenance"]
        invalid["observedAt"] = "yesterday"
        with self.assertRaisesRegex(InputError, "timestamp"):
            validate_provenance(invalid)
        with self.assertRaisesRegex(InputError, "must be one of"):
            validate_measurement(
                measurement(10, "population", kind="user_provided"),
                name="population",
                now=NOW,
            )
        with self.assertRaisesRegex(InputError, "stale"):
            validate_measurement(
                measurement(10, "population", observed_at="2026-10-04T00:00:00+00:00"),
                name="population",
                now=NOW,
                max_age_seconds=60,
            )
        with self.assertRaisesRegex(InputError, "future"):
            validate_measurement(
                measurement(10, "population", observed_at="2026-10-07T00:00:00+00:00"),
                name="population",
                now=NOW,
            )

    def test_capacity_missing_inputs_explicitly_unavailable(self):
        result = assess_capacity({"population": measurement(100, "population")}, now=NOW)
        self.assertEqual(result["status"], "unavailable")
        self.assertEqual(result["missingInputs"], ["shelterCapacity"])
        self.assertIsNone(result["metadata"]["confidence"])

    def test_capacity_derivation_preserves_provenance_and_limitations(self):
        result = assess_capacity(
            {
                "population": measurement(100, "population"),
                "shelterCapacity": measurement(65, "capacity"),
            },
            now=NOW,
        )
        self.assertEqual(result["status"], "prototype_estimate")
        self.assertEqual(result["capacityDeficit"]["value"], 35)
        self.assertEqual(
            [item["sourceId"] for item in result["provenance"]],
            ["source-population", "source-capacity"],
        )
        self.assertEqual(result["metadata"]["processingVersion"], "isie-prototype-analysis/1.0.0")
        self.assertTrue(result["metadata"]["limitations"])

    def test_relocation_score_is_explainable_and_non_prescriptive(self):
        inputs = {
            "population": measurement(100, "population"),
            "shelterCapacity": measurement(50, "capacity"),
            "hazardIndex": measurement(0.4, "hazard"),
        }
        result = assess_relocation(inputs, now=NOW)
        self.assertEqual(result["prioritizationScore"]["value"], 45)
        self.assertIn("No automated", result["decision"])
        inputs["hazardIndex"]["value"] = 1.2
        with self.assertRaisesRegex(InputError, "between 0 and 1"):
            assess_relocation(inputs, now=NOW)

    def test_simulation_is_explicit_and_requires_inputs(self):
        missing = simulate_capacity({}, now=NOW)
        self.assertEqual(missing["status"], "unavailable")
        self.assertEqual(missing["label"], "HYPOTHETICAL SIMULATION")
        result = simulate_capacity(
            {
                "population": measurement(100, "population", kind="user_provided"),
                "shelterCapacity": measurement(60, "capacity", kind="simulated"),
            },
            now=NOW,
        )
        self.assertEqual(result["status"], "simulated")
        self.assertIn("NOT LIVE", result["label"])
        self.assertEqual(result["capacityDeficit"]["value"], 40)
        self.assertIn("never written", result["metadata"]["limitations"][0])

    def test_http_fail_closed_auth_roles_invalid_input_and_unavailable_data(self):
        self._with_http_server(None, lambda base: self.assert_http_error(
            base + "/v1/assessments/capacity", 503
        ))

        class Verifier:
            def verify_bearer_token(self, token):
                return {"uid": token, "role": "ANALYST" if token == "analyst" else "VIEWER"}

        def checks(base):
            self.assert_http_error(base + "/v1/assessments/capacity", 401)
            self.assert_http_error(base + "/v1/assessments/capacity", 403, token="viewer")
            status, body = self.http_post(
                base + "/v1/assessments/capacity", "analyst", b"{"
            )
            self.assertEqual(status, 400)
            status, body = self.http_post(
                base + "/v1/assessments/capacity", "analyst", b"{}"
            )
            self.assertEqual(status, 200)
            self.assertEqual(body["status"], "unavailable")
            self.assertEqual(body["missingInputs"], ["population", "shelterCapacity"])
            self.assert_http_error(base + "/v1/incidents", 404, token="analyst")
            status, _ = self.http_post(
                base + "/v1/assessments/capacity", "analyst", b"x" * (64 * 1024 + 1)
            )
            self.assertEqual(status, 413)

        self._with_http_server(Verifier(), checks)

    def _with_http_server(self, verifier, callback):
        server = ThreadingHTTPServer(
            ("127.0.0.1", 0),
            create_handler(auth_verifier=verifier, clock=lambda: NOW),
        )
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        try:
            callback(f"http://127.0.0.1:{server.server_port}")
        finally:
            server.shutdown()
            server.server_close()
            thread.join(timeout=2)

    def http_post(self, url, token, body=b"{}"):
        headers = {"Content-Type": "application/json"}
        if token:
            headers["Authorization"] = f"Bearer {token}"
        try:
            with urlopen(Request(url, data=body, headers=headers, method="POST")) as response:
                return response.status, json.loads(response.read())
        except HTTPError as error:
            return error.code, json.loads(error.read())

    def assert_http_error(self, url, expected, token=None):
        status, _ = self.http_post(url, token)
        self.assertEqual(status, expected)


if __name__ == "__main__":
    unittest.main()
