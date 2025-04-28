"use client";

import { useGeoStore } from "@/components/geo-map/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AdvancedMarker,
  APIProvider,
  ControlPosition,
  Map,
  MapMouseEvent,
  Pin,
} from "@vis.gl/react-google-maps";
import { useCallback, useState } from "react";
import { Circle } from "../../../../components/geo-map/circle";
import Heatmap, { IdeaHeatmap } from "@/components/geo-map/heatmap";

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

const mockHeatmap: IdeaHeatmap = {
  type: "FeatureCollection",
  factors: [
    "Talent Pool",
    "Tech Adoption",
    "Healthcare Facilities",
    "Talent Pool",
    "Competition",
    "Tech Adoption",
    "Digital Infrastructure",
    "Green Initiatives",
    "Digital Infrastructure",
    "Talent Pool",
    "Urbanization",
    "Disposable Income",
    "Government Support",
  ],
  features: [
    {
      type: "Feature",
      properties: {
        weight: 0.93,
        district: "Mumbai",
      },
      geometry: {
        type: "Point",
        coordinates: [72.8777, 19.076],
      },
    },
    {
      type: "Feature",
      properties: {
        weight: 0.89,
        district: "Delhi",
      },
      geometry: {
        type: "Point",
        coordinates: [77.1025, 28.7041],
      },
    },
    {
      type: "Feature",
      properties: {
        weight: 0.9,
        district: "Bangalore",
      },
      geometry: {
        type: "Point",
        coordinates: [77.5946, 12.9716],
      },
    },
    {
      type: "Feature",
      properties: {
        weight: 0.77,
        district: "Chennai",
      },
      geometry: {
        type: "Point",
        coordinates: [80.2707, 13.0827],
      },
    },
    {
      type: "Feature",
      properties: {
        weight: 0.8,
        district: "Hyderabad",
      },
      geometry: {
        type: "Point",
        coordinates: [78.4867, 17.385],
      },
    },
    {
      type: "Feature",
      properties: {
        weight: 0.71,
        district: "Kolkata",
      },
      geometry: {
        type: "Point",
        coordinates: [88.3639, 22.5726],
      },
    },
    {
      type: "Feature",
      properties: {
        weight: 0.77,
        district: "Pune",
      },
      geometry: {
        type: "Point",
        coordinates: [73.8567, 18.5204],
      },
    },
    {
      type: "Feature",
      properties: {
        weight: 0.74,
        district: "Ahmedabad",
      },
      geometry: {
        type: "Point",
        coordinates: [72.5714, 23.0225],
      },
    },
    {
      type: "Feature",
      properties: {
        weight: 0.65,
        district: "Jaipur",
      },
      geometry: {
        type: "Point",
        coordinates: [75.7873, 26.9124],
      },
    },
    {
      type: "Feature",
      properties: {
        weight: 0.63,
        district: "Lucknow",
      },
      geometry: {
        type: "Point",
        coordinates: [80.9462, 26.8467],
      },
    },
    {
      type: "Feature",
      properties: {
        weight: 0.67,
        district: "Chandigarh",
      },
      geometry: {
        type: "Point",
        coordinates: [76.7794, 30.7333],
      },
    },
    {
      type: "Feature",
      properties: {
        weight: 0.64,
        district: "Indore",
      },
      geometry: {
        type: "Point",
        coordinates: [75.8577, 22.7196],
      },
    },
    {
      type: "Feature",
      properties: {
        weight: 0.63,
        district: "Nagpur",
      },
      geometry: {
        type: "Point",
        coordinates: [79.0882, 21.1458],
      },
    },
    {
      type: "Feature",
      properties: {
        weight: 0.6,
        district: "Bhopal",
      },
      geometry: {
        type: "Point",
        coordinates: [77.4126, 23.2599],
      },
    },
    {
      type: "Feature",
      properties: {
        weight: 0.61,
        district: "Visakhapatnam",
      },
      geometry: {
        type: "Point",
        coordinates: [83.2185, 17.6868],
      },
    },
    {
      type: "Feature",
      properties: {
        weight: 0.69,
        district: "Kochi",
      },
      geometry: {
        type: "Point",
        coordinates: [76.2673, 9.9312],
      },
    },
    {
      type: "Feature",
      properties: {
        weight: 0.65,
        district: "Coimbatore",
      },
      geometry: {
        type: "Point",
        coordinates: [76.9558, 11.0168],
      },
    },
    {
      type: "Feature",
      properties: {
        weight: 0.56,
        district: "Guwahati",
      },
      geometry: {
        type: "Point",
        coordinates: [91.7362, 26.1445],
      },
    },
    {
      type: "Feature",
      properties: {
        weight: 0.57,
        district: "Bhubaneswar",
      },
      geometry: {
        type: "Point",
        coordinates: [85.8245, 20.2961],
      },
    },
    {
      type: "Feature",
      properties: {
        weight: 0.55,
        district: "Dehradun",
      },
      geometry: {
        type: "Point",
        coordinates: [78.0322, 30.3165],
      },
    },
  ],
};

export default function FeatureTwo() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "";
  const mapId = process.env.NEXT_PUBLIC_MAP_ID || "";

  if (!mapId) {
    console.log("Map ID is not set in the environment variables.");
  }

  const { lat, lng, setLocation, ideas, setIdeas } = useGeoStore();
  const [open, setOpen] = useState(false);

  const [circleCenter, setCircleCenter] =
    useState<google.maps.LatLngLiteral | null>(null);

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

          <Heatmap geojson={mockHeatmap} opacity={0.8} radius={50} />
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
