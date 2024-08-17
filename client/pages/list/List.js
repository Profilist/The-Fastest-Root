import React from 'react'
import styles from './index.module.css'

export const List = ({i}) => {
  return (
    <div className={styles.List}>
      <p className={styles.ingredient}>{i.i}</p>
    </div>
  )
}