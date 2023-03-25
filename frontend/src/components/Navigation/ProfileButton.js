import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const [pushedButton, setPushedButton] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (user) {
      setLoggedIn(true);
    }
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu, user]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
  };

  const loggedInonButtonClick = () => {
    setPushedButton(true);
    setTimeout(() => setPushedButton(false), 200);
    openMenu();
  };

  const loggedOutonButtonClick = () => {
    setPushedButton(true);
    setTimeout(() => setPushedButton(false), 100);
    // openMenu();
  };


  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      {loggedIn && (
        <button className={pushedButton ? "pushed" : ""} onClick={loggedInonButtonClick}>
          {user?.profilePicture ? (
            <img className="profile-picture" src={user.profilePicture} alt="Profile" />
          ) : (
            <i className="fas fa-user-circle"></i>
          )}
        </button>
      )}
      {!loggedIn && (
        <button className={pushedButton ? "pushed" : ""} onClick={loggedOutonButtonClick}>
          <OpenModalMenuItem
            itemText="Log In"
            onItemClick={closeMenu}
            modalComponent={<LoginFormModal />}
          />
        </button>
      )}
      
      <div className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            {user.username} <br/>
            {user.firstName} {user.lastName} <br/>
            {user.email} <br/>
            
              <button onClick={logout}>Log Out</button>
            
          </>
        ) : (
          <>
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </>
        )}
      </div>
    </>
  );
}

export default ProfileButton;