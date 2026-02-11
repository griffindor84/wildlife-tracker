import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { useState, useEffect } from "react";
import type { LatLngLiteral, LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";

export type Coords = { lat: number; lng: number };

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

type LocationMapProps = {
  onLocationSelect: (coords: Coords) => void;
  initialCoords?: Coords | null;
};

function LocationMap({ onLocationSelect, initialCoords }: LocationMapProps) {
  const [clickedCoords, setClickedCoords] = useState<LatLngLiteral | null>(null);

  // Current marker: either the initial coords from parent or user click
  const markerPos = initialCoords ?? clickedCoords;
  const center: LatLngLiteral = markerPos ?? { lat: -6.369028, lng: 34.888822 };

  // Auto-center map when initialCoords changes
  function AutoCenter() {
    const map = useMap();
    useEffect(() => {
      if (initialCoords) {
        map.setView([initialCoords.lat, initialCoords.lng], map.getZoom());
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialCoords]); // map is stable, no need to add it
    return null;
  }

  // Call parent callback whenever marker changes
  useEffect(() => {
    if (markerPos) {
      onLocationSelect({ lat: markerPos.lat, lng: markerPos.lng });
    }
  }, [markerPos, onLocationSelect]);

  return (
    <MapContainer
      center={center}
      zoom={6}
      style={{ height: "300px", width: "100%", borderRadius: "10px" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <ClickMarker position={markerPos} onSelect={setClickedCoords} />
      <AutoCenter />
    </MapContainer>
  );
}

export default LocationMap;
