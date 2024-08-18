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

const Index: React.FC = () => {
  const [tripData, setTripData] = useState<Item[]>([]);
  const [savings, setSavings] = useState<string>("0.00");
  const [percentageSaved, setPercentageSaved] = useState<string>("0.00");
  const [distance, setDistance] = useState<string>("");

  const router = useRouter();
  const [costcoChecked, setCostcoChecked] = useState<boolean>(
    router.query.costcoChecked === "true"
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

      const tripArray = parsedData;

      if (Array.isArray(tripArray)) {
        setTripData(tripArray);
      } else {
        console.error("Expected an array, but got:", tripArray);
      }
    }
    if (router.query.savings) {
      const parsedSavings = JSON.parse(router.query.savings as string);
      setSavings(parsedSavings.savings || "0.00");
      setPercentageSaved(parsedSavings.percentageSaved || "0.00");
    }
  }, [router.query]);

  const stores: Store[] = tripData.reduce((acc: Store[], item: Item) => {
    const storeIndex = acc.findIndex((store) => store.name === item.store);
    if (storeIndex === -1) {
      acc.push({ name: item.store, items: [item] });
    } else {
      acc[storeIndex].items.push(item);
    }
    return acc;
  }, []);

  console.log("Stores:");
  console.log(stores);

  function capitalizeWords(str: string): string {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  const handleGoClick = () => {
    const storeLocations: { [key: string]: string } = {
      "Food Basics": "43.87749259953832,-79.4113334157598",
      FreshCo: "43.880638386115955,-79.39524664624328",
      NoFrills: "43.8547691,-79.4297517",
      "T&T": "43.8622441,-79.4326858",
    };

    const origin = "10077 Bayview Ave, Richmond Hill, ON L4C 2L4";
    const destination = storeLocations[stores[stores.length - 1].name];
    const waypoints = stores
      .slice(0, -1)
      .map((store) => storeLocations[store.name])
      .join("|");

    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      origin
    )}&destination=${encodeURIComponent(
      destination
    )}&waypoints=${encodeURIComponent(waypoints)}&travelmode=driving`;

    window.open(googleMapsUrl, "_blank");
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
            {stores.map((store) => (
              <li className={styles.listItem} key={store.name}>
                <h3>{store.name}</h3>
                <ul>
                  {store.items.map((item) => (
                    <li className={styles.foodItem} key={item.productName}>
                      {capitalizeWords(item.productName)} - {item.price}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
          <button onClick={handleGoClick} className={styles.goButton}>
            GO
          </button>
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
              <Directions stores={stores} setDistance={setDistance} />
            </Map>
          </APIProvider>
        </div>

        <div className={styles.summaryPanel}>
          <p>
            Great job! You saved ${savings}! (That&apos;s{" "}
            <span style={{ color: "#FF8282" }}>{percentageSaved}%</span> in
            savings){" "}
          </p>
          <p>Efficient and easy – your trip is {distance}.</p>
        </div>
      </div>
    </div>
  );
};

interface DirectionsProps {
  stores: Store[];
  setDistance: (distance: string) => void;
}

function Directions({ stores, setDistance }: DirectionsProps) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer>();
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);

  const storeLocations: { [key: string]: google.maps.LatLngLiteral } = {
    "Food Basics": { lat: 43.87749259953832, lng: -79.4113334157598 },
    "FreshCo": { lat: 43.880638386115955, lng: -79.39524664624328 },
    "NoFrills": { lat: 43.8547691, lng: -79.4297517 },
    "T&T": { lat: 43.8622441, lng: -79.4326858 },
  };

  const waypts: google.maps.DirectionsWaypoint[] =
    stores.length > 1
      ? stores.slice(0, -1).map((store) => ({
          location: storeLocations[store.name],
          stopover: true,
        }))
      : [];

  const finalDestination = stores.length > 0 ? storeLocations[stores[stores.length - 1].name] : null;

  useEffect(() => {
    if (routesLibrary && map) {
      if (!directionsService) {
        setDirectionsService(new routesLibrary.DirectionsService());
      }
      if (!directionsRenderer) {
        setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
      }
    }
  }, [routesLibrary, map, directionsService, directionsRenderer]);

  useEffect(() => {
    if (directionsService && directionsRenderer && finalDestination) {
      directionsService
        .route({
          origin: "10077 Bayview Ave, Richmond Hill, ON L4C 2L4",
          destination: finalDestination,
          travelMode: google.maps.TravelMode.DRIVING,
          waypoints: waypts,
          optimizeWaypoints: true,
        })
        .then((response) => {
          directionsRenderer.setDirections(response);
          setRoutes(response.routes);

          const routeDistance = response.routes[0]?.legs.reduce((total, leg) => {
            const legDistance = leg.distance?.text || "0 km";
            const value = parseFloat(legDistance.replace(/[^\d.]/g, ""));
            return total + value;
          }, 0);

          const unit = response.routes[0]?.legs[0]?.distance?.text.includes("mi") ? " mi" : " km";
          const totalDistance = `${routeDistance.toFixed(2)}${unit}`;
          setDistance(totalDistance || "Unknown");
        });
    }
  }, [directionsService, directionsRenderer, finalDestination, waypts, setDistance]);
  // useEffect(() => {
  //   if (!directionsService || !directionsRenderer) {
  //     return;
  //   }

  //   directionsService
  //     .route({
  //       origin: "10077 Bayview Ave, Richmond Hill, ON L4C 2L4",
  //       destination: finalDestination,
  //       travelMode: google.maps.TravelMode.DRIVING,
  //       waypoints: waypts,
  //       optimizeWaypoints: true,
  //     })
  //     .then((response) => {
  //       directionsRenderer.setDirections(response);
  //       setRoutes(response.routes);

  //       const routeDistance = response.routes[0]?.legs.reduce((total, leg) => {
  //         const legDistance = leg.distance?.text || "0 km";
  //         const value = parseFloat(legDistance.replace(/[^\d.]/g, ""));
  //         return total + value;
  //       }, 0);

  //       const unit = response.routes[0]?.legs[0]?.distance?.text.includes("mi")
  //         ? " mi"
  //         : " km";
  //       const totalDistance = `${routeDistance.toFixed(2)}${unit}`;
  //       setDistance(totalDistance || "Unknown");
  //     });
  // }, [directionsService, directionsRenderer]);

  console.log(routes);

  return null;
}

export default Index;
