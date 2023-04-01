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
  const [pushedArticlePage, setPushedArticlePage] = useState(false);
  const [pushedLogout, setPushedLogout] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [profilePushed, setProfilePushed] = useState(false);
  const [loggedInPushed, setLoggedInPushed] = useState(false);
  const [signupPushed, setSignupPushed] = useState(false);
  const history = useHistory();
  const admin = (user.username === "13kparkin")


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
    } else {
      setLoggedIn(false);
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
    setLoggedIn(false);
    closeMenu();
  };


  const loggedOutonButtonClick = (e) => {
    setPushedLogout(true);
    setTimeout(() => setPushedLogout(false), 200);
    logout(e);
  };

  const handleNewArticle = () => {
    setPushedArticlePage(true);
    setTimeout(() => setPushedArticlePage(false), 200);
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
          <div className="profile-dropdown-container">
            <div className="profile-dropdown-name">
            {user.firstName} {user.lastName} <br/>
            <div className="profile-dropdown-username">@{user.username}</div>
           
            </div>
            {admin && (
            <div className={pushedArticlePage ? "profile-dropdown-create-article-pushed" : "profile-dropdown-create-article"}>
            <button onClick={handleNewArticle}>Create Article</button>
            </div>
            )}
            <div className={pushedLogout ? "profile-dropdown-logout-pushed" : "profile-dropdown-logout"}>
            <button onClick={loggedOutonButtonClick}>Log Out</button>
            </div>
          </div>
            
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