import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Feed from "./pages/Feed";
import "./App.css";

function App() {
  return React.createElement(
    BrowserRouter,
    null,
    React.createElement(
      Routes,
      null,
      React.createElement(Route, { path: "/", element: React.createElement(Login, null) }),
      React.createElement(Route, { path: "/signup", element: React.createElement(Signup, null) }),
      React.createElement(Route, { path: "/feed", element: React.createElement(Feed, null) })
    )
  );
}

export default App;