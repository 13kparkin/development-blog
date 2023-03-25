import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className="nav-container">
      <NavLink className="nav-logo" style={{ textDecoration: 'none' }} exact to="/">
        &lt;DevDomain /&gt;
      </NavLink>
      {isLoaded && (
        <>
          {/* <div className="fas fa-bars menu-icon" onClick={() => {
            const dropdown = document.querySelector('.profile-dropdown');
            dropdown.classList.toggle('responsive'); */}
          {/* }}></div> */} 
          <ProfileButton user={sessionUser} />
        </>
      )}
    </div>
  );
}

export default Navigation;

// todo: make 3 lines when the screen is small