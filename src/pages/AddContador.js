import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../style/pages/addcontador.css';
import Navbar from '../components/navbar/Navbar';
import { getPrinters, getLocalizacao } from "../services/printerService";
import { toast } from "react-toastify";

const AddContador = () => {
  const [localizacoes, setLocalizacoes] = useState([]);
  const [workstations, setWorkstations] = useState([]);
  const [subworkstations, setSubworkstations] = useState([]);
  const [cidade, setCidade] = useState("");
  const [postoTrabalho, setPostoTrabalho] = useState("");
  const [subpostoTrabalho, setSubpostoTrabalho] = useState("");
  const [equipamentos, setEquipamentos] = useState([]); 
  const [selectedEquipamento, setSelectedEquipamento] = useState("")
  const [quantidadeImpressoes, setQuantidadeImpressoes] = useState(""); 
  const [data, setData] = useState(""); 

  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchLocalizacoes = async () => {
      try {
          const response = await getLocalizacao();
          setLocalizacoes(response.data);
      } catch (error) {
          console.error('Erro ao buscar localizações:', error);
      }
    };

    const fetchEquipamentos = async () => {
      try {
        const [dataEquipamentos] = await Promise.all([
            getPrinters()
        ]) 
        if (dataEquipamentos.type ==='success' && dataEquipamentos.data) {
          setEquipamentos(dataEquipamentos.data);
          console.log(dataEquipamentos.data);
        }
      } catch (error) {
        console.error('Erro ao obter lista de impressoras:', error);
      }
    };
    fetchLocalizacoes();
    fetchEquipamentos();
  }, []);

  const handleRegistrar = () => {
    navigate('/visualizarimpressora/:id');
  };

  const handleCancelar = () => {
    navigate('/impressorascadastradas');
  };

  const handleLocalizacaoChange = (event) => {
    const cidadeSelecionada = event.target.value;
    setCidade(cidadeSelecionada);

    console.log(cidade)

    const localizacao = localizacoes.find(m => m.name === cidadeSelecionada);
    setWorkstations(localizacao ? localizacao.workstations : []);
    setSubworkstations([]); 
};

const handleWorkstationChange = (event) => {
  const workstationSelecionada = event.target.value;
  setPostoTrabalho(workstationSelecionada);

  const subworkstations = workstations.find(m => m.name === workstationSelecionada);
  setSubworkstations(subworkstations ? subworkstations.child_workstations : []);
};

const handleSubWorkstationChange = (event) => {
  const workstationSelecionada = event.target.value;
  setSubpostoTrabalho(workstationSelecionada);
};

  return (
    <>
      <Navbar />
      <div className="add-contador-header">
        <h1>Registro de Impressões</h1>
      </div>
      <div className="add-contador-form">
        <div className="localizacao-section">
          <h2>Localização</h2>
          <div className="localizacao-underline"></div>
          <div className="localizacao-fields">
            <div className="campo">
              <label>Cidade</label>
              <select
                value={cidade}
                onChange={(e) => handleLocalizacaoChange(e)}
              >
                <option value="">Selecione a cidade</option>
                {localizacoes.map((localizacao) => (
                  <option key={localizacao.id} value={localizacao.name}>
                    {localizacao.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="campo">
              <label>Posto de Trabalho</label>
              <select
                value={postoTrabalho}
                onChange={(e) => handleWorkstationChange(e)}
              >
                <option value="">Selecione o posto</option>
                {workstations.map((workstation) => (
                  <option key={workstation.id} value={workstation.id}>
                    {workstation.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="campo">
              <label>Subposto de Trabalho</label>
              <select
                value={subpostoTrabalho}
                onChange={(e) => handleSubWorkstationChange(e)}
              >
                <option value="">Selecione o subposto</option>
                {subworkstations.map((subworkstation) => (
                  <option key={subworkstation.id} value={subworkstation.name}>
                    {subworkstation.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="fields-underline"></div>
          <div className="campo equipamentos">
            <label>Equipamento Associado</label>
              <select
                value={selectedEquipamento}
                onChange={(e) => setSelectedEquipamento(e.target.value)}
              >
                <option value="">Número de série</option>
                {equipamentos.map((equipamento) => (
                  <option key={equipamento.id} value={equipamento.id}>
                    {equipamento.numSerie}
                  </option>
                ))}
              </select>
          </div>
          <div className="campo quantidade">
            <label>Quantidade de Impressões</label>
            <input 
              type="number" 
              value={quantidadeImpressoes} 
              onChange={(e) => setQuantidadeImpressoes(e.target.value)} 
              min="0" // Define o valor mínimo
              step="1" // Define o incremento de 1 em 1
            />
          </div>
          <div className="campo data">
            <label>Data</label>
            <input 
              type="date" 
              value={data} 
              onChange={(e) => setData(e.target.value)} 
            />
          </div>
        </div>
        <div className="botoes">
          <button className="registrar" onClick={handleRegistrar}>Registrar</button>
          <button className="cancelar" onClick={handleCancelar}>Cancelar</button>
        </div>
      </div>
    </>
  );
};

export default AddContador;
