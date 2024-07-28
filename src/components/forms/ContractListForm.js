import React from "react";
import Navbar from "../navbar/Navbar";
/*import { FontSizeIcon } from "@radix-ui/react-icons";
import ReactDOM from 'react-dom/client';*/
import ContractBox from "../containers/contractBox.js";
import "../../style/components/contractListForm.css";


  const mockEquipmentList = [
    { id: 1, label: "09/2001 SSP", gestor: "João Augusto" },
    { id: 2, label: "10/2010 SSP", gestor: "Fabio Donato" }, 
    { id: 3, label: "15/2012 SSP", gestor: "Jennifer Loba" }, 
    { id: 4, label: "87/2013 SSP", gestor: "Gomes Neto" }, 
    { id: 5, label: "12/2015 SSP", gestor: "Daniel Peixe" },
];

const ContractListForm = () => {
    const handleReadClick = (id) => {
      console.log(`Read button clicked for equipment ID: ${id}`);
    };

    const handleEditClick = (id) => {
        console.log(`Edit button clicked for equipment ID: ${id}`);
    };

    const handleToggleClick = (id) => {
        console.log(`Toggle button clicked for equipment ID: ${id}`);
    };

    return (
      <>
        <Navbar />
        <div className="mainArea">
          <div className="barraPesquisa">
            <h1 className="titulo">Contratos Disponíveis</h1>
            <input id="searchBar" placeholder="Pesquisar Contrato" type="text" maxLength={50}></input>
          </div>
          <div className="equipment-list">
              {mockEquipmentList.map((equipment) => (
                  <ContractBox
                      key={equipment.id}
                      label={equipment.label}
                      gestor={equipment.gestor}
                      onReadClick={() => handleReadClick(equipment.id)}
                      onEditClick={() => handleEditClick(equipment.id)}
                      onToggleClick={() => handleToggleClick(equipment.id)}
                  />
              ))}
          </div>
          <button id="buttonContracts">Cadastrar Novo Contrato</button>   
        </div>
      </>
    );
};

export default ContractListForm;
