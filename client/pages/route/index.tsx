import React, { useEffect, useState } from "react";
import {
  APIProvider,
  Map,
  MapCameraChangedEvent,
  AdvancedMarker,
  Pin,
  useMapsLibrary,
  useMap,
} from "@vis.gl/react-google-maps";
import styles from "./index.module.css";

require("dotenv").config();

interface Location {
  name: string;
}

const index: React.FC = () => {
  const [locations, setLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/locations"); 
        const data = await response.json();
        setLocations(data.locations);
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  console.log(locations);

  const generateId = (index: number): string => {
    return String.fromCharCode(65 + index);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.tripPanel}>
          <h2>YOUR TRIP</h2>
          <div className={styles.tripInfo}>
            <p>3 stops, Costco Membership</p>
            <a href="#" className={styles.optionsLink}>
              Options
            </a>
          </div>
          <ol className={styles.tripList}>
          {locations.map((location, index) => (
              <li key={generateId(index)}>
                {generateId(index)}. {location}
              </li>
            ))}
          </ol>
          <button className={styles.goButton}>GO</button>
        </div>

        <div className={styles.mapPanel}>
          <APIProvider
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "no key"}
            onLoad={() => console.log("Maps API has loaded.")}
          >
            <Map
              className={styles.map}
              defaultZoom={13}
              defaultCenter={{ lat: 43.855, lng: -79.4 }}
              mapId={process.env.NEXT_PUBLIC_MAP_ID}
              onCameraChanged={(ev: MapCameraChangedEvent) =>
                console.log(
                  "camera changed:",
                  ev.detail.center,
                  "zoom:",
                  ev.detail.zoom
                )
              }
            >
              {/* <PoiMarkers pois={locations} /> */}
              <Directions />
            </Map>
          </APIProvider>
        </div>

        <div className={styles.summaryPanel}>
          <p>Total Savings: $30.50 (-17%)</p>
          <p>Distance: 20.6km</p>
        </div>
      </div>
    </div>
  );
};

function Directions() {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer>();
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);

  const waypts: google.maps.DirectionsWaypoint[] = [
    {
      location: { lat: 43.87749259953832, lng: -79.4113334157598 },
      stopover: true,
    },
    {
      location: { lat: 43.880638386115955, lng: -79.39524664624328 },
      stopover: true,
    },
    { location: { lat: 43.8547691, lng: -79.4297517 }, stopover: true },
  ];

  useEffect(() => {
    if (!routesLibrary || !map) {
      return;
    }
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer) {
      return;
    }

    directionsService
      .route({
        origin: "56 Farmstead Rd, Richmond Hill, ON L4S 1W3",
        destination: { lat: 43.8622441, lng: -79.4326858 },
        travelMode: google.maps.TravelMode.DRIVING,
        waypoints: waypts,
        optimizeWaypoints: true,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
        setRoutes(response.routes);
      });
  }, [directionsService, directionsRenderer]);

  console.log(routes);

  return null;
}

export default index;
