import React, {useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../style/pages/viewPrinter.css';
import Navbar from "../components/navbar/Navbar";
import ViewDataContainer from "../components/containers/ViewDataContainer";
import SmallInfoCard from "../components/cards/SmallInfoCard.js";
import BigInfoCard from "../components/cards/BigInfoCard.js";
import Button from "../components/Button.js";
import { getPrinterById } from '../services/printerService.js';

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

export default function ViewPrinter() {

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

const {id} = useParams()

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
    window.location = `/editimpressora/${id}`
  };

  return (
    <>
      <Navbar />
      <div id="view-printer-data">
        <div className="header-container">
          <span className="form-title">Visualizar Equipamento</span>
          <div className="info-cards-container" style={{ gap: '2rem' }}>
            <SmallInfoCard
              className="grey-info-card"
              title="Último contador"
              imageSrc={require('../assets/green-calendar.png')}
              info="25/07/2024"
            />
            <SmallInfoCard
              className="grey-info-card"
              title="Tempo Ativo"
              imageSrc={require('../assets/green-calendar.png')}
              info="20 dias"
            />
            <SmallInfoCard
              className="blue-info-card"
              title="Versão do Firmware"
              imageSrc={require('../assets/processor.png')}
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

            <ViewDataContainer
              id="nserie-equipamento"
              className="large-view"
              labelName={infoLabels.numeroSerie}
              value={printerData.numSerie}
            />

            <ViewDataContainer
              id="contrato-equipamento"
              className="large-view"
              labelName={infoLabels.contrato}
              value={printerData.numContrato}
            />

            <div className="container" style={{ gap: '5rem' }}>
              <ViewDataContainer
                id="ip-equipamento"
                className="large-view"
                labelName={infoLabels.enderecoIp}
                value={printerData.enderecoIp}
              />

              <ViewDataContainer
                id="rede-equipamento"
                className="small-view"
                labelName={infoLabels.dentroDaRede}
                value={printerData.estaNaRede ? "Sim" : "Não"}
              />
            </div>

            <ViewDataContainer
              id="data-instalacao-equipamento"
              className="large-view"
              labelName={infoLabels.dataInstalacao}
              value={new Date(printerData.dataInstalacao).toLocaleString()}
            />

            <div className="container" style={{ gap: '5rem' }}>
              <ViewDataContainer
                id="data-retirada-equipamento"
                className={`large-view ${dataRetiradaClass}`}
                labelName={infoLabels.dataRetirada}
                value={dataRetiradaValue}
              />

              <ViewDataContainer
                id="status-equipamento"
                className="small-view"
                labelName={infoLabels.status}
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
          <ViewDataContainer
            id="cidade-equipamento"
            className={`large-view`}
            labelName={infoLabels.cidade}
            value={printerData.cidade}
          />

          <ViewDataContainer
            id="regional-equipamento"
            className="large-view"
            labelName={infoLabels.regional}
            value={printerData.regional}
          />

          <ViewDataContainer
            id="subestacao-equipamento"
            className="large-view"
            labelName={infoLabels.subestacao}
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
