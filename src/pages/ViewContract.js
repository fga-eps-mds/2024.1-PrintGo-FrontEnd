import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar/Navbar.js";
import "../style/components/readContractForm.css";
import { useParams, useNavigate } from "react-router-dom";
import { getContractById } from "../services/contractService.js";
import { toast } from "react-toastify";

const ViewContract = () => {
    const { id } = useParams();
    console.log(id)
    const [numero, setNumero] = useState();
    const [nomeGestor, setNomeGestor] = useState();
    const [descricao, setDescricao] = useState();
    const [dataInicio, setDataInicio] = useState();
    const [dataTermino, setDataTermino] = useState();
    const [ativo, setAtivo] = useState();
    const [contract, setContract] = useState({})

    const navigate = useNavigate();
    
    const navigateToEditContractListForm = () => {
      navigate("/editarContrato", { state: { contract } });
    };
    const navigateToContractListForm = () => {
        window.location = "/listagemContrato"
    };

    useEffect(() => {
      const fetchContract = async () => {
        try {
          const response = await getContractById(id);
          if (response.type === "success") {
            setNumero(response.data.numero);
            setNomeGestor(response.data.nomeGestor);
            setDescricao(response.data.descricao);
            setDataInicio(response.data.dataInicio);
            setDataTermino(response.data.dataTermino);
            setAtivo(response.data.ativo);
            setContract(response.data)
          } else {
            toast.error("Erro ao obter o contrato");
          }
        } catch (error) {
          console.log("Erro ao buscar os contratos:", error);
          toast.error("Erro ao buscar o contrato");
        }
      }
      fetchContract();
    }, [id])

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
                                <h3 id="textDateContent" data-testid="data-inicio">{new Date(dataInicio).toLocaleDateString()}</h3>
                            </div>
                            <div className="dateF">
                                <h2 id="titlesContracts">Data de Término:</h2>
                                <h3 id="textDateContent" data-testid="data-termino">{new Date(dataTermino).toLocaleDateString()}</h3>
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

