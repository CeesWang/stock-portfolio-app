import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { BASEBACKENDURL, STARTCASH } from '../constants';
import '../css/register.css';
function Register(props) {
  const { register, handleSubmit, errors, watch } = useForm();  // initialize form hook
  const [valid, setValid] = useState(true);                     // valid hook

  const onSubmit = data => {
    handleUser(data); 
  };

  const handleUser = (userInfo) => {
    delete userInfo.confirmPassword;
    userInfo["cash"] = STARTCASH;
    
    fetch(BASEBACKENDURL + "signup", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        userInfo
      })
    })
    .then(resp => resp.json())
    .then(user => {
      if (user.email) {           // if user has an email go to main page
        props.history.push('/')
      }
      else {                      // user has no email so error
        setValid(false);          
      }
    })    
  }

  return (
      <div className="registerContainer">
        <form className="registerForm" onSubmit={handleSubmit(onSubmit)}>
            <header id="registerHeader">Register</header>
            <input className="registerField" placeholder="name" name="name" ref={register({ required: true})}/>
            {errors.name && <p className="registerErrorMessage">name is required</p>}
            
            <input className="registerField" placeholder="email" type="email" name="email" ref={register({ required: true })} />
            {errors.email && <p className="registerErrorMessage">email is required</p>}
            {!valid && <p className="registerErrorMessage">email is already been taken</p>}
        
            <input className="registerField" type="password" placeholder="password"name="password" ref={register({ required:true })} />
            {errors.password && <p className="registerErrorMessage">password is required</p>}
        
            <input className="registerField" type="password" placeholder="confirm password" name="confirmPassword" ref={register({
                required: true,
                validate: password => password === watch('password')
            })} />
            {errors.confirmPassword && errors.confirmPassword.type === "required" && <p className="registerErrorMessage">confirm password is required</p>}
            {errors.confirmPassword && errors.confirmPassword.type === "validate" && <p className="registerErrorMessage">passwords do not match</p>}

            <input className="registerButton" type="submit" value="Sign UP" />
        </form>
    </div>
  );
}

export default Register;