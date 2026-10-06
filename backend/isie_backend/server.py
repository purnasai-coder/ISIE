"""Small standard-library HTTP server with explicit auth adapter boundary."""

from __future__ import annotations

import importlib
import json
import logging
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any

from .analysis import OPERATIONS
from .validation import InputError

MAX_BODY_BYTES = 64 * 1024
ROLES_ALLOWED_TO_ANALYZE = {"ADMIN", "OPERATOR", "ANALYST"}
LOGGER = logging.getLogger("isie.backend")


def load_optional_adapter(variable_name: str) -> Any | None:
    module_name = os.environ.get(variable_name)
    if not module_name:
        return None
    module = importlib.import_module(module_name)
    return getattr(module, "adapter", module)


def create_handler(
    *,
    auth_verifier: Any = None,
    storage_adapter: Any = None,
    clock: Any = None,
) -> type[BaseHTTPRequestHandler]:
    def now():
        if clock:
            return clock()
        from datetime import datetime, timezone

        return datetime.now(timezone.utc)

    class Handler(BaseHTTPRequestHandler):
        server_version = "ISIEPrototype/1.0"

        def log_message(self, format: str, *args: Any) -> None:
            LOGGER.info("%s - %s", self.address_string(), format % args)

        def _send(self, status: int, data: dict[str, Any]) -> None:
            encoded = json.dumps(data, ensure_ascii=False).encode("utf-8")
            self.send_response(status)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(encoded)))
            self.send_header("Cache-Control", "no-store")
            self.send_header("X-Content-Type-Options", "nosniff")
            self.end_headers()
            self.wfile.write(encoded)

        def do_GET(self) -> None:
            if self.path == "/health":
                self._send(
                    200,
                    {
                        "status": "limited",
                        "service": "isie-backend",
                        "authenticationConfigured": bool(auth_verifier),
                        "storageAdapterLoaded": bool(storage_adapter),
                        "persistenceImplemented": False,
                        "auditImplemented": False,
                        "providersConfigured": False,
                        "note": "Analysis is stateless; no operational persistence, audit log, or external providers are implemented.",
                    },
                )
                return
            self._send(404, {"error": "not_found"})

        def do_POST(self) -> None:
            operation = OPERATIONS.get(self.path)
            if operation is None:
                self._send(404, {"error": "not_found"})
                return
            if auth_verifier is None or not callable(
                getattr(auth_verifier, "verify_bearer_token", None)
            ):
                self._send(503, {"error": "authentication_provider_not_configured"})
                return

            authorization = self.headers.get("Authorization", "")
            parts = authorization.split()
            if len(parts) != 2 or parts[0].lower() != "bearer":
                self._send(401, {"error": "authentication_required"})
                return
            try:
                principal = auth_verifier.verify_bearer_token(parts[1])
            except Exception:
                self._send(401, {"error": "invalid_authentication"})
                return
            if (
                not isinstance(principal, dict)
                or not principal.get("uid")
                or principal.get("role") not in ROLES_ALLOWED_TO_ANALYZE
            ):
                self._send(403, {"error": "insufficient_role"})
                return

            try:
                try:
                    content_length = int(self.headers.get("Content-Length", "0"))
                except ValueError as error:
                    raise InputError("Content-Length must be an integer") from error
                if content_length < 0 or content_length > MAX_BODY_BYTES:
                    raise InputError("request body exceeds 64 KiB", 413)
                raw_body = self.rfile.read(content_length)
                body = json.loads(raw_body.decode("utf-8"))
                if not isinstance(body, dict):
                    raise InputError("request body must be a valid JSON object")
                self._send(200, operation(body, now=now()))
            except (UnicodeDecodeError, json.JSONDecodeError):
                self._send(400, {"error": "invalid_input", "message": "request body must be valid JSON"})
            except InputError as error:
                self._send(
                    error.status,
                    {"error": "invalid_input", "message": str(error)},
                )
            except Exception:
                LOGGER.exception("ISIE backend request failed")
                self._send(500, {"error": "internal_error"})

    return Handler


def main() -> None:
    from functools import partial

    port_text = os.environ.get("PORT", "3100")
    try:
        port = int(port_text)
    except ValueError as error:
        raise SystemExit("PORT must be an integer between 1 and 65535") from error
    if not 1 <= port <= 65535:
        raise SystemExit("PORT must be an integer between 1 and 65535")

    auth_verifier = load_optional_adapter("ISIE_AUTH_ADAPTER_MODULE")
    storage_adapter = load_optional_adapter("ISIE_STORAGE_ADAPTER_MODULE")
    handler = partial(
        create_handler,
        auth_verifier=auth_verifier,
        storage_adapter=storage_adapter,
    )
    host = os.environ.get("HOST", "127.0.0.1")
    server = ThreadingHTTPServer((host, port), handler())
    LOGGER.info("ISIE backend listening on %s:%d", host, port)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    logging.basicConfig(level=os.environ.get("LOG_LEVEL", "INFO"))
    main()
