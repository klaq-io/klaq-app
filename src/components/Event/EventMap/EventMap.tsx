import WebMercatorViewport from "@math.gl/web-mercator";
import { useEffect, useRef, useState } from "react";
import { useGetEventMapInformations } from "redux/MainEvent/hooks";
import Map, {
  FullscreenControl,
  Layer,
  Marker,
  NavigationControl,
  Popup,
  Source,
} from "react-map-gl";
import { MapPinIcon } from "@heroicons/react/24/solid";
import { TruckIcon } from "@heroicons/react/24/outline";
import { classNames, getTimeStr } from "utils/utils";

type EventMapProps = {
  eventId: string;
  displayDistance?: boolean;
};

export const EventMapV2 = (props: EventMapProps) => {
  const { eventId, displayDistance = false } = props;
  const [{ data: mapData, isLoading }, getEventMapInformations] =
    useGetEventMapInformations();

  const mapContainerRef = useRef<any | null>();

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [waypoints, setWaypoints] = useState<any>([]);
  const [bound, setBound] = useState<any>();

  const viewport = new WebMercatorViewport({ width, height });

  useEffect(() => {
    if (mapContainerRef.current) {
      setWidth(mapContainerRef.current.offsetWidth);
      setHeight(mapContainerRef.current.clientHeight);
    }
  }, []);

  useEffect(() => {
    getEventMapInformations(eventId);
  }, []);

  useEffect(() => {
    if (mapData) {
      setWaypoints(mapData.waypoints);
    }
  }, [mapData]);

  useEffect(() => {
    if (waypoints && waypoints.length > 0) {
      setBound(
        viewport.fitBounds(waypoints.map((waypoint: any) => waypoint.location))
      );
    }
  }, [waypoints]);

  return !isLoading && mapData && bound && waypoints ? (
    <div className="flex flex-col w-full h-full space-y-4">
      <div ref={mapContainerRef} className="w-full h-full">
        <Map
          mapboxAccessToken={process.env.REACT_APP_MAPBOX}
          mapLib={import("mapbox-gl")}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          id="mapData"
          initialViewState={{ ...bound, zoom: 7 }}
        >
          <Source
            id="event-map"
            type="geojson"
            data={mapData.routes[0].geometry}
          >
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
          {waypoints.map((waypoint: any, idx: number) => (
            <Marker
              longitude={waypoint.location[0]}
              latitude={waypoint.location[1]}
            >
              <MapPinIcon
                className={classNames(
                  "w-8 h-8",
                  idx === 0
                    ? "text-klaq-500"
                    : idx === waypoints.length - 1
                    ? "text-klaq-500"
                    : "text-red-500"
                )}
              />
            </Marker>
          ))}
          <NavigationControl />
          <FullscreenControl />
        </Map>
      </div>
      {/* <div className="flex">
        <span className="bg-klaq-500 flex flex-1 flex-row text-white space-x-4 px-4 py-5 sm:p-6 rounded-md">
          <TruckIcon className="h-5 w-5" />
          <span className="font-bold">
            {Math.round(mapData.routes[0].distance / 1000)} km (
            {getTimeStr(mapData.routes[0].duration)})
          </span>
        </span>
        <span className="flex-1"></span>
      </div> */}
    </div>
  ) : (
    <>
      <div className="w-full h-full">
        {/* <Map
          mapboxAccessToken={process.env.REACT_APP_MAPBOX}
          mapLib={import("mapbox-gl")}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          id="mapData"
          initialViewState={{ longitude, latitude, zoom }}
        >
          <NavigationControl />
          <FullscreenControl />
        </Map> */}
      </div>
    </>
  );
};
