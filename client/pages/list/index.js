import React, {useState} from 'react'
import { ListInput } from './ListInput'
import { List } from './List'
import { v4 as uuidv4} from 'uuid'

uuidv4();

export const ListWrapper = () => {
  const[items,  setItems] = useState([])

  const addItem = item => {
    setItems([...items, {id: uuidv4(), i : item, completed: false, isEditing: false}])
    console.log(items)
  }
  return (
    <div className="ListWrapper">
      <div className="FilterOptions">
  </div>
        <ListInput addItem={addItem}></ListInput>
        <div className="FilterOptions">
          <label>Costco</label>
          <input type="checkbox" className="filter-checkbox"/>
          <label>Store #</label>
          <input type="number" className="filter-checkbox"/>
        </div>
        {items.map((item, index) => (
          <List i={item} key={index} />
        ))}
        <button className="Button">Find Route</button>
    </div>
  )
}

export default ListWrapper; 