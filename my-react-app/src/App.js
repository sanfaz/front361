// src/App.js
import React from 'react';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage.js';
import './App.css';
import About from './About.js';
import Driver from './Driver.js';
import Auction from './Auction.js';
import AdminPage from './AdminPage.js';
import Contact from './Contact.js';
import AdminVehiclePage from './AdminVehiclePage.js';
import { useState } from 'react';
import AdminRoutePage from './AdminRoutePage.js';
import AdminAuctionPage from './AdminAuctionPage.js';
import FuelerPage from './Fueler.js';
import MaintenancePage from './Maintanance.js';
import Reports from './Reports.js';

function App() {
  
  return (
    <Router>

      <div className="App">
        <Navbar />
        <Routes>
          <Route exact path="/" element={<MainContent />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<MainContent />} />
          <Route path="/about" element={<About />} />
          <Route path="/auction" element={<Auction />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/driver/:userId" element={<Driver />} />
          <Route path="/adminVehicles" element={<AdminVehiclePage />} />
          <Route path="/adminRoutes" element={<AdminRoutePage/>}/>
          <Route path="/adminAuctions" element={<AdminAuctionPage/>}/>
          <Route path="/fueler/:userId" element={<FuelerPage/>}/>
          <Route path="/maintainer/:userId" element={<MaintenancePage/>}/>
          <Route path="/Reports" element={<Reports />} />
          
        </Routes>
      </div>
    </Router>
  );
}
function Navbar() {
  return (
    <nav className="navbar">
      <div className="vms-logo">VMS</div>
      <ul>
        <li><a href="/services">Services</a></li>
        <li><a href="/about">About Us</a></li>
        <li><a href="/contact">Contact</a></li>
        <li><a href="/auction">Auction</a></li>
        <li><a href="/login">Login</a></li>
      </ul>
    </nav>
  );
}


function MainContent() {
  const [searchResults, setSearchResults] = useState([]);
  const [isTableVisible, setIsTableVisible] = useState(false);

  const handleSearch = (results) => {
    setSearchResults(results);
    setIsTableVisible(true); // Show the table after search

  };
  return (
    <div>
      <AppointmentForm />
      <>
      <SearchForm onSearch={handleSearch} />
        {isTableVisible && (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Surname</th>
                <th>Username</th>
                <th>Role</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.surname}</td>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                  <td>{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </>

    </div>
  );
}

function AppointmentForm() {
  const [appointment, setAppointment] = useState({
    to: '',
    from: '',
    departure_date: '',
    departure_time: '', 
    capacity: 0,
    comments: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppointment((prevAppointment) => ({
      ...prevAppointment,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://plankton-app-b4yn3.ondigitalocean.app/appointment/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointment),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Appointment saved', data);
        setAppointment({
          point_a: '',
          point_b: '',
          departure_date: '',
          departure_time: '',
          capacity: 0,
          comments: '',
        });
      } else {
        console.error('Failed to save appointment', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting form', error);
    }
  };

  return (
    
    <div>
      <div class="intro">
        <h1>Welcome to Vehicle Management System</h1>
        <p> comprehensive software solution designed for the purpose of managing vehicle fleets efficiently</p>
      </div>
      <h2>Make an Appointment</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="point_a">To:</label>
          <input type="text" id="point_a" name="point_a" value={appointment.point_a} required onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="point_b">From:</label>
          <input type="text" id="point_b" name="point_b" value={appointment.point_b} required onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="departure_date">Date:</label>
          <input type="date" id="departure_date" name="departure_date" value={appointment.departure_date} required onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="departure_time">Time:</label>
          <input type="time" id="departure_time" name="departure_time" min="09:00" max="18:00" value={appointment.departure_time} required onChange={handleChange}/>
        </div>

        <div className="form-group">
          <label htmlFor="capacity">Capacity:</label>
          <input type="number" id="capacity" name="capacity" value={appointment.capacity} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="comments">Comments:</label>
          <input type="text" id="comments" name="comments" value={appointment.comments} onChange={handleChange} />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};



function SearchForm({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  }
  

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetch(`https://plankton-app-b4yn3.ondigitalocean.app/users/name/${searchQuery}`)
      .then((response) => response.json())
      .then((data) => {
        onSearch(data);
      })
      .catch((error) => {
        console.error('Error searching for users:', error);
      });
  };

  return (
    <div class="search">
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
}
export default App;
