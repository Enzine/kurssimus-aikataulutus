import axios from 'axios'

const baseUrl = 'http://localhost:3001/courses'    
//'http://localhost:3001/courses'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = (newCourse) => {
  const request = axios.post(baseUrl, newCourse)
  return request.then(response => response.data)
}

const update = (id, updatedCourse) => {
  const request = axios.put(`${baseUrl}/${id}`, updatedCourse)
  return request.then(response => response.data)
}

const remove = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then(response => response.data)
}

export default { 
  getAll, create, update, remove 
}