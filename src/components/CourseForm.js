import React from 'react'

const CourseForm = ({
  addCourse, handleChange, newName, newExams
}) => {
  return (
    <div>
      <p>Haluaisitko lisätä kurssin?</p>
      <form onSubmit={addCourse}>
        Uusi kurssi: 
        <br />
        nimi <input 
          name='newName'
          type='text' 
          value={newName} 
          onChange={handleChange}
        /> 
        <br />
        koepäivät <input
          name='newExams'
          type='text'
          value={newExams}
          onChange={handleChange}
        />
        <br />
        <button type='submit'>Lisää</button>
      </form>
    </div>
  )
}

export default CourseForm