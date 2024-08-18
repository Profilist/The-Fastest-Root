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
import { useRouter } from "next/router";

require("dotenv").config();

interface Item {
  store: string;
  productName: string;
  price: string;
}

interface Store {
  name: string;
  items: Item[];
}

const index: React.FC = () => {
  const [locations, setLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [tripData, setTripData] = useState<Item[]>([]);

  const router = useRouter();
  const [costcoChecked, setCostcoChecked] = useState<boolean>(
    router.query.costcoChecked === 'true'
  );
  const [storeNumber, setStoreNumber] = useState<number>(
    parseInt(router.query.storeNumber as string, 10) || 1
  );
  
  const handleCostcoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCostcoChecked(e.target.checked);
  };

  const handleStoreNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStoreNumber(parseInt(e.target.value, 10) || 1);
  };

  useEffect(() => {
    if (router.query.data) {
      const parsedData = JSON.parse(router.query.data as string);
      console.log("Parsed Data:", parsedData); 

      const tripArray = parsedData.ret;

      if (Array.isArray(tripArray)) {
        setTripData(tripArray);
      } else {
        console.error("Expected an array, but got:", tripArray);
      }
    }
  }, [router.query]);

  const stores: Store[] = tripData.reduce((acc: Store[], item: Item) => {
    const storeIndex = acc.findIndex(store => store.name === item.store);
    if (storeIndex === -1) {
      acc.push({ name: item.store, items: [item] });
    } else {
      acc[storeIndex].items.push(item);
    }
    return acc;
  }, []);

  console.log(stores);

  const generateId = (index: number): string => {
    return String.fromCharCode(65 + index);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.tripPanel}>
          <h2>YOUR TRIP</h2>
          <div className={styles.tripInfo}>
          <label>
            Costco Membership
              <input
                type="checkbox"
                className={styles.costcoCheckbox}
                checked={costcoChecked}
                onChange={handleCostcoChange}
              />
            </label>
            <label>
              Stops:
              <input
                type="number"
                className={styles.filterCheckbox}
                value={storeNumber}
                onChange={handleStoreNumberChange}
              />
            </label>
          </div>
          <ol className={styles.tripList}>
          {stores.map(store => (
              <li key={store.name}>
                <h3>{store.name}</h3>
                <ul>
                  {store.items.map(item => (
                    <li key={item.productName}>
                      {item.productName} - {item.price}
                    </li>
                  ))}
                </ul>
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
