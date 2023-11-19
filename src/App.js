import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateUserPage from "./pages/CreateUser";
import Login from "./pages/Login";
import Contact from "./pages/Contact";
import AboutUs from "./pages/AboutUs";
import ChangePassword from "./pages/ChangePassword";
import PatternList from "./pages/PatternList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro" element={<CreateUserPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contato" element={<Contact />} />
        <Route path="/quemsomos" element={<AboutUs />} />
        <Route path="/mudarsenha" element={<ChangePassword />} />
        <Route path="/listapadroes" element={<PatternList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
