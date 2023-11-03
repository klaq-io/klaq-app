import Map, {
  FullscreenControl,
  Marker,
  NavigationControl,
  Popup,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPinIcon } from "@heroicons/react/20/solid";
import Layer from "react-map-gl/dist/esm/components/layer";

type MapProps = {
  longitude: number;
  latitude: number;
  zoom: number;
};

export const Mapbox = (props: MapProps) => {
  const { longitude, latitude, zoom } = props;
  return (
    <Map
      mapboxAccessToken={process.env.REACT_APP_MAPBOX}
      mapLib={import("mapbox-gl")}
      initialViewState={{
        latitude,
        longitude,
        zoom,
      }}
      longitude={longitude}
      latitude={latitude}
      style={{ width: "100%", height: "100%" }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    >
      <NavigationControl />
      <FullscreenControl />
      <Marker latitude={latitude} longitude={longitude}>
        <MapPinIcon className="w-8 h-8 text-red-500" />
      </Marker>
    </Map>
  );
};

export { Mapbox as Map };
