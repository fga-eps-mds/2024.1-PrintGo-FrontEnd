import React, { useState } from "react";
import { toast } from "react-toastify";
import Navbar from "../navbar/Navbar";
import "../../style/components/contractForm.css";
import { createContract } from "../../services/contractService";
import Dropdown from "../containers/StatusDropdown";

export default function ContractForm() {
  const [numero, setNumero] = useState('');
  const [nomeGestor, setNomeGestor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataInicio, setDataInicio] = useState(new Date(Date.now()).toISOString());
  const [dataFim, setDataFim] = useState(new Date(Date.now()).toISOString());
  const ativo = false


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      numero,
      nomeGestor,
      descricao,
      dataInicio: new Date(dataInicio).toISOString(),
      dataFim: new Date(dataInicio).toISOString(),
      ativo

    };
    console.log("Form data:", formData);

    const response = await createContract(formData);

    if(response.type === "success") {
      toast.success("Contrato criado com sucesso!")
    } else {
      if(response.error.response.status === 400){
        toast.error("Este número de contrato ja existe!")
      }
      else{
        toast.error("Erro ao criar contrato!")
      }
    }
  };

  const navigateToContractListForm = () => {
    window.location = "/listagemContrato"
};

  return (
    <>
      <Navbar />
      <div id="padraoPagina">
        <h1 id="titulo">Cadastro de Contratos</h1>
        <form id="contratos-form">
          <div className="contrato-status">
            <label id="label">
              Contrato
              <input
                id="inputCampos"
                placeholder="Insira o n° do contrato"
                type="text"
                maxLength={50}
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
              ></input>
            </label>
            <Dropdown />
          </div>
          <label id="label">
            Gestor do Contrato
            <input
              id="inputCampos"
              placeholder="Insira o nome do gestor"
              type="text"
              maxLength={255}
              value={nomeGestor}
              onChange={(e) => setNomeGestor(e.target.value)}
            ></input>
          </label>
          <label id="label">
            Descrição do Contrato (Processo)
            <input
              id="inputDescricao"
              placeholder="Insira a descrição do contrato"
              type="text"
              maxLength={255}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            ></input>
          </label>
          <div id="inputData">
            <label id="label">
              Data de Início
              <input
                className="inputDataInicio"
                id="inputCampos"
                placeholder="dd/mm/aaaa"
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              ></input>
            </label>
            <label className="campoDataTermino" id="label">
              Data de Término
              <input
                className="inputDataInicio"
                id="inputCampos"
                placeholder="dd/mm/aaaa"
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
              ></input>
            </label>
          </div>
        </form>
        <div>
          <button
            className="botaoCadastro"
            type="submit"
            onClick={handleSubmit}
          >
            Cadastrar
          </button>
          <button className="botaoAcessarLista" type="button" onClick={navigateToContractListForm}>
            Acessar Lista de Contratos
          </button>
        </div>
      </div>
    </>
  );
}
