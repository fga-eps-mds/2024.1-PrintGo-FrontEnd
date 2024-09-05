import "../style/pages/viewPattern.css";
import React from "react";
import voltar_vector from "../assets/voltar_vector.svg";
import Navbar from "../components/navbar/Navbar";
import { useLocation } from "react-router-dom";

export default function ViewPattern() {
  const location = useLocation();

  const altLocation = {
    id: "",
    marca: "",
    modelo: "",
    tipo: "",
    colorido: false,
    oidModelo: "",
    oidNumeroSerie: "",
    oidFirmware: "",
    oidTempoAtivo: "",
    oidDigitalizacoes: "",
    oidCopiasPB: "",
    oidCopiasCor: "",
    oidTotalGeral: ""
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
    oidTotalGeral: "Total geral",
  }

  return (
    <>
      <Navbar />
      <div>
        <div className="viewpattern-card">
        <h2 id="printer-pattern-form-header">Visualizar de padrão de impressora</h2>
          {pattern ? (
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
                    <label htmlFor={key}>{label}</label>
                    <p data-testid={key}>{pattern[key]}</p>
                  </div>
                ))}
                <div className="viewpattern-info-box">
                  <label>É Colorido?</label>
                  <p data-testid="colorido">{pattern.colorido ? "Sim" : "Não"}</p>
                </div>
                <div className="viewpattern-info-box">
                  <label>Esta ativo?</label>
                  <p data-testid="ativo">{pattern.ativo ? "Sim" : "Não"}</p>
                </div>
              </div>

                <h2 className="snmp-header">SNMP</h2>
              <div className="viewpattern-oid-line">
                {Object.entries(oidLabels).map(([key, label]) => (
                  <div key={key} className="viewpattern-oid-box">
                    <label>{label}:</label>
                    <p data-testid={key}>{pattern[key]}</p>
                  </div>
                ))}
              </div>
              
            </div>
          ) : (
            <p id="viewpattern-loading-text">Carregando dados...</p>
          )
          }
        </div>
      </div>
    </>
  );
}
