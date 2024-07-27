import React from "react";
import Navbar from "../navbar/Navbar";
import "../../style/components/contractForm.css";

export default function ContractForm(){
  return (
    <>
    <Navbar />
    <div id="padraoPagina">
      <h1 id="titulo">Cadastro de Contratos</h1>
      <form>
        <label id="label">Contrato
          <input id="inputCampos" placeholder="Insira o n° do contrato" type="text" maxLength={50} ></input>
        </label>
        <label id="label">Gestor do Contrato
          <input id="inputCampos" placeholder="Insira o nome do gestor" type="text" maxLength={255}></input>
        </label>
        <label id="label">Descrição do Contrato (Processo)
          <input id="inputDescricao" placeholder="Insira a descrição do contrato" type="text" maxLength={255}></input>
        </label>
        <div id="inputData">
          <label id="label">Data de Início
            <input className="inputDataInicio" id="inputCampos" placeholder="dd/mm/aaaa" type="date"></input>
          </label>
          <label className="campoDataTermino" id="label">Data de Término
            <input className="inputDataInicio" id="inputCampos" placeholder="dd/mm/aaaa" type="date"></input>
          </label>
        </div>
      </form>  
      <div>
        <button className="botaoCadastro">Cadastrar</button>
        <button className="botaoAcessarLista">Acessar Lista de Contratos</button>
      </div> 
    </div>
    </>
  );
}
