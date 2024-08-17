import React, {useState} from 'react'
import styles from './index.module.css'

export const ListInput = ({addItem}) => {
  const [value,setValue] = useState("")

  const handleSubmit = e => {
    e.preventDefault()
    addItem(value)
    setValue("")
  }
  return (
    <form className={styles.ListInput} onSubmit={handleSubmit}>
        <input type="text" className={styles.input} value = {value} placeholder="Add an item..." onChange={(e) => setValue(e.target.value)} ></input>
    </form>
  )
}