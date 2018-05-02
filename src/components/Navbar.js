import React from 'react'
import { BrowserRouter, Route, Link } from 'react-router-dom'
import Home from './Home'
import Courses from './Courses'
import Profile from './Profile'
import '../navbar.css'

class Navbar extends React.Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <div>
            <div className='navbar'>
              <Link to="/">Etusivu</Link> &nbsp;
              <Link to="/courses">Kurssit</Link> &nbsp;
              <Link to="/profile">Profiili</Link>
            </div>
            <Route exact path="/" render={() => <Home />} />
            <Route path="/courses" render={() => <Courses />} />
            <Route path="/profile" render={() => <Profile />} />
          </div>
        </BrowserRouter>
      </div>
    )
  }
}

export default Navbar