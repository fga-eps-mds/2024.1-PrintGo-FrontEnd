import "../style/pages/viewPattern.css";
import React, { useEffect, useState } from "react";
import Ellipse from "../assets/login_ellipse.svg";
import voltar_vector from "../assets/voltar_vector.svg";
import Navbar from "../components/navbar/Navbar";
import { useLocation, useParams } from "react-router-dom";

export default function ViewPattern() {
  const location = useLocation();

  const altLocation = {
      id:"",
      marca: "",
      modelo: "",
      tipo: "",
      colorido: false,
      oidModelo:  "",
      oidNumeroSerie: "",
      oidFirmware:  "",
      oidTempoAtivo:  "",
      oidDigitalizacoes:  "",
      oidCopiasPB:  "",
      oidCopiasCor: "",
      oidTotalGeral:  ""
    }
  
  
  const pattern = location.state || altLocation;
  




  const infoLabels = {
    tipo: "Tipo:",
    modelo: "Modelo:",
    marca: "Marca:",
  }

  const oidLabels = {
    oidModelo: "Modelo de impressora",
    oidNumeroSerie: "Número de série",
    oidFirmware: "Versão de Firmware",
    oidTempoAtivo: "Tempo ativo do sistema",
    oidDigitalizacoes: "Total de digitalizações",
    oidCopiasPB: "Total de cópias P&B",
    oidCopiasCor: "Total de cópias color",
    oidTotalGeral: "Total de impressões P&B",
  } 

  return (
    <>
      <Navbar />
      <div className="viewpattern-container">
        <div className="viewpattern-card">

          { pattern ? (
            <div className="viewpattern-info-group">
              
              <header className="viewpattern-card-header">
                <a href="/padroescadastrados">
                  <img alt="" src={voltar_vector}></img>
                  Voltar
                </a>

              </header>

              <div className="viewpattern-info-line">
                {Object.entries(infoLabels).map(([key, label]) => (
                  <div key={key} className="viewpattern-info-box">
                    <label>{label}</label>
                    <p>{pattern[key]}</p>
                  </div>
                ))}
                  <div className="viewpattern-info-box">
                    <label>É Colorido?</label>
                    <p>{pattern.colorido?"Sim":"Não"}</p>
                  </div>
                  <div className="viewpattern-info-box">
                    <label>Esta ativo?</label>
                    <p>{pattern.ativo?"Sim":"Não"}</p>
                  </div>
              </div>

              <div className="viewpattern-oid-line">
                <p>SNMP</p>
                {Object.entries(oidLabels).map(([key, label]) => (
                  <div key={key} className="viewpattern-oid-box">
                    <label>{label}:</label>
                    <p>{pattern[key]}</p>
                  </div>
                ))}
              </div>

            </div>
            ) : (
              <p id="viewpattern-loading-text">Carregando dados...</p>
            )
          }
        </div>

        <div className="viewpattern-ellipse">
          <img alt="elipse" src={Ellipse} />
        </div>
      </div>
    </>
  );
}
