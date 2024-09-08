import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar/Navbar.js";
import ContractBox from "../components/containers/contractBox.js";
import "../style/pages/contractList.css";
import {
  getContract,
  switchContractStatus,
} from "../services/contractService.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ContractList() {
  const [contracts, setContracts] = useState([]);
  console.log(contracts);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await getContract();
        if (response.type === "success") {
          setContracts(response.data.data);
        } else {
          toast.error("Erro ao obter os contratos");
        }
      } catch (error) {
        console.log("Erro ao buscar os contratos:", error);
        toast.error("Erro ao obter os contratos");
      }
    };
    fetchContracts();
  }, []);

  const handleReadClick = (id) => {
    const url = `/verContrato/${id}`;
    window.location = url;
    console.log(`Read button clicked for equipment ID: ${id}`);
  };

  const navigateToContractForm = () => {
    window.location = "/cadastrarContrato";
  };

  const handleEditClick = (contract) => {
    navigate("/editarContrato", { state: { contract } });
    console.log(`Edit button clicked for equipment ID: ${contract.id}`);
  };

  const handleToggleClick = async (contract) => {
    const { id, numero, dataTermino, ativo } = contract;

    if (!ativo && new Date(dataTermino) < new Date()) {
      toast.error("Contrato vencido, não é possível ativar contrato vencido");
      return
    }
    try {
      setContracts(prevContracts =>
        prevContracts.map(contract =>
          contract.id === id ? { ...contract, ativo: !contract.ativo } : contract
        )
      );
      const response = await switchContractStatus(id);
      const { ativo } = response.data.data;
      console.log(ativo);
      if (response.type === "success") {
        toast.success(
          `Contrato ${numero} ${ativo ? "ativado" : "desativado"}!`
        );
      } else {
        toast.error("Erro ao obter os contratos");
      }
    } catch (error) {
      console.log("Erro ao buscar os contratos:", error);
      toast.error("Erro ao obter os contratos");
    }
  };

  return (
    <>
      <Navbar />
      <div className="mainArea">
        <div className="barraPesquisa">
          <h1 className="titulo">Contratos Disponíveis</h1>
        </div>
        <div className="columnsContract">
          <h2 className="columnLabel">Número do Contrato</h2>
          <h2 className="columnLabel">Gestor</h2>
          <h2 className="columnLabel">Data de Início</h2>
          <h2 className="columnLabel">Data de Fim</h2>
          <div className="columnButtons">
            <h2 className="columnBtn">Visualizar</h2>
            <h2 className="columnBtn">Editar</h2>
            <h2 className="columnBtn">Desativar</h2>
          </div>
        </div>
        <div className="contract-list">
          {Array.isArray(contracts) &&
            contracts.map((contract) => (
              <ContractBox
                key={contract.id}
                numero={contract.numero}
                gestor={contract.nomeGestor}
                ativo={contract.ativo}
                inicio={new Date(contract.dataInicio).toLocaleDateString()}
                fim={new Date(contract.dataTermino).toLocaleDateString()}
                onReadClick={() => handleReadClick(contract.id)}
                onEditClick={() => handleEditClick(contract)}
                onToggleClick={() =>
                  handleToggleClick(contract)
                }
              />
            ))}
        </div>
        <button id="buttonContracts" onClick={navigateToContractForm}>
          Cadastrar Novo Contrato
        </button>
      </div>
    </>
  );
}
