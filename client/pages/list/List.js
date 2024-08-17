import React from 'react'

export const List = ({i}) => {
  return (
    <div className="List">
      <p className = "ingredient">{i.i}</p>
    </div>
  )
}