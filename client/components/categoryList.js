import React, { useState } from 'react'
import Head from './head'
import TaskItem from './taskItem'

const CategoryList = (props) => {
  const [newTask, setNewTask] = useState('')

  return (
    <div>
      <Head title="Hello" />
      <div className="flex items-center justify-center h-screen">
        <div className="bg-indigo-800 text-white font-bold rounded-lg border shadow-lg p-10">
          <ul>
            {props.taskList.map((el) => (
              <li key={el.taskId}>
                <TaskItem
                  taskId={el.taskId}
                  title={el.title}
                  status={el.status}
                  updateTitle={props.updateTitle}
                  updateStatus={props.updateStatus}
                />
              </li>
            ))}
          </ul>
          <input
            type="text"
            className="text-black"
            onChange={(e) => setNewTask(e.target.value)}
            value={newTask}
            placeholder="Add new task"
          />
          <button type="button" onClick={() => props.addTask(newTask)}>
            Go
          </button>
        </div>
      </div>
    </div>
  )
}

CategoryList.propTypes = {}

export default React.memo(CategoryList)
