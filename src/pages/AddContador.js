import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/pages/addcontador.css';
import Navbar from '../components/navbar/Navbar';
import { getPrinters, getLocalizacao, addContadores } from "../services/printerService";
import { getPadroes } from "../services/patternService";
import { toast } from "react-toastify";
import SelectContainer from '../components/containers/SelectContainer';
import DateContainer from '../components/containers/DateContainer';
import NumberContainer from '../components/containers/NumberContainer';

const AddContador = () => {
  const [cities, setCities] = useState([]);
  const [workstations, setWorkstations] = useState([]);
  const [subworkstations, setSubworkstations] = useState([]);
  const [cidade, setCidade] = useState("");
  const [postoTrabalho, setPostoTrabalho] = useState("");
  const [subpostoTrabalho, setSubpostoTrabalho] = useState("");
  const [equipamentos, setEquipamentos] = useState([]);
  const [equipamentosFiltrados, setEquipamentosFiltrados] = useState([]);
  const [selectedNumSerie, setSelectedNumSerie] = useState("");
  const [selectedEquipamentoId, setSelectedEquipamentoId] = useState(0);
  const [quantidadeImpressoesPB, setQuantidadeImpressoesPB] = useState(0);
  const [quantidadeImpressoesCor, setQuantidadeImpressoesCor] = useState(0);
  const [dataContador, setDataContador] = useState("");
  const [isColorido, setIsColorido] = useState(false);

  const navigate = useNavigate();

  const filterByCidade = (selectedCity) => {

    const city = cities.find(m => m.name === selectedCity);

    setWorkstations(city ? city.workstations : []);

    const filtered = selectedCity ? equipamentos.filter((equipamento) => equipamento.localizacao.split(";")[0] === selectedCity) : equipamentos;
    setEquipamentosFiltrados(filtered);
  }

  const filterByPosto = (selectedWorkstation) => {

    const workstation = workstations.find(m => m.name === selectedWorkstation);
    setSubworkstations(workstation ? workstation.child_workstations : []);

    const filtered = selectedWorkstation ? equipamentosFiltrados.filter((equipamento) => equipamento.localizacao.split(";")[1] === selectedWorkstation) : equipamentos;
    setEquipamentosFiltrados(filtered);
  }

  const filterBySubposto = (selectedSubWorkstation) => {
    const filtered = selectedSubWorkstation ? equipamentosFiltrados.filter((equipamento) => equipamento.localizacao.split(";")[2] === selectedSubWorkstation) : equipamentos;
    setEquipamentosFiltrados(filtered);
  }

  useEffect(() => {
    const fetchLocalizacoes = async () => {
      try {
        const response = await getLocalizacao();

        if (response.type === 'error'){
          toast.error("Erro ao buscar localizações!")
        }
        else {
          setCities(response.data);
        }
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
        else{
          toast.error("Erro ao buscar impressoras!")
        }
      } catch (error) {
        console.error('Erro ao obter lista de impressoras:', error);
      }
    };

    fetchLocalizacoes();
    fetchEquipamentos();
  }, []);

  const handleEquipamentoChange = async (event) => {
    const numSerie = event.target.value

    setSelectedNumSerie(numSerie)

    const equipamento = equipamentos.find(e => e.numSerie === numSerie);

    if (equipamento) {
      setSelectedEquipamentoId(equipamento.id);
      const response = await getPadroes();
      if (response.type === 'success' && response.data) {
        const padrao = response.data.find(p => p.id === Number(equipamento.modeloId));
        if (padrao) {
          setIsColorido(padrao.colorido);
        }
      } else {
        console.error('Erro ao buscar o padrão da impressora:', response.error);
      }
    }
  };

  const handleRegistrar = async () => {
    if (!selectedNumSerie) {
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
      id: selectedEquipamentoId,
      contadorAtualPB: parseInt(quantidadeImpressoesPB, 10),
      contadorAtualCor: isColorido ? parseInt(quantidadeImpressoesCor, 10) : 0,
      dataContador: new Date(dataContador).toISOString(),
    };

    try {
      const response = await addContadores(contadoresData);

      if (response.type === 'success') {
        toast.success("Contador registrado com sucesso!");
        setTimeout(() => {
          navigate(`/visualizarimpressora/${selectedEquipamentoId}`);
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
    setSelectedNumSerie("")
    setSelectedEquipamentoId(0);
    setPostoTrabalho("");
    setSubpostoTrabalho("");
    setWorkstations([])
    setSubworkstations([]);

    filterByCidade(cidadeSelecionada)
  };

  const handleWorkstationChange = (event) => {
    const workstationSelecionada = event.target.value;
    
    setPostoTrabalho(workstationSelecionada);
    setSubworkstations([]);
    setSubpostoTrabalho("");

    if (workstationSelecionada === "") {
      filterByCidade(cidade)
    }
    else{
      filterByPosto(workstationSelecionada)
    }
  };

  const handleSubWorkstationChange = (event) => {
    const subworkstationSelecionada = event.target.value;

    setSubpostoTrabalho(subworkstationSelecionada);

    filterBySubposto(subworkstationSelecionada);
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
            <SelectContainer
              id="cidade-contador"
              name="cidade-contador"
              className={"md-select"}
              options={cities ? cities.map((localizacao) => localizacao.name) : []}
              label="Cidade"
              value={cidade}
              onChange={handleLocalizacaoChange}
            />
            <SelectContainer
              id="regional-contador"
              name="regional-contador"
              className={"md-select"}
              options={workstations ? workstations.map((workstation) => workstation.name) : []}
              label="Regional"
              value={postoTrabalho}
              onChange={handleWorkstationChange}
            />
            <SelectContainer
              id="unidade-contador"
              name="unidade-contador"
              className={"md-select"}
              options={subworkstations ? subworkstations.map((subworkstation) => subworkstation.name) : []}
              label="Unidade"
              value={subpostoTrabalho}
              onChange={handleSubWorkstationChange}
            />
          </div>
        </div>
        <div className="fields-underline"></div>
        <div className="contadores-section">
          <SelectContainer
            id="equipamento"
            name="equipamento"
            className={"md-select"}
            options={equipamentosFiltrados ? equipamentosFiltrados.map((equipamento) => equipamento.numSerie) : []}
            label="Equipamento Associado"
            value={selectedNumSerie}
            onChange={handleEquipamentoChange}
          />
          <div className="quantidade-impressao-section">
            <div className="campo quantidade">
              <NumberContainer
                id="contador-pb-manual"
                name="contador-pb-manual"
                label="Contador Preto e Branco"
                value={quantidadeImpressoesPB}
                onChange={(e) => setQuantidadeImpressoesPB(Number(e.target.value))}
              />
            </div>
            <div className="campo quantidade">
              <NumberContainer
                id="contador-cor-manual"
                name="contador-cor-manual"
                label="Contador Colorido"
                value={quantidadeImpressoesCor}
                onChange={(e) => setQuantidadeImpressoesCor(Number(e.target.value))}
                disabled={!isColorido}
              />
            </div>
          </div>
          <div className="campo data">
            <DateContainer
              label="Data do Contador"
              value={dataContador}
              onChange={(e) => setDataContador(e.target.value)}
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
