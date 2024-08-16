import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../style/pages/addcontador.css';
import Navbar from '../components/navbar/Navbar';
import { getPrinters, getLocalizacao, addContadores } from "../services/printerService";
import { getPadroes } from "../services/patternService";
import { toast } from "react-toastify";

const AddContador = () => {
  const [localizacoes, setLocalizacoes] = useState([]);
  const [workstations, setWorkstations] = useState([]);
  const [subworkstations, setSubworkstations] = useState([]);
  const [cidade, setCidade] = useState("");
  const [postoTrabalho, setPostoTrabalho] = useState("");
  const [subpostoTrabalho, setSubpostoTrabalho] = useState("");
  const [equipamentos, setEquipamentos] = useState([]);
  const [equipamentosFiltrados, setEquipamentosFiltrados] = useState([]);
  const [selectedEquipamento, setSelectedEquipamento] = useState("");
  const [quantidadeImpressoesPB, setQuantidadeImpressoesPB] = useState(""); 
  const [quantidadeImpressoesCor, setQuantidadeImpressoesCor] = useState(""); 
  const [dataContador, setdataContador] = useState("");
  const [isColorido, setIsColorido] = useState(false); 

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
          setEquipamentosFiltrados(dataEquipamentos.data);
        }
      } catch (error) {
        console.error('Erro ao obter lista de impressoras:', error);
      }
    };
    fetchLocalizacoes();
    fetchEquipamentos();
  }, []);

  const handleEquipamentoChange = async (equipamentoId) => {
    setSelectedEquipamento(equipamentoId);
    const equipamento = equipamentos.find(e => e.id === parseInt(equipamentoId, 10));
    
    if (equipamento) {
      const response = await getPadroes();
      if (response.type === 'success' && response.data) {
        const padrao = response.data.find(p => p.modelo === equipamento.modeloId);
        if (padrao) {
          setIsColorido(padrao.colorido);
        }
      } else {
        console.error('Erro ao buscar o padrão da impressora:', response.error);
      }
    }
  };

  const handleRegistrar = async () => {
    if (!selectedEquipamento) {
        toast.error("Por favor, selecione um equipamento.");
        return;
    }

    if (!quantidadeImpressoesPB || quantidadeImpressoesPB <= 0) {
        toast.error("Por favor, insira uma quantidade válida de impressões em Preto e Branco.");
        return;
    }

    if (isColorido && (!quantidadeImpressoesCor || quantidadeImpressoesCor < 0)) {
        toast.error("Por favor, insira uma quantidade válida de impressões coloridas.");
        return;
    }

    if (!dataContador) {
      toast.error("Por favor, insira uma data válida.");
      return;
  }

    const contadoresData = {
        id: selectedEquipamento,
        contadorAtualPB: parseInt(quantidadeImpressoesPB, 10),
        contadorAtualCor: isColorido ? parseInt(quantidadeImpressoesCor, 10) : 0,
        dataContador: new Date(dataContador).toISOString()
    };

    console.log("Dados enviados:", contadoresData);

    try {
        const response = await addContadores(contadoresData);
        console.log('Resposta do backend:', response);

        if (response.type === 'success') {
            toast.success("Contador registrado com sucesso!");
            setTimeout(() => {
              navigate(`/visualizarimpressora/${selectedEquipamento}`);
            }, 3000);
        } else {
            console.error('Erro recebido do backend:', response.error);
            toast.error("Erro ao registrar contador: " + (response.error || response.data));
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        toast.error("Erro ao registrar contador: " + error.message);
    }
  };

  const handleCancelar = () => {
    navigate('/impressorascadastradas');
  };

  const handleLocalizacaoChange = (event) => {
    const cidadeSelecionada = event.target.value;
    setCidade(cidadeSelecionada);

    const localizacao = localizacoes.find(m => m.name === cidadeSelecionada);

    setWorkstations(localizacao ? localizacao.workstations : []);

    const filtered = equipamentos.filter((equipamento) => equipamento.localizacao.split(";")[0] === cidadeSelecionada);
    setEquipamentosFiltrados(filtered);
  };

  const handleWorkstationChange = (event) => {
    const workstationSelecionada = event.target.value;
    setPostoTrabalho(workstationSelecionada);
    const workstation = workstations.find(m => m.name === workstationSelecionada);
    setSubworkstations(workstation ? workstation.child_workstations : []);
    const filtered = equipamentosFiltrados.filter((equipamento) => equipamento.localizacao.split(";")[1] === workstationSelecionada);
    setEquipamentosFiltrados(filtered);
  };

  const handleSubWorkstationChange = (event) => {
    const subworkstationSelecionada = event.target.value;
    setSubpostoTrabalho(subworkstationSelecionada);
    const filtered = equipamentosFiltrados.filter((equipamento) => equipamento.localizacao.split(";")[2] === subworkstationSelecionada);
    setEquipamentosFiltrados(filtered);
  };

  return (
    <>
      <Navbar />
      <div className="add-contador-header">
        <h1>Registro de Contadores</h1>
      </div>
      <div className="add-contador-form">
        <div className="localizacao-section">
          <h2>Localização</h2>
          <div className="localizacao-underline"></div>
          <div className="localizacao-fields">
            <div className="campo">
            <label htmlFor="cidade">Cidade</label>
              <select
                id="cidade"
                value={cidade}
                onChange={handleLocalizacaoChange}
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
            <label htmlFor="regional">Regional</label>
              <select
                id="regional"
                value={postoTrabalho}
                onChange={handleWorkstationChange}
              >
                <option value="">Selecione o posto</option>
                {workstations.map((workstation) => (
                  <option key={workstation.id} value={workstation.name}>
                    {workstation.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="campo">
            <label htmlFor="unidade">Unidade</label>
              <select
                id="unidade"
                value={subpostoTrabalho}
                onChange={handleSubWorkstationChange}
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
            <label htmlFor="equipamento"> Equipamento Associado</label>
            <select
              id="equipamento"
              value={selectedEquipamento}
              onChange={(e) => handleEquipamentoChange(e.target.value)}
            >
              <option value="">Número de série</option>
              {equipamentosFiltrados.map((equipamento) => (
                <option key={equipamento.id} value={equipamento.id}>
                  {equipamento.numSerie}
                </option>
              ))}
            </select>
          </div>
          <div className="quantidade-impressao-section">
            <div className="campo quantidade">
            <label htmlFor="contador-pb"> Contador Preto e Branco</label>
              <input
                id="contador-pb"
                type="number" 
                value={quantidadeImpressoesPB} 
                onChange={(e) => setQuantidadeImpressoesPB(e.target.value)} 
                min="0" 
                step="1" 
              />
            </div>
            <div className="campo quantidade">
            <label htmlFor="contador-cor">Contador Colorido</label>
              <input 
                id="contador-cor"
                type="number" 
                value={quantidadeImpressoesCor} 
                onChange={(e) => setQuantidadeImpressoesCor(e.target.value)} 
                min="0" 
                step="1" 
                disabled={!isColorido} 
              />
            </div>
          </div>
          <div className="campo data">
          <label htmlFor="data-contadores">Data do Contador</label>
            <input 
              id="data-contadores"
              type="date"
              value={dataContador}
              onChange={(e) => setdataContador(e.target.value)} 
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
