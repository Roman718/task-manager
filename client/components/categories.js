import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Head from './head'

const Categories = (props) => {
  const [newCategory, setNewCategory] = useState('')
  return (
    <div>
      <Head title="Hello" />
      <div className="flex items-center justify-center h-screen">
        <div className="bg-indigo-800 text-white font-bold rounded-lg border shadow-lg p-10">
          <ul>
            {props.categories.map((el) => (
              <li key={el}>
                <Link to={`/${el}`}>{el}</Link>
              </li>
            ))}
          </ul>
          <input
            type="text"
            className="text-black"
            onChange={(e) => setNewCategory(e.target.value)}
            value={newCategory}
          />
          <button type="button" onClick={() => props.addCategory(newCategory)}>
            GO
          </button>
        </div>
      </div>
    </div>
  )
}

Categories.propTypes = {}

export default React.memo(Categories)
