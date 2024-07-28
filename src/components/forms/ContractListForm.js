import React, { useState, useEffect } from "react";
import Navbar from "../navbar/Navbar";
import ContractBox from "../containers/contractBox.js";
import "../../style/components/contractListForm.css";
import { getContract, switchContractStatus } from "../../services/contractService.js";
import { toast } from "react-toastify";


export default function ContractListForm() {

  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    const fetchContracts= async () => {
      try {
        const response = await getContract();
        console.log(response.data.data)
        if (response.type === 'success') {
          setContracts(response.data.data);
        } else {
          toast.error('Erro ao obter os contratos');
        }
      } catch(error) {
        console.log('Erro ao buscar os contratos:', error);
        toast.error('Erro ao obter os contratos');
      }
    }
    fetchContracts();
  }, []);

  const handleReadClick = (id) => {
    console.log(`Read button clicked for equipment ID: ${id}`);
  };

  const navigateToContractForm = () => {
    window.location = "/cadastrarContrato"
  };

  const handleEditClick = (id) => {
    console.log(`Edit button clicked for equipment ID: ${id}`);
  };

  const handleToggleClick = async (id, numero) => {
    console.log(`Toggle button clicked for equipment ID: ${id}`);
    try {
      const response = await switchContractStatus(id);
      const { ativo } = response.data.data
      if (response.type === 'success') {
        toast.success(`Contrato ${numero} ${ativo ? 'ativado' : 'desativado'}!`)
      } else {
        toast.error('Erro ao obter os contratos');
      }
    } catch(error) {
      console.log('Erro ao buscar os contratos:', error);
      toast.error('Erro ao obter os contratos');
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
          {Array.isArray(contracts) && contracts.map((contract) => (
            <ContractBox
              key={contract.id}
              numero={contract.numero}
              gestor={contract.nomeGestor}
              ativo={contract.ativo}
              onReadClick={() => handleReadClick(contract.id)}
              onEditClick={() => handleEditClick(contract.id)}
              onToggleClick={() => handleToggleClick(contract.id, contract.numero)}
            />
          ))}
        </div>
        <button id="buttonContracts" onClick={navigateToContractForm}>Cadastrar Novo Contrato</button>
      </div>
    </>
  );
}
