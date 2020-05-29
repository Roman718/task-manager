import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Route, useParams } from 'react-router-dom'
import Categories from './categories'
import CategoryList from './categoryList'

const URL = '/api/v1/tasks'

const Home = () => {
  const [categories, setAddCategories] = useState([])
  const [taskList, setTaskList] = useState([])
  const [newCategory, setNewCategory] = useState('')
  const [toggleStatus, setToggleStatus] = useState({})
  const { category } = useParams()

  const addCategory = (categoryName) => {
    axios.post(`${URL}/${categoryName}`)
    setNewCategory(categoryName)
  }
  const addTask = (taskName) => {
    axios.post(`${URL}/${category}`, { title: taskName }).then(({ data }) => {
      setTaskList([...taskList, data.newTask])
    })
  }

  const updateStatus = (status, id) => {
    axios.patch(`${URL}/${category}/${id}`, { status })
    setToggleStatus({ id, status })
  }

  useEffect(() => {
    axios(`${URL}`).then(({ data }) => setAddCategories(data))
  }, [newCategory])

  useEffect(() => {
    if (typeof category !== 'undefined') {
      axios(`${URL}/${category}`).then(({ data }) => setTaskList(data))
    }
  }, [category, toggleStatus])

  return (
    <div>
      <Route
        exact
        path="/"
        component={() => <Categories categories={categories} addCategory={addCategory} />}
      />
      <Route
        exact
        path="/:category"
        component={() => (
          <CategoryList taskList={taskList} addTask={addTask} updateStatus={updateStatus} />
        )}
      />
    </div>
  )
}

Home.propTypes = {}

export default Home
