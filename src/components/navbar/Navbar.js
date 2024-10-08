import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../style/components/navbar.css";
import logo from "../../assets/logo_navbar.svg";
import LoggedUser from "../../assets/loggeduser.svg";
import { decodeToken } from "react-jwt";

import { FiChevronDown } from "react-icons/fi";

const Navbar = () => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [printerDropdownOpen, setPrinterDropdownOpen] = useState(false);
  const [contractDropdownOpen, setContractDropdownOpen] = useState(false);

  let navigate = useNavigate();

  const isTokenExpired = (decodedToken) =>{
    if (!decodedToken || Date.now() >= decodedToken.exp * 1000) {
      console.log("token expirou")
      return true; // Token expirado
    }
    else {
      return false;
    }
  }

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen)
  }

  const togglePrinterDropdown = () => {
    setPrinterDropdownOpen(!printerDropdownOpen)
  }

  const toggleContractDropdown = () => {
    setContractDropdownOpen(!printerDropdownOpen)
  }

  let user = null;
  const token = localStorage.getItem("jwt");
  if (token) {
    user = decodeToken(token);
    if(isTokenExpired(user)){
      user = null
    } 
  }

  const userLogOut = async (e) => {
    e.preventDefault();
    try{
      localStorage.clear();
      navigate("/");
    }
    catch(error){
      console.log(error)
    }
  }

  return (
    <div className="container-navbar">
      <img alt="" src={logo}></img>

      <div className="button-navbar">
        <button>
          <Link to="/">Home</Link>
        </button>

        { user && (
          <>
            { user.cargos?.includes('ADMIN') && (
              <div className="navbar-users">
                <button className="navbar-users-button" onClick={toggleUserDropdown}>
                  <h4>Usuários</h4> 
                  <FiChevronDown />
                  {userDropdownOpen && (
                    <div className="navbar-users-dropdown">
                      <Link to="/cadastro">Cadastro de usuário</Link>
                      <Link to='/listausuarios'>Usuários cadastrados</Link>
                    </div>
                  )}
                </button>
              </div>
            )}

            <div className="navbar-printers">
              <button className="navbar-printers-button" onClick={togglePrinterDropdown}>
                <h4>Impressoras</h4> 
                <FiChevronDown />
                {printerDropdownOpen && (
                  <div className="navbar-printers-dropdown">
                    <Link to="/cadastroimpressora">Cadastro de impressora</Link>
                    <Link to="/padraoimpressora">Cadastro de padrão de impressora</Link>
                    <Link to="/impressorascadastradas">Impressoras cadastradas</Link>
                    <Link to="/padroescadastrados">Padrões de impressora cadastrados</Link>
                    <Link to="/definirRotina">Rotina de Registro Automático</Link>
                    <Link to="/registrarContadores">Registrar Contadores</Link>
                    <Link to="/dashboard">Dashboard</Link>

                  </div>
                )}
              </button>
            </div>

            <div className="navbar-contracts">
              <button className="navbar-contracts-button" onClick={toggleContractDropdown}>
                <h4>Contratos</h4> 
                <FiChevronDown />
                {contractDropdownOpen && (
                  <div className="navbar-contracts-dropdown">
                    <Link to="/listagemContrato">Lista de Contratos</Link>
                    <Link to="/cadastrarContrato">Cadastrar Contrato</Link>
                  </div>
                )}
              </button>
            </div>

            <div className="navbar-audit">
                <button>
                  <Link to="/auditoria">Auditoria</Link>
                </button>
            </div>
          </>
        )}

      </div>

      { user && (
        <div className="navbar-user-info">
          <div className="navbar-user-message">
            <img alt="loggeduser" src={LoggedUser}/>
            <Link to={`/editarusuario/${user.id}`}>Olá, {user.nome}!</Link>
          </div>
          <Link className="navbar-user-leave" data-testid="navbar-leave-button" onClick={userLogOut}>
            <button>
              Sair
            </button>
          </Link>
        </div>
      )}

      { !user && (
        <div className="navbar-login">
          <Link to="/login" className="button-login-navbar">
            <button>
              <h4>Login</h4>
            </button>
          </Link>
        </div>
      )}

    </div>
  );
};
export default Navbar;
