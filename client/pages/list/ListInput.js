import React, {useState} from 'react'

export const ListInput = ({addItem}) => {
  const [value,setValue] = useState("")

  const handleSubmit = e => {
    e.preventDefault()
    addItem(value)
    setValue("")
  }
  return (
    <form className="ListInput" onSubmit={handleSubmit}>
        <input type="text" className="input" value = {value} placeholder="Add an item..." onChange={(e) => setValue(e.target.value)} ></input>
    </form>
  )
}