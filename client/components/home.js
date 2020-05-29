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
    // eslint-disable-next-line no-console
    console.log('test')
    axios.patch(`${URL}/${category}/${id}`, { status })
    const updatedStatus = taskList.map((el) => (el.taskId === id ? { ...el, status } : el))
    setTaskList(updatedStatus)
  }

  useEffect(() => {
    axios(`${URL}`).then(({ data }) => setAddCategories(data))
  }, [newCategory])

  useEffect(() => {
    if (typeof category !== 'undefined') {
      axios(`${URL}/${category}`).then(({ data }) => setTaskList(data))
    }
  }, [category])

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
