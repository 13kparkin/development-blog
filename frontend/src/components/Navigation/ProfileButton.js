import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { useHistory } from 'react-router-dom';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const [pushedButton, setPushedButton] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [profilePushed, setProfilePushed] = useState(false);
  const [loggedInPushed, setLoggedInPushed] = useState(false);
  const [signupPushed, setSignupPushed] = useState(false);
  const history = useHistory();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  const handleProfilePushed = (id) => {
    setProfilePushed(true);
    setTimeout(() => setProfilePushed(false), 200);
    openMenu();
  };

  const handleLoggedInPushed = (id) => {
    setLoggedInPushed(true);
    setTimeout(() => setLoggedInPushed(false), 200);
  };

  const handleSignupPushed = (id) => {
    setSignupPushed(true);
    setTimeout(() => setSignupPushed(false), 200);
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
    setLoggedIn(false);
    setTimeout(() => setPushedButton(false), 100);
    // openMenu();
  };

  const handleNewArticle = () => {
    history.push('/posts/new');
  }

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      {loggedIn && (
        <button className={profilePushed ? "profilePushed" : "profile"} onClick={handleProfilePushed}>
          {user?.profilePicture ? (
            <img className="profile-picture" src={user.profilePicture} alt="Profile" />
          ) : (
            <i className="fas fa-user-circle"></i>
          )}
        </button>
      )}
      {!loggedIn && (
        <>
        <button className={loggedInPushed ? "loggedInPushed" : "log-in"} onClick={handleLoggedInPushed}>
          <OpenModalMenuItem
            itemText="Log In"
            onItemClick={closeMenu}
            modalComponent={<LoginFormModal />}
          />
        </button>
        <button className={signupPushed ? "signupPushed" : "sign-up"} onClick={handleSignupPushed}>
          <OpenModalMenuItem
            itemText="Sign Up"
            onItemClick={closeMenu}
            modalComponent={<SignupFormModal />}
          />
        </button>
        </>
      )}
      
      <div className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            {user.username} <br/>
            {user.firstName} {user.lastName} <br/>
            {user.email} <br/>
            <button onClick={handleNewArticle}>New Article</button>
            
            <button onClick={logout}>Log Out</button>
            
          </>
        ) : (
          <>
            
          </>
        )}
      </div>
    </>
  );
}

export default ProfileButton;