import React from "react";
import {
  APIProvider,
  Map,
  MapCameraChangedEvent,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";
import dotenv from "dotenv";
import styles from "./index.module.css";

dotenv.config();

type Poi = { key: string; location: google.maps.LatLngLiteral };
const locations: Poi[] = [
  { key: "noFrills", location: { lat: 43.8547691, lng: -79.4297517 } },
  { key: "freshCo", location: { lat: 43.88075864412101, lng: -79.39528998999123 } },
  { key: "foodBasics", location: { lat: 43.87763667809579, lng: -79.41134453245378 } },
  { key: "tnt", location: { lat: 43.8622441, lng: -79.4326858 } },
];

const PoiMarkers = (props: { pois: Poi[] }) => {
  return (
    <>
      {props.pois.map((poi: Poi) => (
        <AdvancedMarker key={poi.key} position={poi.location}>
          <Pin
            background={"#F92D2D"}
            glyphColor={"#000"}
            borderColor={"#000"}
          />
        </AdvancedMarker>
      ))}
    </>
  );
};

const index = () => {
  const token = process.env.googleToken as string;

  return (
    <APIProvider
      apiKey={token}
      onLoad={() => console.log("Maps API has loaded.")}
    >
      <Map
        className={styles.map}
        defaultZoom={13}
        defaultCenter={{ lat: 43.855, lng: -79.4 }}
        mapId={"3ccec7981803cd35"}
        onCameraChanged={(ev: MapCameraChangedEvent) =>
          console.log(
            "camera changed:",
            ev.detail.center,
            "zoom:",
            ev.detail.zoom
          )
        }
      >
        <PoiMarkers pois={locations} />
      </Map>
    </APIProvider>
  );
};

export default index;
