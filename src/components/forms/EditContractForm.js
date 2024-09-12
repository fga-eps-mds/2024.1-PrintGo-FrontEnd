import React, { useState } from "react";
import { toast } from "react-toastify";
import Navbar from "../navbar/Navbar";
import "../../style/components/editContractForm.css";
import { editContract } from "../../services/contractService";
import { useLocation } from "react-router-dom";
import StatusDropdown from "../containers/StatusDropdown";
import formatDate from "../../utils/formatDate";

export default function EditContractForm() {
  const location = useLocation();
  const { contract } = location.state;
  const [numero, setNumero] = useState(contract.numero);
  const [nomeGestor, setNomeGestor] = useState(contract.nomeGestor);
  const [descricao, setDescricao] = useState(contract.descricao);
  const [dataInicio, setDataInicio] = useState(contract.dataInicio);
  const [dataTermino, setDataTermino] = useState(contract.dataTermino);
  const [ativo, setAtivo] = useState(contract.ativo);

  const handleNumberChange = (e) => {
    setNumero(e.target.value);
  };

  const handleNomeGestorChange = (e) => {
    e.preventDefault();
    setNomeGestor(e.target.value);
  };

  const handleDescricaoChange = (e) => {
    e.preventDefault();
    setDescricao(e.target.value);
  };

  const handleDataInicioChange = (e) => {
    e.preventDefault();
    setDataInicio(e.target.value);
  };

  const handleDataTerminoChange = (e) => {
    e.preventDefault();
    setDataTermino(e.target.value);
  };

  const navigateToContractList = () => {
    window.location = "/listagemContrato";
  };

  const handleStatus = (e) => {
    if (e.target.value === "ativo") {
      setAtivo(true);
    } else if (e.target.value === "inativo") {
      setAtivo(false);
    }
  };

  const validateForm = () => {
    let isValid = true;
  
    if (!numero || numero.trim() === '') {
      toast.error("O número do contrato é obrigatório");
      isValid = false;
    }
    if (!nomeGestor || nomeGestor.trim() === '') {
      toast.error("O nome do gestor é obrigatório");
      isValid = false;
    }
    if (!descricao || descricao.trim() === '') {
      toast.error("A descrição é obrigatória");
      isValid = false;
    }
    if (!dataInicio) {
      toast.error("A data de início é obrigatória");
      isValid = false;
    }
    if (!dataTermino) {
      toast.error("A data de término é obrigatória");
      isValid = false;
    }
    if (new Date(dataTermino) < new Date(dataInicio)) {
      toast.error("A data de término não pode ser anterior à data de início");
      isValid = false;
    }
  
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    
    const formData = {
      numero,
      nomeGestor,
      descricao,
      dataInicio: new Date(dataInicio).toISOString(),
      dataTermino: new Date(dataTermino).toISOString(),
      ativo,
    };

    if (
      new Date(dataTermino).getTime() < new Date(Date.now()).getTime() &&
      formData.ativo
    ) {
      toast.error("Você esta ativando um contrato com a data vencida!");
    } else {
      const response = await editContract(contract.id, formData);

      if (response.type === "success") {
        toast.success("Contrato editado com sucesso!");
        setTimeout(() => {
          window.location = "listagemContrato";
        }, 1000);
      } else {
        console.log(response.error);
        toast.error("Erro ao editar contrato!");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div id="padraoPagina">
        <h1 id="titulo">Edição de Contrato</h1>
        <form id="contratos-form" data-testid="contract-form">
          <div className="ContratoStatus">
            <label id="label">
              Contrato
              <input
                id="inputCampos"
                type="text"
                maxLength={50}
                value={numero}
                onChange={handleNumberChange}
              ></input>
            </label>
            <StatusDropdown
              onChange={handleStatus}
              initialValue={ativo ? "ativo" : "inativo"}
              useSelecione={false}
            />
          </div>
          <label id="label">
            Gestor do Contrato
            <input
              id="inputCampos"
              placeholder="Insira o nome do gestor"
              type="text"
              maxLength={255}
              value={nomeGestor}
              onChange={handleNomeGestorChange}
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
              onChange={handleDescricaoChange}
            ></input>
          </label>
          <div id="inputData">
            <label id="label">
              Data de Início
              <input
                className="inputDataInicio"
                id="inputCampos"
                type="date"
                value={formatDate(dataInicio)}
                onChange={handleDataInicioChange}
              ></input>
            </label>
            <label className="campoDataTermino" id="label">
              Data de Término
              <input
                className="inputDataInicio"
                id="inputCampos"
                type="date"
                value={formatDate(dataTermino)}
                onChange={handleDataTerminoChange}
              ></input>
            </label>
          </div>
        </form>
        <div>
          <button className="botaoSalvar" type="submit" onClick={handleSubmit} data-testid="save-button">
            Salvar Mudanças
          </button>
          <button
            className="botaoCancelar"
            type="button"
            onClick={navigateToContractList}
          >
            Cancelar
          </button>
        </div>
      </div>
    </>
  );
}
