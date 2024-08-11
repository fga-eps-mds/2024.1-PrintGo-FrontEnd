import Navbar from "../components/navbar/Navbar";
import React, {useState} from "react";

export default function UpdateRoutine() {

  const [routine, setRoutine] = useState("");
  const [showChosenOption, setShowChosenOption] = useState(false);

  const handleRoutineChange = (e) => {
    const selectedRoutine = e.target.value;
    setRoutine(selectedRoutine);

    if (
      selectedRoutine === "Diariamente" ||
      selectedRoutine === "Semanalmente" ||
      selectedRoutine === "Mensalmente"
    ) {
      setShowChosenOption(true);
    } else {
      setShowChosenOption(false);
    }
  };

  return (
    <>
      <Navbar />
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
        <select id="Rotina" value={routine} onChange={handleRoutineChange}>
          <option value={""}>Escolha um opção</option>
          <option value={"Diariamente"}>Diariamente</option>
          <option value={"Semanalmente"}>Semanalmente</option>
          <option value={"Mensalmente"}>Mensalmente</option>
        </select>
      </div>
      {showChosenOption && (
        <div className="routineOptions">
          {routine === "Diariamente" && (
            <div className="dailyOption">
              <label>Diariamente</label>
              <label>Digite o horário</label>
              <input placeholder="00:00"></input>
            </div>
          )}

          {routine === "Semanalmente" && (
            <div className="weeklyOption">
              <label>Semanalmente</label>
              <label>Digite o horário</label>
              <input placeholder="00:00"></input>
              <label>Escolha o dia da semana</label>
            </div>
          )}

          {routine === "Mensalmente" && (
            <div className="monthlyOption">
              <label>Digite o horário</label>
              <input placeholder="00:00"></input>
              <label>Digite o dia do mês</label>
              <input placeholder="1-28"></input>
            </div>
          )}
        </div>
      )}
      <div>
        <button>Editar</button>
        <button>Cancelar</button>
      </div>
    </>
  );
}
