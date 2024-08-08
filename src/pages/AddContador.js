import React, { useState } from 'react';
import '../style/pages/addcontador.css';
import Navbar from '../components/navbar/Navbar';

const AddContador = () => {
  const [cidade, setCidade] = useState("");
  const [postoTrabalho, setPostoTrabalho] = useState("");
  const [subpostoTrabalho, setSubpostoTrabalho] = useState("");
  const [equipamento, setEquipamento] = useState(""); 
  const [quantidadeImpressoes, setQuantidadeImpressoes] = useState(""); 

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
              <select value={cidade} onChange={(e) => setCidade(e.target.value)}>
                <option value="">Selecione </option>
                {/* Opções que serão adicionados no Selection */}
              </select>
            </div>
            <div className="campo">
              <label>Posto de Trabalho</label>
              <select value={postoTrabalho} onChange={(e) => setPostoTrabalho(e.target.value)}>
                <option value="">Selecione </option>
                {/* Opções que serão adicionados no Selection */}
              </select>
            </div>
            <div className="campo">
              <label>Subposto de Trabalho</label>
              <select value={subpostoTrabalho} onChange={(e) => setSubpostoTrabalho(e.target.value)}>
                <option value="">Selecione </option>
                {/* Opções que serão adicionados no Selection */}
              </select>
            </div>
          </div>
          <div className="fields-underline"></div>
          <div className="campo">
            <label>Equipamento Associado</label>
            <select value={equipamento} onChange={(e) => setEquipamento(e.target.value)}>
              <option value="">Selecione </option>
              {/* Opções que serão adicionados no Selection */}
            </select>
          </div>
          <div className="campo">
            <label>Quantidade de Impressões</label>
            <input 
              type="number" 
              value={quantidadeImpressoes} 
              onChange={(e) => setQuantidadeImpressoes(e.target.value)} 
              min="0" // Define o valor mínimo
              step="1" // Define o incremento de 1 em 1
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AddContador;
