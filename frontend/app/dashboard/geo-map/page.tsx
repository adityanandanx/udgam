"use client";

import React, { useState, useCallback } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  MapMouseEvent,
  MapControl,
  ControlPosition,
} from "@vis.gl/react-google-maps";
import { Circle } from "../../../components/geo-map/circle";
import { useGeoStore } from "@/components/geo-map/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

  const [circleCenter, setCircleCenter] =
    useState<google.maps.LatLngLiteral | null>(null);

  const handleMapClick = useCallback(
    (e: MapMouseEvent) => {
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
    },
    [setLocation, setIdeas]
  );

  return (
    <div className="absolute inset-0 w-full h-full rounded-md overflow-hidden">
      <APIProvider apiKey={apiKey}>
        <Map
          mapId={mapId}
          className="w-full h-full"
          colorScheme="DARK"
          defaultCenter={{ lat: 20.5937, lng: 78.9629 }}
          defaultZoom={5}
          onClick={handleMapClick}
          controlSize={30}
          // controlled={false}
          mapTypeControlOptions={{ position: ControlPosition.BOTTOM_LEFT }}
        >
          {clickedPosition && (
            <>
              <AdvancedMarker position={clickedPosition}>
                <Pin
                  background={"var(--color-destructive)"}
                  borderColor={"var(--color-secondary)"}
                  glyphColor={"var(--color-secondary)"}
                  scale={1.2}
                />
              </AdvancedMarker>

              {circleCenter && (
                <Circle
                  center={circleCenter}
                  radius={100000}
                  strokeColor={"#0c4cb3"}
                  strokeOpacity={1}
                  strokeWeight={3}
                  fillColor={"#3b82f6"}
                  fillOpacity={0.3}
                />
              )}
            </>
          )}
        </Map>
      </APIProvider>

      {open && clickedPosition && (
        <Card className="absolute top-4 right-4 max-w-md">
          <CardHeader>
            <CardTitle className="text-lg font-bold p-0">
              Startup Ideas for this Region
            </CardTitle>
          </CardHeader>
          <CardContent>
            {ideas.map((idea, index) => (
              <div key={index} className="mb-4">
                <h4 className="font-semibold">{idea.title}</h4>
                <p className="text-muted-foreground">{idea.reason}</p>
              </div>
            ))}
            <Button onClick={() => setOpen(false)} variant={"destructive"}>
              Close
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
