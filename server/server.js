/* eslint-disable import/no-duplicates */
import express from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import sockjs from 'sockjs'
import shortid from 'shortid'

import cookieParser from 'cookie-parser'
import Html from '../client/html'

let connections = []

const port = process.env.PORT || 8080
const server = express()
const { readdirSync } = require('fs')
const { readFile, writeFile } = require('fs').promises

server.use(cors())

server.use(express.static(path.resolve(__dirname, '../dist/assets')))
server.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))
server.use(bodyParser.json({ limit: '50mb', extended: true }))

server.use(cookieParser())

const wrFile = async (category, newTasks) => {
  await writeFile(`${__dirname}/tasks/${category}.json`, JSON.stringify(newTasks), {
    encoding: 'utf8'
  })
}

const rFile = (category) => {
  return readFile(`${__dirname}/tasks/${category}.json`, { encoding: 'utf8' })
    .then((data) => {
      return JSON.parse(data)
    })
    .catch(() => [])
}

const getData = (tasks) => {
  return tasks.reduce((acc, rec) => {
    // eslint-disable-next-line no-underscore-dangle
    if (rec._isDeleted) {
      return acc
    }
    return [...acc, { taskId: rec.taskId, title: rec.title, status: rec.status }]
  }, [])
}

server.get('/api/v1/tasks', async (req, res) => {
  const taskList = await readdirSync(`${__dirname}/tasks/`).map((el) => el.split('.json')[0])
  res.send(taskList)
})

server.get('/api/v1/tasks/:category', async (req, res) => {
  const { category } = req.params
  const tasks = getData(await rFile(category))
  res.json(tasks)
})

// server.get('/api/v1/tasks/', async (req, res) => {
//
//   res.send(categories)
// })

server.get('/api/v1/tasks/:category/:timespan', async (req, res) => {
  const { category, timespan } = req.params
  const periodOfTime = {
    day: 1000 * 60 * 60 * 24,
    week: 7 * 1000 * 60 * 60 * 24,
    month: 30 * 1000 * 60 * 60 * 24
  }
  const tasks = await rFile(category)
  const filteredTasks = getData(
    // eslint-disable-next-line no-underscore-dangle
    tasks.filter((el) => el._createdAt + periodOfTime[timespan] > +new Date())
  )
  res.json(filteredTasks)
})

server.post('/api/v1/tasks/:category', async (req, res) => {
  const { category } = req.params
  if (Object.keys(req.body).length === 0) {
    const newTask = []
    await wrFile(category, newTask)
    res.json({ status: 'category added', newTask })
  } else {
    const tasks = await rFile(category)
    const newTask = {
      taskId: shortid.generate(),
      title: req.body.title,
      status: 'new',
      _isDeleted: false,
      _createdAt: +new Date(),
      _deletedAt: null
    }
    const newTasks = [...tasks, newTask]
    await wrFile(category, newTasks)
    res.json({ status: 'success', newTask })
  }
})

server.patch('/api/v1/tasks/:category/:id', async (req, res) => {
  const { category, id } = req.params
  const statuses = ['done', 'new', 'in progress', 'blocked']
  if (!statuses.includes(req.body.status)) {
    res.status(501)
    res.json({ status: 'error', message: 'incorrect status' })
  } else {
    const tasks = await rFile(category)
    const updateTask = tasks.map((el) => (el.taskId === id ? { ...el, ...req.body } : el))
    await wrFile(category, updateTask)
    res.json({ status: 'update successfully' })
  }
})

server.delete('/api/v1/tasks/:category/:id', async (req, res) => {
  const { category, id } = req.params
  const tasks = await rFile(category)
  const deleteTasks = tasks.map((el) => {
    return el.taskId === id ? { ...el, _isDeleted: true, _deletedAt: +new Date() } : el
  })
  await wrFile(category, deleteTasks)
  res.json({ status: 'Delete successfully' })
})

server.use('/api/', (req, res) => {
  res.status(404)
  res.end()
})

const echo = sockjs.createServer()
echo.on('connection', (conn) => {
  connections.push(conn)
  conn.on('data', async () => {})

  conn.on('close', () => {
    connections = connections.filter((c) => c.readyState !== 3)
  })
})

server.get('/', (req, res) => {
  // const body = renderToString(<Root />);
  const title = 'Server side Rendering'
  res.send(
    Html({
      body: '',
      title
    })
  )
})

server.get('/*', (req, res) => {
  const initialState = {
    location: req.url
  }

  return res.send(
    Html({
      body: '',
      initialState
    })
  )
})

const app = server.listen(port)

echo.installHandlers(app, { prefix: '/ws' })

// eslint-disable-next-line no-console
console.log(`Serving at http://localhost:${port}`)
