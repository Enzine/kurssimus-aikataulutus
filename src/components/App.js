import React from 'react'
import axios from 'axios'
import CourseForm from './CourseForm'
import Course from './Course'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      newName: '',
      newExams: '',
      courses: []
    }
  }

  componentDidMount() {
    axios
      .get('http://localhost:3001/courses')
      .then(response => {
        this.setState({ courses: response.data })
      })
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  addCourse = (event) => {
    event.preventDefault()
    const courseObject = {
      id: this.state.courses.length + 1,
      name: this.state.newName,
      exams: this.state.newExams
    }

    if (this.state.courses.find(course => course.name === this.state.newName)) {
      console.log(`the name '${this.state.newName}' is already taken`)
    } else {
      console.log('kurssia ei ole vielä. voit luoda uuden.')
      axios
        .post('http://localhost:3001/courses', courseObject)
        .then(response => {
          console.log(response.data)
          this.setState({ courses: this.state.courses.concat(response.data) })
        })
        .catch(exception => {
          console.log('virhe kurssia lisättäessä', exception)
        })
    }
    this.setState({ 
      newName: '',
      newExams: ''
    })
  }

  removeCourse = (id) => {
    const course = this.state.courses.find(course => course.id === id)
    if (!course) {
      console.log(`Found no course with id ${id}.`)
      return
    }
    const ok = window.confirm(`Poistetaanko kurssi: ${course.name}?`)
    if (!ok) {
      return
    } else {
      console.log(course)
      axios
        .delete(`http://localhost:3001/courses/${course.id}`)
        .then(response => {
          this.setState({ 
            courses: this.state.courses.filter(person => person.id !== id)
          })
          console.log(`Kurssi ${course.name} poistettiin onnistuneesti.`)
        })
    }
  }
 
  render() {
    const list = 
    (
      <ul>
        {this.state.courses.map(course => 
          <li key={course.name}>
            {course.name} <button type='delete' onClick={() => this.removeCourse(course.id)}>delete</button>
          </li>
        )}
      </ul>
    )
    return (
      <div>
        <h2>Tervetuloa!</h2>
        <CourseForm 
          addCourse={this.addCourse}
          handleChange={this.handleChange}
          newName={this.state.newName}
          newExams={this.state.newExams}
        />
        {this.state.courses.length == 1 &&
          <Course course={this.state.courses[0]}/> 
        }
        {this.state.courses.length != 1 &&
          list
        }
        
      </div>
    )
  }
}

export default App
