import React, { useState } from 'react'
import Head from './head'

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
                {el.title}
                {el.status === 'new' ? (
                  <button
                    type="button"
                    className="bg-gray-700"
                    onClick={() => props.updateStatus('in progress', el.taskId)}
                  >
                    In progress
                  </button>
                ) : (
                  ''
                )}
                {el.status === 'in progress' ? (
                  <div>
                    <button
                      type="button"
                      className="bg-gray-700 mr-5"
                      onClick={() => props.updateStatus('blocked', el.taskId)}
                    >
                      block
                    </button>
                    <button
                      type="button"
                      className="bg-gray-700"
                      onClick={() => props.updateStatus('done', el.taskId)}
                    >
                      done
                    </button>
                  </div>
                ) : (
                  ''
                )}
                {el.status === 'blocked' ? (
                  <button
                    type="button"
                    className="bg-gray-700 mr-5"
                    onClick={() => props.updateStatus('new', el.taskId)}
                  >
                    block
                  </button>
                ) : (
                  ''
                )}
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
