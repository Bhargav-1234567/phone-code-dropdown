import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import useApiCall from "./hooks/useApiCall";
import CountryDropdown from "./components/CountryDropdown";
import Form from "./components/Form";

function App() {
  return (
    <div className="App">
      <Form />
    </div>
  );
}

export default App;
