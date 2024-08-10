import Navbar from "../components/navbar/Navbar";
import React from "react";
export default function UpdateRoutine() {
    return (
        <>
        <Navbar/>
        <div className="tituloRotina">
            <h1>Editar Rotina de Registro Automático</h1>
        </div>
        <div>
            <label>Regional</label>
            <select id="Regiao">
                <option>Escolha um opção</option>
                <option>Exemplo 1</option>
                <option>Exemplo 2</option>
            </select>
        </div>
        <div>
            <label>Rotina de Registro</label>
                <select id="Rotina">
                    <option>Escolha um opção</option>
                    <option>Diariamente</option>
                    <option>Semanalmente</option>
                    <option>Mensalmente</option>
                </select>
        </div>
        <div>
            <button>Editar</button>
            <button>Cancelar</button>
        </div>
        </>    
    )}


