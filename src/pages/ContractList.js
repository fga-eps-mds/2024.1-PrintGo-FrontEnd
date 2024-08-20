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
    window.location = url
    console.log(`Read button clicked for equipment ID: ${id}`);
  };

  const navigateToContractForm = () => {
    window.location = "/cadastrarContrato";
  };

  const handleEditClick = (contract) => {
    navigate("/editarContrato", { state: { contract } });
    console.log(`Edit button clicked for equipment ID: ${contract.id}`);
  };

  const handleToggleClick = async (id, numero) => {
    console.log(`Toggle button clicked for equipment ID: ${id}`);
    try {
      console.log(`CONTRATOS DPS DO SWITCH: ${contracts}`)
      // Setando o estado do atributo "ativo" apenas do contrato do id referente ao click
      setContracts(prevContracts =>
        prevContracts.map(contract =>
          contract.id === id ? { ...contract, ativo: !contract.ativo } : contract
        )
      );
      const response = await switchContractStatus(id);
      const { ativo } = response.data.data;
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
          <input
            id="searchBar"
            placeholder="Pesquisar Contrato"
            type="text"
            maxLength={50}
          ></input>
        </div>
        <div className="contract-list">
          {Array.isArray(contracts) &&
            contracts.map((contract) => (
              <ContractBox
                key={contract.id}
                numero={contract.numero}
                gestor={contract.nomeGestor}
                ativo={contract.ativo}
                onReadClick={() => handleReadClick(contract.id)}
                onEditClick={() => handleEditClick(contract)}
                onToggleClick={() =>
                  handleToggleClick(contract.id, contract.numero)
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
