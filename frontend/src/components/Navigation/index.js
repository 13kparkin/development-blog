import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <>
        <NavLink style={{textDecoration: 'none'}} exact to="/">&lt;DevDomain /&gt;</NavLink>
      {isLoaded && (
          <ProfileButton user={sessionUser} />
      )}
    </>
  );
}

export default Navigation;