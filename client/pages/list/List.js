import React from 'react'
import styles from './index.module.css'

const List = ({i}) => {
  return (
    <div className={styles.List}>
      <p className={styles.ingredient}>{i ? i.i : 'No item provided'}</p>
    </div>
  )
}

export default List;