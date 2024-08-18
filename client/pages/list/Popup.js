import React from 'react';
import styles from './Popup.module.css';

const Popup = ({ isOpen, history, onClose }) => {
  if (!isOpen) return null;

  const itemsList = history.map(item => item.i).join(', ');

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <button className={styles.closeButton} onClick={onClose}>✓</button>
        <h2>Your Shopping List</h2>
        <p>{itemsList}</p>
      </div>
    </div>
  );
};

export default Popup;