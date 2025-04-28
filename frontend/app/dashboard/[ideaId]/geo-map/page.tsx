"use client";

import Heatmap from "@/components/geo-map/heatmap";
import { useGeoStore } from "@/components/geo-map/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGenerateIdeaHeatmap } from "@/hooks/api-hooks/use-ideas";
import {
  AdvancedMarker,
  APIProvider,
  ControlPosition,
  Map,
  MapControl,
  MapMouseEvent,
  Pin,
} from "@vis.gl/react-google-maps";
import { useParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Circle } from "../../../../components/geo-map/circle";
import { HeaterIcon } from "lucide-react";

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

export default function GeoMapPage() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "";
  const mapId = process.env.NEXT_PUBLIC_MAP_ID || "";

  if (!mapId) {
    console.log("Map ID is not set in the environment variables.");
  }

  const { lat, lng, setLocation, ideas, setIdeas } = useGeoStore();
  const [open, setOpen] = useState(false);

  const [circleCenter, setCircleCenter] =
    useState<google.maps.LatLngLiteral | null>(null);

  const { ideaId } = useParams<{ ideaId: string }>();

  const heatmapQuery = useGenerateIdeaHeatmap(ideaId);

  const handleMapClick = useCallback(
    (e: MapMouseEvent) => {
      if (e.detail && e.detail.latLng) {
        const newLat = e.detail.latLng.lat;
        const newLng = e.detail.latLng.lng;

        const newCenter = { lat: newLat, lng: newLng };
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
          {lat && lng && (
            <>
              <AdvancedMarker position={{ lat, lng }}>
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

          {/* <div className="bg-background fixed top-0 w-sm">
            <pre>{JSON.stringify(heatmapQuery, null, 2)}</pre>
          </div> */}

          {heatmapQuery.isPending || heatmapQuery.isError ? null : (
            <>
              <Heatmap geojson={heatmapQuery.data} opacity={0.8} radius={50} />
            </>
          )}

          <MapControl position={ControlPosition.RIGHT}>
            <div className="px-2">
              <Button
                onClick={() => heatmapQuery.refetch()}
                disabled={heatmapQuery.isLoading}
                variant={"secondary"}
              >
                <HeaterIcon /> Generate Heatmap
              </Button>
            </div>
          </MapControl>
        </Map>
      </APIProvider>

      {open && lat && lng && (
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
