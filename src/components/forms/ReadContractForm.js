import React from "react";
import Navbar from "../navbar/Navbar.js";
import "../../style/components/readContractForm.css";

const mockContract = [
    { id: 1, numero: "09/2001 SSP", nomeGestor: "João Augusto", descricao: "Impressoras laser mono." , dataInicio: "01/01/2024", dataTermino: "28/07/2024"},
];

const ReadContractForm = () => {
    const navigateToEditContractListForm = () => {
        window.location = "/editarContrato"
    };
    const navigateToContractListForm = () => {
        window.location = "/listagemContrato"
    };

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
                            <h3 id="textContent">09/2001 SSP</h3>
                        </div>
                        <div className="gestorContract">
                            <h2 id="titlesContracts">Gestor do Contrato</h2>
                            <h3 id="textContent">João Augusto</h3>
                        </div>
                    </div>
                    <div className="datesContracts">
                        <div className="dateC">
                            <div className="dateI">
                                <h2 id="titlesContracts">Data de Início:</h2>
                                <h3 id="textDateContent">01/01/2024</h3>
                            </div>
                            <div className="dateF">
                                <h2 id="titlesContracts">Data de Término:</h2>
                                <h3 id="textDateContent">31/12/2027</h3>
                            </div>
                        </div>
                        <div className="statusContract">
                            <h2 id="titlesContracts">Status</h2>
                            <h3 id="textContent">Ativo</h3>
                        </div>
                    </div>
                </div>
                <div className="descContract">
                    <h2 id="titlesContracts">Descrição do Contrato (Processo)</h2>
                    <h3 id="textContent">Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing and typesetting industry</h3>
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

export default ReadContractForm;

