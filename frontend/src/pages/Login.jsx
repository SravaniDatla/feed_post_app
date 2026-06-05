import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleLogin(event) {
    event.preventDefault();

    if (!email || !password) return;

    fetch("https://feed-post-app-z0y4.onrender.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          navigate("/feed");
        } else {
          alert((data && data.message) || "Login failed");
        }
      })
      .catch(() => alert("Network error"));
  }

  return React.createElement(
    'div',
    { className: 'auth-container' },
    React.createElement(
      'form',
      { className: 'auth-card', onSubmit: handleLogin },
      React.createElement('h2', null, 'Login'),
      React.createElement('input', {
        type: 'email',
        placeholder: 'Email',
        value: email,
        onChange: function (e) {
          setEmail(e.target.value);
        },
      }),
      React.createElement('input', {
        type: 'password',
        placeholder: 'Password',
        value: password,
        onChange: function (e) {
          setPassword(e.target.value);
        },
      }),
      React.createElement('button', { type: 'submit' }, 'Login'),
      React.createElement(
        'p',
        null,
        "Don't have an account? ",
        React.createElement(Link, { to: '/signup' }, 'Signup')
      )
    )
  );
}

export default Login;