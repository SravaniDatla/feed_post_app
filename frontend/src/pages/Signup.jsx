import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  function handleSubmit(event) {
    event.preventDefault();

    fetch("https://feed-post-app-z0y4.onrender.com/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: user.username,
        email: user.email,
        password: user.password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          navigate("/feed");
        } else {
          alert((data && data.message) || "Signup failed");
        }
      })
      .catch(() => alert("Network error"));
  }

  return React.createElement(
    'div',
    { className: 'auth-container' },
    React.createElement(
      'form',
      { className: 'auth-card', onSubmit: handleSubmit },
      React.createElement('h2', null, 'Signup'),
      React.createElement('input', {
        type: 'text',
        placeholder: 'Username',
        onChange: function (e) {
          setUser({ username: e.target.value, email: user.email, password: user.password });
        },
      }),
      React.createElement('input', {
        type: 'email',
        placeholder: 'Email',
        onChange: function (e) {
          setUser({ username: user.username, email: e.target.value, password: user.password });
        },
      }),
      React.createElement('input', {
        type: 'password',
        placeholder: 'Password',
        onChange: function (e) {
          setUser({ username: user.username, email: user.email, password: e.target.value });
        },
      }),
      React.createElement('button', { type: 'submit' }, 'Signup'),
      React.createElement(
        'p',
        null,
        'Already have an account? ',
        React.createElement(Link, { to: '/' }, 'Login')
      )
    )
  );
}

export default Signup;