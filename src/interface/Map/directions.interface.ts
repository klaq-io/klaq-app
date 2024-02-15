export interface Directions {
  routes: Route[];
  waypoints: Waypoint[];
}

export interface Route {
  distance: number;
  duration: number;
  weight: number;
  weight_name: string;
  geometry: Geometry;
}

export interface Geometry {
  coordinates: [number, number][];
  type: string;
}

export interface Waypoint {
  distance: number;
  name: string;
  location: [number, number];
}
