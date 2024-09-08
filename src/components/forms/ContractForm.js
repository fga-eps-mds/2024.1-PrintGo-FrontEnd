import React, { useState } from "react";
import { toast } from "react-toastify";
import Navbar from "../navbar/Navbar";
import "../../style/components/contractForm.css";
import { createContract } from "../../services/contractService";
import StatusDropdown from "../containers/StatusDropdown";

export default function ContractForm() {
  const [numero, setNumero] = useState("");
  const [nomeGestor, setNomeGestor] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataInicio, setDataInicio] = useState('');
  const [dataTermino, setdataTermino] = useState('');
  const [ativo, setAtivo] = useState(true);

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

    const isValid = validateForm();
    if (!isValid) {
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
    console.log("Form data:", formData);

    const response = await createContract(formData);

    try {
      if (response.type === "success") {
        toast.success("Contrato criado com sucesso!");
        setTimeout(() => {
          const url = `/verContrato/${response.data.data.id}`;
          window.location = url;
        }, 3000);
      } else {
        if (response.error.status === 400) {
          toast.error("Este número de contrato ja existe!");
        } else {
          toast.error("Erro ao criar contrato!");
        }
      }
    } catch (error) {
      console.log("Erro ao buscar os contratos:", error);
      toast.error("Erro ao obter os contratos");
    }
  };

  const navigateToContractList = () => {
    window.location = "/listagemContrato";
  };

  const handleStatus = (e) => {
    const status = e.target.value;
    if (status === "ativo") {
      setAtivo(true);
    } else if (status === "inativo") {
      setAtivo(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="padraoPagina">
        <div className="topBar">
          <h1 id="tituloCad">Cadastro de Contrato</h1>
        </div>
        <div className="formularioCad">
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
              <StatusDropdown
                onChange={handleStatus}
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
                  id="inputCampoDatas"
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
                  id="inputCampoDatas"
                  placeholder="dd/mm/aaaa"
                  type="date"
                  value={dataTermino}
                  onChange={(e) => setdataTermino(e.target.value)}
                ></input>
              </label>
            </div>
          </form>
        </div>
        <div className="buttonAreaCad">
          <button id="botaoCadastro" type="submit" onClick={handleSubmit}>
            Cadastrar
          </button>
          <button
            className="botaoAcessarLista"
            type="button"
            onClick={navigateToContractList}
          >
            Acessar Lista de Contratos
          </button>
        </div>
      </div>
    </>
  );
}
