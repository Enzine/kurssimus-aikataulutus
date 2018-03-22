const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

const url = 'mongodb://<dbuser>:<dbpassword>@ds121299.mlab.com:21299/kurssimus-aikataulutus'

mongoose.connect(url)
app.use(bodyParser.json())
app.use(cors())

let courses = [
  {
    id: 1,
    name: 'Kurssi'
  },
  {
    id: 2,
    name: 'Kurssi tämäkin'
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello world</h1>')
})

app.get('/courses', (request, response) => {
  response.json(courses)
})

app.get('/courses/:id', (request, response) => {
  const course = courses.find(course => course.id === Number(request.params.id))
  if (course) {
    response.json(course)
  } else {
    response.status(404).end()
  }
})

app.post('/courses/', (request, response) => {
  const newCourse = request.body
  console.log(request.body)
  courses = courses.concat(newCourse)
  response.status(200).json(newCourse)
})

app.delete('/courses/:id', (request, response) => {
  const removableCourse = courses.find(course => course.id === Number(request.params.id))
    courses = courses.filter(course => course.id !== Number(request.params.id))
    response.status(204).end() //204: no content
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})