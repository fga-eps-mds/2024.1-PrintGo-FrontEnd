import React, { useState, useEffect } from "react";
import '../style/pages/viewPrinter.css';
import Navbar from "../components/navbar/Navbar";
import ViewDataContainer from "../components/containers/ViewDataContainer";
import "../style/pages/viewPrinter.css";

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


  return (
    <>
      <Navbar />
      <div id="view-printer-data">
        <span className="form-title">Visualizar Equipamento</span>
          <ViewDataContainer
            id="nome-equipamento"
            className="large-view"
            labelName={infoLabels.equipamento}
            value={mockPrinterData.equipamento}
          />

          <ViewDataContainer
            id="marca-equipamento"
            className="large-view"
            labelName={infoLabels.marca}
            value={mockPrinterData.marca}
          />

          <ViewDataContainer
            id="modelo-equipamento"
            className="large-view"
            labelName={infoLabels.modelo}
            value={mockPrinterData.modelo}
          />

          <ViewDataContainer
            id="nserie-equipamento"
            className="large-view"
            labelName={infoLabels.numeroSerie}
            value={mockPrinterData.numeroSerie}
          />

          <ViewDataContainer
            id="localizacao-equipamento"
            className="large-view"
            labelName={infoLabels.localizacao}
            value={mockPrinterData.localizacao}
          />

          <ViewDataContainer
            id="contrato-equipamento"
            className="large-view"
            labelName={infoLabels.contrato}
            value={mockPrinterData.contrato}
          />

          <div className="container" style={{ gap: '5rem' }}>
              <ViewDataContainer
                id="ip-equipamento"
                className="large-view"
                labelName={infoLabels.enderecoIp}
                value={mockPrinterData.enderecoIp}
              />

              <ViewDataContainer
                id="rede-equipamento"
                className="small-view"
                labelName={infoLabels.dentroDaRede}
                value={mockPrinterData.dentroDaRede}
              />
          </div>

          <ViewDataContainer
            id="data-instalacao-equipamento"
            className="large-view"
            labelName={infoLabels.dataInstalacao}
            value={mockPrinterData.dataInstalacao}
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
                value={mockPrinterData.status}
              />
          </div>

      </div>
      
    </>
  );
}