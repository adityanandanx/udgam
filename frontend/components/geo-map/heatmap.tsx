import { useEffect, useMemo } from "react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { FeatureCollection, Point, GeoJsonProperties } from "geojson";

export type IdeaHeatmap = FeatureCollection<Point, GeoJsonProperties> & {
  factors: string[];
};

type HeatmapProps = {
  geojson: FeatureCollection<Point, GeoJsonProperties>;
  radius: number;
  opacity: number;
};

const Heatmap = ({ geojson, radius, opacity }: HeatmapProps) => {
  const map = useMap();
  const visualization = useMapsLibrary("visualization");

  const heatmap = useMemo(() => {
    if (!visualization) return null;

    return new google.maps.visualization.HeatmapLayer({
      radius: radius,
      opacity: opacity,
      maxIntensity: 2,
    });
  }, [visualization, radius, opacity]);

  useEffect(() => {
    if (!heatmap) return;

    heatmap.setData(
      geojson.features.map((point) => {
        const [lng, lat] = point.geometry.coordinates;

        return {
          location: new google.maps.LatLng(lat, lng),
          weight: point.properties?.weight,
        };
      })
    );
  }, [heatmap, geojson, radius, opacity]);

  useEffect(() => {
    if (!heatmap) return;

    heatmap.setMap(map);

    return () => {
      heatmap.setMap(null);
    };
  }, [heatmap, map]);

  return null;
};

export default Heatmap;
