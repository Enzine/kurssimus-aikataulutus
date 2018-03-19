import React from 'react'

const Course = ({
  course
}) => {
  return (
    <div>
      <h2>{course.name}</h2>
      <b>Koepäivät:</b> {course.exams}
    </div>
  )
}

export default Course
