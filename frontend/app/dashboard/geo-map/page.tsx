"use client";

import React, { useState, useCallback } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  MapMouseEvent,
} from "@vis.gl/react-google-maps";
import { Circle } from "../../../components/geo-map/circle";
import { useGeoStore } from "@/components/geo-map/store";


const getMockIdeas = (lat: number, lng: number) => {
  return [
    {
      title: "Local Logistics Platform",
      reason: `Good for semi-urban clusters around (${lat.toFixed(
        2
      )}, ${lng.toFixed(2)})`,
    },
    {
      title: "Community Healthcare Startup",
      reason: "This region lacks primary health infra per scraped trend data",
    },
  ];
};

export default function FeatureTwo() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "";
  const mapId = process.env.NEXT_PUBLIC_MAP_ID || "";

  if (!mapId) {
    console.log("Map ID is not set in the environment variables.");
  }

  const { lat, lng, setLocation, ideas, setIdeas } = useGeoStore();
  const [open, setOpen] = useState(false);
  const [clickedPosition, setClickedPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [circleCenter, setCircleCenter] = useState<google.maps.LatLngLiteral | null>(null);

  const handleMapClick = useCallback((e: MapMouseEvent) => {
    if (e.detail && e.detail.latLng) {
      const newLat = e.detail.latLng.lat;
      const newLng = e.detail.latLng.lng;

      const newCenter = { lat: newLat, lng: newLng };
      setClickedPosition(newCenter);
      setCircleCenter(newCenter);
      
      setLocation(newLat, newLng);
      setIdeas(getMockIdeas(newLat, newLng));
      setOpen(true);
    }
  }, [setLocation, setIdeas]);

  return (
    <div className="relative">
      <APIProvider apiKey={apiKey}>
        <Map
          mapId={mapId}
          style={{ width: "100vw", height: "90vh" }}
          defaultCenter={{ lat: 22.54992, lng: 0 }}
          defaultZoom={3}
          onClick={handleMapClick}
        >
          {clickedPosition && (
            <>
              <AdvancedMarker position={clickedPosition}>
                <Pin />
              </AdvancedMarker>

              {circleCenter && (
                <Circle
                  center={circleCenter}
                  radius={100000}
                  strokeColor={'#0c4cb3'}
                  strokeOpacity={1}
                  strokeWeight={3}
                  fillColor={'#3b82f6'}
                  fillOpacity={0.3}
                />
              )}
            </>
          )}
        </Map>
      </APIProvider>

      {open && clickedPosition && (
        <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-md">
          <h3 className="text-lg font-bold mb-2">
            Startup Ideas for this Region
          </h3>
          {ideas.map((idea, index) => (
            <div key={index} className="mb-4">
              <h4 className="font-semibold">{idea.title}</h4>
              <p className="text-gray-600">{idea.reason}</p>
            </div>
          ))}
          <button
            onClick={() => setOpen(false)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
