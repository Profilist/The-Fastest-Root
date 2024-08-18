import React, { useState } from "react";
import { ListInput } from "./ListInput";
import { List } from "./List";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import Loading from "./Loading";
import { Popup } from "./Popup";

uuidv4();

export const ListWrapper = () => {
  const [items, setItems] = useState([]);
  const [costcoChecked, setCostcoChecked] = useState(false);
  const [storeNumber, setStoreNumber] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const maxItems = 8;

  const handleOpenPopup = () => setIsPopupOpen(true);
  const handleClosePopup = () => setIsPopupOpen(false);

  const addItem = item => {
    const newItem = { id: uuidv4(), i: item, completed: false, isEditing: false };
    if (items.length < maxItems) {
      setItems([...items, newItem])
      console.log(items)
    }

    setHistory([...history, newItem]);

    console.log('Current items:', items);
    console.log('All items added:', history);
  }

  const handleRoute = async () => {
    setLoading(true);
    try {
      console.log("fetching prices");
      let maxStores = storeNumber;
      if (!maxStores || isNaN(parseInt(maxStores))) {
        maxStores = 4;
      }

      const response = await fetch(
        `http://localhost:8080/api/scrap?items=${items
          .map((item) => item.i)
          .join(",")}&maxStores=${storeNumber}`
      );
      const data = await response.json();
      console.log(data);

      router.push({
        pathname: "/route",
        query: {
          costcoChecked: costcoChecked ? "true" : "false",
          storeNumber: maxStores.toString(),
          data: JSON.stringify(data),
        },
      });
    } catch (error) {
      console.error("Error fetching prices:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.listWrapperContainer}>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className={styles.terrain} />
          <div className={styles.content}>
            <div className={styles.filterOptions}></div>
            <ListInput addItem={addItem}></ListInput>
            <div className={styles.filterOptions}>
              <label className={styles.costcoLabel}>Costco</label>
              <input
                type="checkbox"
                className={styles.filterCheckbox}
                checked={costcoChecked}
                onChange={(e) => setCostcoChecked(e.target.checked)}
              />
              <label className={styles.storeLabel}>Max # of Stores</label>
              <input
                type="number"
                className={styles.filterCheckbox}
                value={storeNumber}
                onChange={(e) => setStoreNumber(e.target.value)}
              />
            </div>
            {items.map((item, index) => (
              <List i={item} key={index} />
            ))}
            <button className={styles.view} onClick={handleOpenPopup}>View All</button>
            <Popup isOpen={isPopupOpen} history={history} onClose={handleClosePopup} />
            <button className={styles.button} onClick={handleRoute}>
              Find Route
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ListWrapper;
