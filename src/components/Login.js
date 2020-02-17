import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { BASEBACKENDURL } from '../constants';
import '../css/login.css'

function Login (props) {
    const { register, handleSubmit, errors } = useForm();
    const [valid, setValid] = useState(true);
    const onSubmit = data => {
        handleLogin(data);
    };

    const handleLogin = (loginInfo) => {
        fetch(BASEBACKENDURL + 'login',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                loginInfo
            })
        })
        .then(resp => resp.json())
        .then(data => {
            if (data.user.email) {           // if user has an email go to main page
                let userInfo = {
                    "name": data.user.name, 
                    "email": data.user.email, 
                    "cash": data.user.cash, 
                    "userID": data.user.id, 
                    "stocksWorth": data.stocksWorth,
                    "stocks": data.stocks, 
                }
                props.setUser(userInfo);
                props.history.push('/portfolio');
            }
              else {                      // user has no email so error
                setValid(false);          
            }
        })
    }
    
    return (
        <div className="loginContainer">
          <form className="loginForm" onSubmit={handleSubmit(onSubmit)}>
              <header id="loginHeader">Sign IN</header>
              <input className="loginField" placeholder="email" name="email" ref={register({ required: true })} />
              {errors.email && <p className="loginErrorMessage">email is required</p>}
          
              <input className="loginField" type="password" placeholder="password"name="password" ref={register({ required:true })} />
              {errors.password && <p className="loginErrorMessage">password is required</p>}
              {!valid && <p className="loginErrorMessage">username or password are incorrect</p>}
  
              <input className="loginButton" type="submit" value="Login" />
              <label className="loginSignup">Don't have an account? <Link to="/signup">Sign up now</Link></label>
          </form>
      </div>
    );
}

export default Login; 