import React from 'react'

const Course = ({
  course
}) => {
  return (
    <div>
      <h2>{course.name}</h2>
      <p><b>Koepäivät:</b> {course.exams}</p>
    </div>
  )
}

export default Course
