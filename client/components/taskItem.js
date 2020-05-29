import React, { useState } from 'react'

const TaskItem = (props) => {
  const [editMode, setEditMode] = useState(false)
  return (
    <div className="inline">
      {editMode ? (
        <span>
          <button
            type="button"
            className="bg-gray-700"
            onClick={() => props.updateTitle('новое название', props.taskId)}
          >
            Save
          </button>
          <input type="text" />
        </span>
      ) : (
        <span>
          <button type="button" className="bg-gray-700" onClick={() => setEditMode(true)}>
            Edit
          </button>
          <span className="inline">{props.title}</span>
        </span>
      )}
      {props.status === 'new' ? (
        <button
          type="button"
          className="bg-gray-700"
          onClick={() => props.updateStatus('in progress', props.taskId)}
        >
          In progress
        </button>
      ) : (
        ''
      )}
      {props.status === 'in progress' ? (
        <div className="inline">
          <button
            type="button"
            className="bg-gray-700 mr-5"
            onClick={() => props.updateStatus('blocked', props.taskId)}
          >
            block
          </button>
          <button
            type="button"
            className="bg-gray-700"
            onClick={() => props.updateStatus('done', props.taskId)}
          >
            done
          </button>
        </div>
      ) : (
        ''
      )}
      {props.status === 'blocked' ? (
        <button
          type="button"
          className="bg-gray-700 mr-5"
          onClick={() => props.updateStatus('new', props.taskId)}
        >
          block
        </button>
      ) : (
        ''
      )}
    </div>
  )
}

TaskItem.propTypes = {}

export default React.memo(TaskItem)
