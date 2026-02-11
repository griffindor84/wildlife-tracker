import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import type { LatLngLiteral, LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";

// Type for coordinates
export type Coords = { lat: number; lng: number };

// Props for LocationMap
export type LocationMapProps = {
  onLocationSelect: (coords: Coords) => void;
  initialCoords?: Coords | null;
};

// Marker component that updates when user clicks
type ClickMarkerProps = {
  onSelect: (coords: Coords) => void;
  position: LatLngLiteral | null;
};

function ClickMarker({ onSelect, position }: ClickMarkerProps) {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      const coords: Coords = { lat: e.latlng.lat, lng: e.latlng.lng };
      onSelect(coords);
    },
  });

  return position ? <Marker position={position} /> : null;
}

// Auto-center map when initialCoords changes
function AutoCenter({ coords }: { coords: Coords | null | undefined }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView([coords.lat, coords.lng], map.getZoom());
    }
  }, [coords, map]);
  return null;
}

// Main LocationMap component
export default function LocationMap({
  onLocationSelect,
  initialCoords,
}: LocationMapProps) {
  const [clickedCoords, setClickedCoords] = useState<LatLngLiteral | null>(null);

  // Marker position: initialCoords takes precedence
  const markerPos: LatLngLiteral | null = initialCoords ?? clickedCoords;
  const center: LatLngLiteral = markerPos ?? { lat: -6.369028, lng: 34.888822 };

  return (
    <MapContainer
      center={center}
      zoom={6}
      style={{ height: "300px", width: "100%", borderRadius: "10px" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <ClickMarker
        position={markerPos}
        onSelect={(coords) => {
          setClickedCoords(coords);
          onLocationSelect(coords);
        }}
      />
      <AutoCenter coords={initialCoords} />
    </MapContainer>
  );
}
