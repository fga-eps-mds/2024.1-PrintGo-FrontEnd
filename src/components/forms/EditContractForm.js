import React from "react";
import Navbar from "../navbar/Navbar";
import { FontSizeIcon } from "@radix-ui/react-icons";


export default function EditContractForm(){
  return (
    <>
    <Navbar />
    <div>
      <h1>Edição de Contratos</h1>
      <div id="padraoPagina">
        <label>Contrato</label>
        <input placeholder="Insira o n° do contrato"></input>
        <label>Gestor do Contrato</label>
        <input placeholder="Insira o nome do gestor"></input>
        <label>Descrição do Contrato (Processo)</label>
        <input placeholder="Insira a descrição do contrato"></input>
        <label>Data de Início</label>
        <input placeholder="dd/mm/aaaa"></input>
        <label>Data de Término</label>
        <input placeholder="dd/mm/aaaa"></input>
        <div>
          <button>Salvar Mudanças</button>
          <button>Cancelar</button>
        </div> 
      </div>
    </div>
    </>
  );
}
