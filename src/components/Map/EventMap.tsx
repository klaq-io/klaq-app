import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import Map, {
  FullscreenControl,
  Layer,
  Marker,
  NavigationControl,
  Popup,
  Source,
} from "react-map-gl";
import { useGetEventMapInformations } from "redux/MainEvent/hooks";
import WebMercatorViewport from "@math.gl/web-mercator";
import { MapPinIcon } from "@heroicons/react/24/solid";

export type MapProps = {
  data: any;
};

export const EventMap = (props: MapProps) => {
  const { data } = props;
  const mapContainerRef = useRef<any | null>();

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const viewport = new WebMercatorViewport({ width, height });

  const waypoints = data.waypoints;
  const bound = viewport.fitBounds(
    waypoints.map((waypoint: any) => waypoint.location)
  );
  const { longitude, latitude, zoom } = bound;

  useEffect(() => {
    if (mapContainerRef.current) {
      setWidth(mapContainerRef.current.offsetWidth);
      setHeight(mapContainerRef.current.clientHeight);
    }
  }, []);

  return (
    <div ref={mapContainerRef} className="w-full h-full">
      <Map
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        mapLib={import("mapbox-gl")}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        id="mapData"
        initialViewState={{ ...bound, zoom: 7 }}
      >
        <Source id="event-map" type="geojson" data={data.routes[0].geometry}>
          <Layer
            id="lineLayer"
            type="line"
            source="my-data"
            layout={{
              "line-join": "round",
              "line-cap": "round",
            }}
            paint={{
              "line-color": "rgba(3, 170, 238, 0.5)",
              "line-width": 5,
            }}
          />
        </Source>
        {waypoints.map((waypoint: any) => (
          <Marker
            longitude={waypoint.location[0]}
            latitude={waypoint.location[1]}
          >
            <MapPinIcon className="w-8 h-8 text-red-500" />
          </Marker>
        ))}
        <NavigationControl />
        <FullscreenControl />
      </Map>
    </div>
  );
};
