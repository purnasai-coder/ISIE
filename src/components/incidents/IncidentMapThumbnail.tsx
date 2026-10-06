"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ExternalLink,
  Layers,
  Crosshair,
  Compass,
  X,
  Copy,
  Check,
  Shield,
  Activity,
  Users,
} from "lucide-react";
import { IntelligenceEvent } from "@/lib/types/isie";
import { TacticalBadge } from "@/components/ui/TacticalBadge";

interface IncidentMapThumbnailProps {
  incident: IntelligenceEvent;
  onClose?: () => void;
}

function toDms(deg: number, isLat: boolean): string {
  const absolute = Math.abs(deg);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = Math.floor((minutesNotTruncated - minutes) * 60);
  const direction = isLat ? (deg >= 0 ? "N" : "S") : deg >= 0 ? "E" : "W";
  return `${degrees}° ${minutes}' ${seconds}" ${direction}`;
}

export const IncidentMapThumbnail: React.FC<IncidentMapThumbnailProps> = ({
  incident,
  onClose,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const circleRef = useRef<any>(null);

  const [zoomLevel, setZoomLevel] = useState<number>(10);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [tileError, setTileError] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copiedCoords, setCopiedCoords] = useState<boolean>(false);

  const lat = incident.coordinates?.lat ?? 20.5937;
  const lng = incident.coordinates?.lng ?? 78.9629;
  const elevation = incident.coordinates?.elevationMeters;

  const severityColor =
    incident.severity === "CRITICAL"
      ? "#ef4444"
      : incident.severity === "HIGH"
      ? "#f97316"
      : incident.severity === "MODERATE"
      ? "#eab308"
      : "#38bdf8";

  // Handle ESC key and scroll lock in fullscreen mode
  useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isFullscreen]);

  // Invalidate Leaflet map size on fullscreen toggle
  useEffect(() => {
    if (mapInstanceRef.current) {
      const timer = setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
        if (isFullscreen) {
          mapInstanceRef.current.setView([lat, lng], Math.max(zoomLevel, 11), {
            animate: true,
          });
        }
      }, 180);
      return () => clearTimeout(timer);
    }
  }, [isFullscreen, lat, lng, zoomLevel]);

  // Initialize Leaflet Map
  useEffect(() => {
    let isCancelled = false;

    async function initMap() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;

      try {
        const L = (await import("leaflet")).default;
        if (isCancelled || !mapContainerRef.current) return;

        // Clean up previous instance if any
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        const map = L.map(mapContainerRef.current, {
          center: [lat, lng],
          zoom: 10,
          minZoom: 4,
          maxZoom: 18,
          zoomControl: false,
          attributionControl: false,
          scrollWheelZoom: true,
          dragging: true,
          doubleClickZoom: true,
        });

        mapInstanceRef.current = map;

        // Tactical Dark Styled OpenStreetMap Tile Layer
        const tileLayer = L.tileLayer(
          "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            maxZoom: 19,
            subdomains: ["a", "b", "c"],
          }
        ).addTo(map);

        tileLayer.on("tileerror", () => {
          setTileError(true);
        });

        // Custom Tactical Pulsing Marker Icon
        const pulsingMarkerHtml = `
          <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background: ${severityColor}; opacity: 0.35; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: absolute; width: 14px; height: 14px; border-radius: 50%; background: ${severityColor}; border: 2px solid #ffffff; box-shadow: 0 0 12px ${severityColor};"></div>
            <div style="position: absolute; width: 38px; height: 38px; border: 1px dashed ${severityColor}; border-radius: 50%; opacity: 0.7;"></div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: pulsingMarkerHtml,
          className: "tactical-marker-clean",
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        });

        // Add Marker
        const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
        markerRef.current = marker;

        // Add Hazard Perimeter Circle
        const radiusMeters = incident.affectedAreaKm2
          ? Math.sqrt(incident.affectedAreaKm2) * 500
          : 3500;
        const circle = L.circle([lat, lng], {
          radius: radiusMeters,
          color: severityColor,
          weight: 1.5,
          opacity: 0.85,
          fillColor: severityColor,
          fillOpacity: 0.12,
          dashArray: "4, 4",
        }).addTo(map);
        circleRef.current = circle;

        // Popup
        marker.bindPopup(`
          <div style="font-family: ui-monospace, monospace; font-size: 11px; color: #f1f5f9; padding: 2px;">
            <div style="font-weight: bold; color: #ffffff; text-transform: uppercase;">${incident.eventCode || incident.id}</div>
            <div style="color: ${severityColor}; font-weight: 600;">${incident.title}</div>
            <div style="color: #94a3b8; font-size: 10px; margin-top: 2px;">${lat.toFixed(6)}°N, ${lng.toFixed(6)}°E</div>
          </div>
        `);

        map.on("zoomend", () => {
          setZoomLevel(map.getZoom());
        });

        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 150);

        setMapLoaded(true);
      } catch (err) {
        console.error("Failed to load map thumbnail:", err);
      }
    }

    initMap();

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [
    lat,
    lng,
    incident.id,
    incident.eventCode,
    incident.title,
    incident.affectedAreaKm2,
    severityColor,
  ]);

  // Recenter map on coordinates if incident changes while map is open
  useEffect(() => {
    if (mapInstanceRef.current && mapLoaded) {
      mapInstanceRef.current.setView([lat, lng], zoomLevel, { animate: true });
      if (markerRef.current) markerRef.current.setLatLng([lat, lng]);
      if (circleRef.current) circleRef.current.setLatLng([lat, lng]);
    }
  }, [lat, lng, mapLoaded, zoomLevel]);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], isFullscreen ? 12 : 10, {
        duration: 0.8,
      });
    }
  };

  const handleCopyCoordinates = () => {
    const textToCopy = `${lat.toFixed(6)}, ${lng.toFixed(6)} (${toDms(lat, true)}, ${toDms(lng, false)})`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2500);
  };

  return (
    <>
      {/* Fullscreen Backdrop when overlay is active */}
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-40 transition-opacity animate-in fade-in duration-200"
          onClick={() => setIsFullscreen(false)}
        />
      )}

      {/* Main Map Container (Inline thumbnail or Full-screen modal overlay) */}
      <div
        className={`transition-all duration-200 ${
          isFullscreen
            ? "fixed inset-3 sm:inset-6 md:inset-8 z-50 flex flex-col bg-slate-950 border-2 border-sky-500/80 rounded-sm shadow-[0_0_50px_rgba(0,0,0,0.95)] overflow-hidden"
            : "w-full rounded-sm border border-sky-500/40 bg-slate-950 overflow-hidden relative shadow-[0_4px_24px_rgba(0,0,0,0.6)] animate-in fade-in duration-200"
        }`}
      >
        {/* Corner Tactical Accents */}
        <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 border-sky-400 z-30 pointer-events-none" />
        <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t-2 border-r-2 border-sky-400 z-30 pointer-events-none" />
        <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b-2 border-l-2 border-sky-400 z-30 pointer-events-none" />
        <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b-2 border-r-2 border-sky-400 z-30 pointer-events-none" />

        {/* Top Header HUD Bar */}
        <div
          className={`px-3 bg-slate-900/95 border-b border-white/10 flex items-center justify-between z-20 relative font-mono backdrop-blur-md ${
            isFullscreen ? "h-11 text-xs" : "h-8 text-[11px]"
          }`}
        >
          <div className="flex items-center gap-2 truncate">
            <Crosshair className="w-3.5 h-3.5 text-sky-400 animate-pulse shrink-0" />
            <span className="font-bold text-white uppercase tracking-wider truncate">
              {isFullscreen
                ? "FULL-SCREEN COORDINATE INSPECTION OVERLAY"
                : "2D TACTICAL THUMBNAIL"}
            </span>
            <span className="text-white/20 hidden sm:inline">|</span>
            <span className="text-sky-300 font-semibold shrink-0">
              {lat.toFixed(isFullscreen ? 6 : 4)}°N,{" "}
              {lng.toFixed(isFullscreen ? 6 : 4)}°E
            </span>

            {/* DMS readouts in fullscreen mode */}
            {isFullscreen && (
              <span className="text-isie-text-dim hidden lg:inline">
                [{toDms(lat, true)}, {toDms(lng, false)}]
              </span>
            )}

            {elevation && (
              <span className="text-isie-text-dim hidden md:inline">
                ALT: {elevation}m MSL
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Copy Coordinates button in Fullscreen */}
            {isFullscreen && (
              <button
                type="button"
                onClick={handleCopyCoordinates}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-xs font-mono text-[11px] bg-white/5 hover:bg-white/15 border border-white/15 text-white transition-colors cursor-pointer"
                title="Copy high-precision coordinates to clipboard"
              >
                {copiedCoords ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300 font-bold">COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-sky-400" />
                    <span>COPY COORDS</span>
                  </>
                )}
              </button>
            )}

            <TacticalBadge
              variant={
                incident.severity === "CRITICAL"
                  ? "critical"
                  : incident.severity === "HIGH"
                  ? "orange"
                  : "cyan"
              }
              size="sm"
            >
              ZOOM: {zoomLevel}x
            </TacticalBadge>

            {/* Full-Screen Toggle Button */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className={`p-1 rounded-xs transition-colors flex items-center gap-1 cursor-pointer border ${
                isFullscreen
                  ? "bg-sky-500/20 text-sky-300 border-sky-500/60 font-bold px-2 py-0.5"
                  : "text-sky-400 hover:text-white hover:bg-white/10 border-transparent"
              }`}
              title={
                isFullscreen
                  ? "Minimize overlay (or press Esc)"
                  : "Open full-screen map overlay for detailed coordinate inspection"
              }
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span className="text-[11px] hidden sm:inline">MINIMIZE</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="text-[10px] hidden sm:inline">FULLSCREEN</span>
                </>
              )}
            </button>

            {/* Close button */}
            {onClose && !isFullscreen && (
              <button
                type="button"
                onClick={onClose}
                className="p-1 text-isie-text-muted hover:text-white rounded-xs transition-colors ml-0.5 cursor-pointer"
                title="Close Map Preview"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {isFullscreen && (
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="p-1 text-isie-text-muted hover:text-white rounded-xs transition-colors ml-0.5 cursor-pointer"
                title="Close Fullscreen (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Main Map Viewport */}
        <div
          className={`relative w-full bg-isie-bg-deep overflow-hidden map-style-tactical ${
            isFullscreen ? "flex-1 min-h-[360px]" : "h-48 sm:h-56"
          }`}
        >
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {/* Tactical Crosshair Center Indicator */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
            <div
              className={`border border-white/10 rounded-full flex items-center justify-center ${
                isFullscreen ? "w-28 h-28" : "w-16 h-16"
              }`}
            >
              <div className="w-1.5 h-1.5 bg-sky-400 rounded-full shadow-[0_0_8px_#38bdf8]" />
              {isFullscreen && (
                <>
                  <div className="absolute w-full h-[1px] bg-white/10" />
                  <div className="absolute h-full w-[1px] bg-white/10" />
                </>
              )}
            </div>
          </div>

          {/* Floating Map Controls */}
          <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5">
            <button
              type="button"
              onClick={handleZoomIn}
              className="w-8 h-8 bg-slate-900/90 hover:bg-slate-800 border border-white/20 rounded-xs flex items-center justify-center text-white text-xs transition-colors shadow-xl cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              className="w-8 h-8 bg-slate-900/90 hover:bg-slate-800 border border-white/20 rounded-xs flex items-center justify-center text-white text-xs transition-colors shadow-xl cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleRecenter}
              className="w-8 h-8 bg-slate-900/90 hover:bg-slate-800 border border-white/20 rounded-xs flex items-center justify-center text-sky-400 hover:text-white text-xs transition-colors shadow-xl cursor-pointer"
              title="Recenter on Ground Zero Coordinate Pin"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            {/* Quick Full-Screen Toggle in map floating controls */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="w-8 h-8 bg-slate-900/90 hover:bg-slate-800 border border-white/20 rounded-xs flex items-center justify-center text-sky-400 hover:text-white text-xs transition-colors shadow-xl cursor-pointer"
              title={isFullscreen ? "Exit Full-Screen" : "Full-Screen Overlay"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Detailed Floating Telemetry Badge in Full-Screen Mode */}
          {isFullscreen && (
            <div className="absolute top-3 left-3 z-20 max-w-sm p-3 bg-slate-950/90 border border-white/15 rounded-xs font-mono text-xs shadow-2xl backdrop-blur-md space-y-2 pointer-events-auto">
              <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                <span className="font-bold text-white uppercase tracking-wider">
                  {incident.eventCode || incident.id}
                </span>
                <TacticalBadge
                  variant={
                    incident.severity === "CRITICAL"
                      ? "critical"
                      : incident.severity === "HIGH"
                      ? "orange"
                      : "cyan"
                  }
                  size="sm"
                >
                  {incident.severity}
                </TacticalBadge>
              </div>

              <div className="text-white font-semibold leading-tight">
                {incident.title}
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-isie-text-secondary pt-1 border-t border-white/5">
                <div>
                  <span className="text-isie-text-dim block text-[10px]">DECIMAL COORDS:</span>
                  <span className="text-sky-300 font-bold">
                    {lat.toFixed(6)}°, {lng.toFixed(6)}°
                  </span>
                </div>
                <div>
                  <span className="text-isie-text-dim block text-[10px]">DMS NOTATION:</span>
                  <span className="text-white text-[10px]">
                    {toDms(lat, true)}
                  </span>
                </div>
                <div>
                  <span className="text-isie-text-dim block text-[10px]">POPULATION AT RISK:</span>
                  <span className="text-amber-300 font-bold">
                    {incident.populationAtRisk?.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-isie-text-dim block text-[10px]">AFFECTED AREA:</span>
                  <span className="text-white font-bold">
                    {incident.affectedAreaKm2 || "35"} km²
                  </span>
                </div>
              </div>

              <div className="pt-1 border-t border-white/5 flex items-center justify-between text-[10px]">
                <span className="text-emerald-400">
                  PERIMETER RADIUS: ~
                  {(
                    (incident.affectedAreaKm2
                      ? Math.sqrt(incident.affectedAreaKm2) * 500
                      : 3500) / 1000
                  ).toFixed(1)}{" "}
                  KM
                </span>
                <span className="text-isie-text-dim">
                  PRESS ESC TO EXIT
                </span>
              </div>
            </div>
          )}

          {/* Fallback Display if tile loading takes time or network is slow */}
          {tileError && (
            <div className="absolute bottom-3 left-3 z-20 px-2.5 py-1 bg-black/85 border border-amber-500/40 rounded-xs font-mono text-[11px] text-amber-300">
              OFFLINE VECTOR TILE ENGINE ACTIVE
            </div>
          )}
        </div>

        {/* Bottom Footer Action Bar */}
        <div
          className={`px-3 bg-slate-900/95 border-t border-white/10 flex items-center justify-between z-20 relative font-mono ${
            isFullscreen ? "h-10 text-xs" : "h-8 text-[11px]"
          }`}
        >
          <div className="flex items-center gap-2 truncate text-isie-text-secondary">
            <span className="text-white font-semibold truncate">
              {incident.locationName}
            </span>
            <span className="text-white/20">•</span>
            <span className="truncate text-isie-text-dim">
              {incident.district ? `${incident.district}, ` : ""}
              {incident.state || "India"}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Toggle Fullscreen action link */}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-semibold transition-colors cursor-pointer"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>MINIMIZE OVERLAY</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>FULL-SCREEN OVERLAY</span>
                </>
              )}
            </button>

            <span className="text-white/20">|</span>

            <Link
              href="/map"
              className="inline-flex items-center gap-1.5 text-xs text-isie-text-secondary hover:text-white font-semibold transition-colors"
            >
              <span>OPEN IN 2D GIS MAP</span>
              <ExternalLink className="w-3 h-3 text-isie-primary" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
