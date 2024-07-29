import React, {useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../style/pages/viewPrinter.css';
import "../../style/components/registerPrinterForms.css";
import Navbar from "../navbar/Navbar";
import ViewDataContainer from '../containers/ViewDataContainer.js';
import SmallInfoCard from '../cards/SmallInfoCard.js';
import BigInfoCard from '../cards/BigInfoCard.js';
import Button from '../Button.js';
import { getPrinterById } from '../../services/printerService.js';
import InputContainer from '../containers/InputContainer.js';
import SelectContainer from '../containers/SelectContainer.js';
import { getLocalizacao } from "../../services/printerService";
import DateContainer from '../containers/DateContainer.js';

// Mock de dados da impressora
const mockPrinterData = {
  equipamento: "Impressora XYZ",
  numeroSerie: "123456789",
  modelo: "Modelo ABC",
  localizacao: "Goias",
  contrato: "Contrato XYZ-123",
  enderecoIp: "192.168.0.1",
  dentroDaRede: "Sim",
  dataInstalacao: "2023-01-15",
  dataRetirada: "2024-01-15",
  status: "Ativo",
  marca: "Marca ABC",
  cidade: "Cidade XYZ",
  regional: "Regional 1",
  subestacao: "Subestação A"
};

// Função para codificar um objeto em Base64
function encodeToBase64(obj) {
  return btoa(JSON.stringify(obj));
}

// Codificar os dados da impressora
const encodedPrinterData = encodeToBase64(mockPrinterData);

console.log(encodedPrinterData); // A string codificada para usar na URL

export default function EditPrinterForm() {

  const [printerData, setPrinterData] = useState({
    numContrato: '',
    numSerie: '',
    enderecoIp: '',
    estaNaRede: false,
    dataInstalacao: '',
    dataRetirada: null,
    ativo: false,
    contadorInstalacaoPB: 0,
    contadorInstalacaoCor: 0,
    contadorAtualPB: 0,
    contadorAtualCor: 0,
    contadorRetiradaPB: 0,
    contadorRetiradaCor: 0,
    localizacao: '',
    modeloId: '',
    cidade: '',
    regional: '',
    subestacao: ''
});
const [numSerie, setNumSerie] = useState('');
const [selectedContrato, setSelectedContrato] = useState('');
const [localizacoes, setLocalizacoes] = useState([]);
const [marcas, setMarcas] = useState([]);
const [contratos, setContratos] = useState([]);
const [enderecoIP, setEnderecoIP] = useState('');
const [selectedDentroRede, setSelectedDentroRede] = useState('Sim');
const yesNo = ["Sim", "Não"];
const [dataInstalacao, setDataInstalacao] = useState('');
const [status, setStatus] = useState('Ativo');
const [selectedCidade, setSelectedCidade] = useState('');
const [workstations, setWorkstations] = useState([]);
const [selectedWorkstation, setSelectedWorkstation] = useState('');
const [subWorkstations, setSubWorkstations] = useState([]);
const [selectedSubWorkstation, setSelectedSubWorkstation] = useState('');

const {id} = useParams()

useEffect(() => {
  const fetchLocalizacoes = async () => {
      try {
          const response = await getLocalizacao();
          setLocalizacoes(response.data);
      } catch (error) {
          console.error('Erro ao buscar localizações:', error);
      }
  };

  const fetchMarcas = async () => {
      try {
          const data = [
              {
                  marca: 'HP',
                  modelos: ['Model A', 'Model B', 'Model C']
              },
              {
                  marca: 'Canon',
                  modelos: ['Model X', 'Model Y']
              }
          ];
          setMarcas(data);
      } catch (error) {
          console.error('Erro ao buscar marcas:', error);
      }
  };

  const fetchContratos = async () => {
      try {
          const data = [
              'A1B2C3D4',
              'E5F6G7H8',
              'I9J0K1L2',
              'M3N4O5P6',
              'Q7R8S9T0',
              'U1V2W3X4',
              'Y5Z6A7B8',
              'C9D0E1F2'
          ];
          setContratos(data);
      } catch (error) {
          console.error('Erro ao buscar contratos:', error);
      }
  };

  fetchMarcas();
  fetchContratos();
  fetchLocalizacoes();
}, []);

useEffect(() => {
  const fetchData = async () => {
      const response = await getPrinterById(id);
      if (response.type === 'success') {
          const { localizacao, ...restData } = response.data;
          const [cidade, regional, subestacao] = localizacao.split(';');

          setPrinterData({
              ...restData,
              cidade: cidade || '',
              regional: regional || '',
              subestacao: subestacao || ''
          });
      }
  };
  fetchData();
}, [id]);

const handleNumSerieChange = (newValue) => {
  setNumSerie(newValue);
};

const handleContratoChange = (event) => {
  setSelectedContrato(event.target.value);
};

const handleEnderecoIPChange = (newValue) => {
  setEnderecoIP(newValue);
};

const handleStatusChange = (event) => {
  const newStatus = event.target.value;
  setStatus(newStatus);
};

const handleDentroRedeChange = (event) => {
  const value = event.target.value;
  setSelectedDentroRede(value);

  if (value === "Não") {
      setEnderecoIP('');
  }
};

const handleLocalizacaoChange = (event) => {
  const cidadeSelecionada = event.target.value;
  setSelectedCidade(cidadeSelecionada);

  const localizacao = localizacoes.find(m => m.name === cidadeSelecionada);
  setWorkstations(localizacao ? localizacao.workstations : []);
  setSubWorkstations([]);

  setSelectedWorkstation('');
};

const handleWorkstationChange = (event) => {
  const workstationSelecionada = event.target.value;
  setSelectedWorkstation(workstationSelecionada);

  const subworkstations = workstations.find(m => m.name === workstationSelecionada);
  setSubWorkstations(subworkstations ? subworkstations.child_workstations : []);
};

const handleSubWorkstationChange = (event) => {
  const workstationSelecionada = event.target.value;
  setSelectedSubWorkstation(workstationSelecionada);
};

const dataRetiradaClass = mockPrinterData.status === "Ativo" ? "inactive-field" : "";
const dataRetiradaValue = mockPrinterData.status === "Ativo" ? "Equipamento ainda ativo" : mockPrinterData.dataRetirada;

  // Labels dos campos de informação
  const infoLabels = {
    equipamento: "Equipamento",
    numeroSerie: "Número de série",
    modelo: "Modelo",
    localizacao: "Localização",
    contrato: "Contrato",
    enderecoIp: "Endereço IP",
    dentroDaRede: "Dentro da rede",
    dataInstalacao: "Data de instalação",
    dataRetirada: "Data de retirada",
    status: "Status",
    marca: "Marca",
    cidade: "Cidade",
    regional: "Regional",
    subestacao: "Subestação"
  };

  const navigate = useNavigate();

  const handleExitForm = () => {
    navigate('/listimpressora');
  };

  const handleEditButton = () => {
    navigate('/editimpressora');
  };

  const enderecoIPClass = selectedDentroRede === "Não" ? "disabled" : "";

  return (
    <>
      <div id="view-printer-data">
        <div className="header-container">
          <span className="form-title">Editar Equipamento</span>
          <div className="info-cards-container" style={{ gap: '2rem' }}>
            <SmallInfoCard
              className="grey-info-card"
              title="Último contador"
              imageSrc={require('../../assets/green-calendar.png')}
              info="25/07/2024"
            />
            <SmallInfoCard
              className="grey-info-card"
              title="Tempo Ativo"
              imageSrc={require('../../assets/green-calendar.png')}
              info="20 dias"
            />
            <SmallInfoCard
              className="blue-info-card"
              title="Versão do Firmware"
              imageSrc={require('../../assets/processor.png')}
              info="1.9.2"
            />
          </div>
        </div>
        <div className="printer-field">
          <div className='info-field'>
            <ViewDataContainer
              id="nome-equipamento"
              className="large-view"
              labelName={infoLabels.equipamento}
              value={printerData.numSerie}
            />

            <ViewDataContainer
              id="marca-equipamento"
              className="large-view"
              labelName={infoLabels.marca}
              value={printerData.modeloId}
            />

            <ViewDataContainer
              id="modelo-equipamento"
              className="large-view"
              labelName={infoLabels.modelo}
              value={printerData.modeloId}
            />

            <InputContainer
              label="Número de série"
              placeholder="Insira número de série"
              value={printerData.numSerie}
              onChange={handleNumSerieChange}
              className="lg"
              
            />

            <SelectContainer
              id="contrato"
              name="contrato"
              options={contratos}
              className="lg-select"
              label="Contrato"
              onChange={handleContratoChange}
              value={printerData.numContrato}
            />

            <div className="container" style={{ gap: '5rem' }}>
              <InputContainer
                label="Endereço IP"
                placeholder="Insira o endereço IP"
                value={printerData.enderecoIp}
                onChange={handleEnderecoIPChange}
                className={`md ${enderecoIPClass}`}
                disabled={selectedDentroRede === "Não"}
              />

              <SelectContainer
                id="dentroRede"
                name="dentroRede"
                options={yesNo}
                className="lg-select"
                label="Dentro da rede"
                onChange={handleDentroRedeChange}
                value={printerData.estaNaRede ? "Sim" : "Não"}
               />
            </div>

            <DateContainer
              label="Data de Instalação"
              value={new Date(printerData.dataInstalacao).toLocaleString()}
              onChange={(e) => setDataInstalacao(e.target.value)}
              className="md"
            />

            <div className="container" style={{ gap: '5rem' }}>
              <DateContainer
                label="Data de Retirada"
                value={dataRetiradaValue}
                onChange={(e) => setDataInstalacao(e.target.value)}
                className="md"
              />

              <SelectContainer
                id="status"
                name="status"
                options={["Ativo", "Inativo"]}
                className="lg-select"
                label="Status"
                onChange={handleStatusChange}
                value={printerData.ativo ? "Ativo" : "Inativo"}
              />
            </div>
          </div>
          <div className='cards-field'> 
            <BigInfoCard
              title="Impressões totais"
              info={printerData.contadorAtualPB + printerData.contadorAtualCor}
            />
            <BigInfoCard
              title="Contador Atual"
              info={printerData.contadorInstalacaoCor + printerData.contadorInstalacaoPB}
            />
            <BigInfoCard
              title="Impressões Preto e Branco"
              info={printerData.contadorAtualPB}
            />
            <BigInfoCard
              title="Impressões Coloridas"
              info={printerData.contadorAtualCor}
            />
            <BigInfoCard
              title="Digitalizações totais"
              info="80"
            />
          </div>
        </div>
        
        <div className="form-separator"> Localização </div>
        <div className="container" style={{ gap: '5rem' }}>
          <SelectContainer
            id="cidade"
            name="cidade"
            options={localizacoes.map(m => m.name)}
            className="md-select"
            label="Cidade"
            onChange={handleLocalizacaoChange}
            value={printerData.cidade}                        
          />

          <SelectContainer
            id="workstation"
            name="workstation"
            options={workstations.map(m => m.name)}
            className="lg-select"
            label="Regional"
            onChange={handleWorkstationChange}
            value={printerData.subestacao}
          />

          <SelectContainer
            id="subworkstation"
            name="subworkstation"
            options={subWorkstations.map(m => m.name)}
            className="lg-select"
            label="Subestação"
            onChange={handleSubWorkstationChange}
            value={printerData.subestacao}
          />
        </div>
        <div className="space"></div>
        <div className="container">
          <Button
            type="success"
            size="medium"
            text="Editar"
            onClick={handleEditButton}
          />

          <Button
            type="info"
            size="medium"
            text="Acessar Lista de Equipamentos"
            onClick={handleExitForm}
          />
        </div>
        
        <div className="space"></div>
      </div>
    </>
  );
}
