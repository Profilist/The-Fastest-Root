import React from "react";
import {
  APIProvider,
  Map,
  MapCameraChangedEvent,
} from "@vis.gl/react-google-maps";
import dotenv from "dotenv";
import styles from "./index.module.css";

dotenv.config();

const index = () => {
  const token = process.env.googleToken as string;

  return (
    <APIProvider
      apiKey={token}
      onLoad={() => console.log("Maps API has loaded.")}
    >
      <Map
        className={styles.map}
        defaultZoom={14}
        defaultCenter={{ lat: 43.855, lng: -79.4 }}
        onCameraChanged={(ev: MapCameraChangedEvent) =>
          console.log(
            "camera changed:",
            ev.detail.center,
            "zoom:",
            ev.detail.zoom
          )
        }
      ></Map>
    </APIProvider>
  );
};

export default index;
