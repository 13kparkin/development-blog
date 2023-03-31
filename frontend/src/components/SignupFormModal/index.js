import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(password, confirmPassword)

    
   
    if (!email.includes('@') || !email.includes('.')) {
      setErrors([...errors,'Email must be a valid email address']);

    }

    if (password.length < 6) {
      setErrors([...errors, 'Password must be at least 6 characters long']);

    }

    if (username.length < 4) {
      setErrors([...errors, 'Username must be at least 4 characters long']);

    }
    if (username.length < 2) {
      setErrors([...errors, 'username must be at least 2 characters long']);

    } 
    if (password !== confirmPassword) {
      setErrors([...errors, 'Confirm Password field must be the same as the Password field']);
    }
    
    else {
      setErrors([]);
      return dispatch(sessionActions.signup({ email, username, firstName, lastName, password }))
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        });
    }

    

    
  };

  return (
    <>
    <div className="signup-form-container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div className="signup-form-errors">
          {errors.map((error, idx) => <div className="signup-form-errors" key={idx}>{error}</div>)}
        </div>
        <label className="signup-form-email">
        <div className="signup-form-email-text"> Email </div>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="signup-form-username">
        <div className="signup-form-username-text"> Username </div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label className="signup-form-first-name">
        <div className="first-name-text"> First Name </div>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        <label className="signup-form-last-name">
        <div className="last-name-text"> Last Name </div>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        <label className="signup-form-password">
        <div className="signup-form-passord-text"> Password </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <label className="signup-form-confirm-password">
        <div className="confirm-password-text"> Confrim Password </div>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Sign Up</button>
      </form>
      </div>
      
    </>
  );
}

export default SignupFormModal;