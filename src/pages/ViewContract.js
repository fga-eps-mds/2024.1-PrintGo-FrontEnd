import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar/Navbar.js";
import "../style/components/readContractForm.css";
import { useParams } from "react-router-dom";

/* const mockContract = [
    { id: 1, numero: "09/2001 SSP", nomeGestor: "João Augusto", descricao: "Impressoras laser mono." , dataInicio: "01/01/2024", dataTermino: "28/07/2024"},
]; */

const ViewContract = () => {
    const { contrato } = useParams();
    const [numero, setNumero] = useState();
    const [nomeGestor, setNomeGestor] = useState();
    const [descricao, setDescricao] = useState();
    const [dataInicio, setDataInicio] = useState();
    const [dataTermino, setDataTermino] = useState();
    const [ativo, setAtivo] = useState();
    
    const navigateToEditContractListForm = () => {
        window.location = "/editarContrato"
    };
    const navigateToContractListForm = () => {
        window.location = "/listagemContrato"
    };

    useEffect(() => {
      try {
        const contractString = atob(contrato);
        const contractObject = JSON.parse(contractString);
        console.log(contractObject)
        setNumero(contractObject.numero)
        setNomeGestor(contractObject.nomeGestor)
        setDescricao(contractObject.descricao)
        setDataInicio(contractObject.dataInicio)
        setDataTermino(contractObject.dataTermino)
        setAtivo(contractObject.ativo)
      } catch (error) {
        console.error("Error decoding Base64 string", error);
      }
    }, [contrato])

    return (
      <>
        <Navbar />
        <div className="mainAreaContract">
            <div className="titleBarContract">
                <h1 id="tituloContract">Visualização de Contrato</h1>
            </div>
            <div className="content">
                <div className="specsContract">
                    <div className="namesContracts">
                        <div className="numberContract">
                            <h2 id="titlesContracts">Contrato</h2>
                            <h3 id="textContent">{numero}</h3>
                        </div>
                        <div className="gestorContract">
                            <h2 id="titlesContracts">Gestor do Contrato</h2>
                            <h3 id="textContent">{nomeGestor}</h3>
                        </div>
                    </div>
                    <div className="datesContracts">
                        <div className="dateC">
                            <div className="dateI">
                                <h2 id="titlesContracts">Data de Início:</h2>
                                <h3 id="textDateContent">{new Date(dataInicio).toLocaleDateString()}</h3>
                            </div>
                            <div className="dateF">
                                <h2 id="titlesContracts">Data de Término:</h2>
                                <h3 id="textDateContent">{new Date(dataTermino).toLocaleDateString()}</h3>
                            </div>
                        </div>
                        <div className="statusContract">
                            <h2 id="titlesContracts">Status</h2>
                            <h3 id="textContent">{ativo ? "Ativo" : "Inativo"}</h3>
                        </div>
                    </div>
                </div>
                <div className="descContract">
                    <h2 id="titlesContracts">Descrição do Contrato (Processo)</h2>
                    <h3 id="textContent">{descricao}</h3>
                </div>
            </div>
            <div className="divButtons">
                <button id="buttonListContracts" onClick={navigateToContractListForm}>Voltar</button>
                <button id="buttonEditContract" onClick={navigateToEditContractListForm}>Editar</button>                    
            </div>
        </div>
      </>
    );
};

export default ViewContract;

