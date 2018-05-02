import React from 'react'
import Notification from './Notification'
import CourseForm from './CourseForm'
import Course from './Course'
import courseService from '../services/courses'

class Courses extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      newName: '',
      newExams: '',
      notification: null,
      courses: [],
      coursesToShow: []
    }
  }

  notify = (message, type = 'info') => {
    this.setState({
      notification: { message, type }
    })
    setTimeout(() => {
      this.setState({
        notification: null
      })
    }, 10000)
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
      .catch(exception => {
        this.notify('Kurssien haku palvelimelta epäonnistui', 'error')
        console.log('got exception while fetching courses from server', exception)
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
      courseService
        .create(courseObject)
        .then(newCourse => {
          this.setState({ courses: this.state.courses.concat(newCourse) })
          this.notify(`Kurssi '${newCourse.name}' lisättiin kurssilistaan`)
        })
        .catch(exception => {
          this.notify('Uutta kurssia ei voitu lisätä', 'error')
          console.log('Got an exception while adding a new course', exception)
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
      this.notify(`Found no course with id ${id}.`, 'error')
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
        this.notify(`Kurssin '${course.name}' muuttaminen onnistui`)
      })
      .catch(exception => {
        this.notify(`Ei voitu muuttaa kurssia ${course}`, 'error')
        console.log('Got an exception while updating a course', exception)
      })
  }

  removeCourse = (id) => {
    const course = this.state.courses.find(course => course.id === id)
    if (!course) {
      this.notify(`Found no course with id ${id}.`, 'error')
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
          this.notify(`Kurssi '${course.name}' poistettiin onnistuneesti.`)
        })
        .catch(exception => {
          this.notify('Kurssia ei voitu poistaa', 'error')
          console.log('Got an exception while removing a course', exception)
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

    return (
      <div>
        <Notification notification={this.state.notification} />
        <h2>Tervetuloa tsekkaamaan kursseja!</h2>

        <CourseForm
          addCourse={this.addCourse}
          handleChange={this.handleChange}
          newName={this.state.newName}
          newExams={this.state.newExams}
        />
        {this.state.coursesToShow.length === 1 &&
          <div>
            <Course course={this.state.coursesToShow[0]} />
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

export default Courses
