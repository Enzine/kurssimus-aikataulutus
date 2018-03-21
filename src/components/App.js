import React from 'react'
import CourseForm from './CourseForm'
import Course from './Course'
import courseService from '../services/courses'
import Notification from './Notification'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      newName: '',
      newExams: '',
      error: null,
      courses: [],
      coursesToShow: []
    }
  }

  componentDidMount() {
    courseService
      .getAll()
      .then(courses => {
        this.setState({ 
          courses,
          coursesToShow: courses
        })
      })
      .catch(error => {
        this.setState({ error: 'Kurssien haku palvelimelta epäonnistui'})
        setTimeout(() => {
          this.setState({ error: null })
        }, 5000)
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

    const oldCourse = this.state.courses.find(course => course.name === this.state.newName)

    if (oldCourse) {
      this.updateCourse(oldCourse.id)
    } else {
      console.log('kurssia ei ole vielä. voit luoda uuden.')
      courseService
        .create(courseObject)
        .then(newCourse => {
          this.setState({ courses: this.state.courses.concat(newCourse) })
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

  updateCourse = (id) => {
    const course = this.state.courses.find(course => course.id === id)
    if (!course) {
      console.log(`Found no course with id ${id}.`)
      return
    }
    const ok = window.confirm(`Olet päivittämässä vanhaa kurssia. Hyväksy painamalla 'ok'.`)
    if (!ok) {
      return
    }
    const courseToUpdate = ({
      id: course.id,
      name: course.name,
      exams: this.state.newExams
    })
    courseService
      .update(id, courseToUpdate)
      .then(updatedCourse => {
        this.setState({
          courses: this.state.courses.map(c => c.id !== course.id ? c : this.updateCourse),
        })
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
      courseService
        .remove(id)
        .then(removedCourse => {
          this.setState({ 
            courses: this.state.courses.filter(person => person.id !== id)
          })
          console.log(`Kurssi '${course.name}' poistettiin onnistuneesti.`)
        })
    }
  }
  
  showOnlyOne = (courseObject) => {
    this.setState({
      coursesToShow: this.state.courses.filter(course => course.id === courseObject.id)
    })
  }
 
  showAll = () => {
    this.setState({
      coursesToShow: this.state.courses
    })
  }

  render() {
    const list = 
    (
      <ul>
        {this.state.courses.map(course => 
          <li key={course.id}>
            <p onClick={() => this.showOnlyOne(course)}>{course.name}</p> 
            <button type='delete' onClick={() => this.removeCourse(course.id)}>poista</button>
          </li>
        )}
      </ul>
    )
    console.log('app.js ', this.state.error, typeof this.state.error)
    return (
      <div>
        <Notification message={this.state.error}/>
        <h2>Tervetuloa!</h2>
        <CourseForm 
          addCourse={this.addCourse}
          handleChange={this.handleChange}
          newName={this.state.newName}
          newExams={this.state.newExams}
        />
        {this.state.coursesToShow.length === 1 &&
          <div>
            <Course course={this.state.coursesToShow[0]}/>
            <p onClick={() => this.showAll()}>Näytä kaikki kurssit</p> 
          </div>
        }
        {this.state.coursesToShow.length !== 1 &&
          list
        }
      </div>
    )
  }
}

export default App
