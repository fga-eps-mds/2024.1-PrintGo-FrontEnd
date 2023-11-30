import React, { useState } from "react";
import '../style/pages/viewPrinter.css';
import ellipse from '../assets/login_ellipse.svg';
import voltar_vector from '../assets/voltar_vector.svg';
import Navbar from "../components/navbar/Navbar";

export default function ViewPrinter(){
    // Labels dos campos de informação.
    const infoLabels = {
        numeroSerie: "Número de série",
        ip: "IP",
        codigoLocadora: "Código de locadora",
        espacoLivre: "",
        contadorInstalacao: "Contador de instalação",
        dataInstalacao: "Data de instalação",
        contadorRetirada: "Contador de retirada",
        dataRetirada: "Data de retirada",
        ultimoContador: "Último contador",
        dataUltimoContador: "Data do último contador",
        circunscricao: "Circunscrição",
        unidade: "Unidade"
    }

    // Estado para armazenar os dados da impressora.
    const [printer, setPrinter] = useState(
      {
        id: "1",
        padrao: {
          tipo: "Multifuncional P&B",
          marca: "Canon",
          modelo: "MF1643i II",
        },
        ip: "192.168.15.1",
        numeroSerie: "XXXX-000000",
        codigoLocadora: "PRINTER-004",
        contadorInstalacao: 0,
        ultimoContador: 0,
        dataInstalacao: "2023-11-30T12:00:00Z",
        dataUltimoContador: "2023-11-30T12:00:00Z",
        contadorRetirada: 0,
        dataRetirada: "12/10/2023",
        unidadeId: "1",
        status: "ATIVO"
      }
    );

    return(
        <>
          <Navbar />
          <div id="container-viewprinter">
            <div id="viewprinter-left-content"></div>
            <div id="viewprinter-right-content">
              <div id="viewprinter-card">
                <div id="viewprinter-info-group">
                  <header id="viewprinter-card-header">
                    <img alt="" src={voltar_vector}></img>
                    <a href="/impressorascadastradas">Voltar</a>
                  </header>
                  <p id="viewprinter-info-header">
                    {printer.padrao.tipo} - {printer.padrao.marca} - {printer.padrao.modelo}
                  </p>
                  <div id="viewprinter-info-line">
                    {Object.entries(infoLabels).map(([key, label]) => (
                      <div key={key} id="viewprinter-info-box">
                        <label>{label}</label>
                        <p>{printer?.[key]}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="elipse-viewprinter">
                <img alt= "elipse"  src={ellipse}></img>
              </div>
            </div>
          </div>
        </>
    );
}