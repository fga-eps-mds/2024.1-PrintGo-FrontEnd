import Navbar from "../components/navbar/Navbar";
import React, {useState, useEffect} from "react";
import "../style/components/editCounterRoutine.css";
import IntervalDropdown from '../../src/components/containers/IntervalDropdown';

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
    }}

    useEffect(() => {
      if (routine === "Semanalmente") {
        const buttons = document.querySelectorAll('.weekDayRoutine');
  
        buttons.forEach(button => {
          button.addEventListener('click', () => {
            if (button.classList.contains('selectedDay')) {
              button.classList.remove('selectedDay');
            } else {
              button.classList.add('selectedDay'); 
            }
          });
        });
      }
    }, [routine]);

    const [time, setTime] = useState('');
    const [interval, setInterval] = useState('');

    const handleTimeChange = (e) => {
      setTime(e.target.value);
      if (e.target.value) {
        setInterval(''); 
      }
      console.log("muda tempo")
    };
    
    const handleIntervalChange = (e) => {
      setInterval(e.target.value);
      if (e.target.value) {
        setTime(''); 
      }
      console.log("muda intervalo")
    };
  
  return (
    <>
      <Navbar />
      <div className="page-Routine">
        <div className="topRoutine">
          <h1 id="titleRoutine"> Rotina de Registro Automático</h1>
        </div>
        <div className="midPage-Routine">
          <div>
          <label id="labelRoutine">Cidade</label>
          <select id="dropdownRoutine">
            <option>Escolha uma opção</option>
            <option>Cidade 1</option>
            <option>Cidade 2</option>
          </select>
          </div>
          <div>
          <label id="labelRoutine">Regional</label>
          <select id="dropdownRoutine">
            <option>Escolha uma opção</option>
            <option>Regional 1</option>
            <option>Regional 2</option>
          </select>
          </div>
          <div>
          <label id="labelRoutine">Unidade de Trabalho</label>
          <select id="dropdownRoutine">
            <option>Escolha uma opção</option>
            <option>Unidade 1</option>
            <option>Unidade 2</option>
          </select>
          </div>
        </div>
        <div className="bottomPage-Routine">
          <div className="optionsRoutine">
            <label id="labelRoutine">Rotina de Registro</label>
            <select id="dropdownRoutine" value={routine} onChange={handleRoutineChange}>
              <option value={""}>Escolha uma opção</option>
              <option value={"Diariamente"}>Diariamente</option>
              <option value={"Semanalmente"}>Semanalmente</option>
              <option value={"Mensalmente"}>Mensalmente</option>
            </select>
          </div>
        {showChosenOption && (
          <div className="routineResults">
            {routine === "Diariamente" && (
              <div className="dailyOption">
                <label id="labelRoutine">Diariamente</label>
                <div id="smallboxRoutine">
                  <label id="slabelRoutine">Escolha um horário:</label>
                  <input type="time" id="timeRoutine" value={time} onChange={handleTimeChange}></input>
                </div>
                <div id="smallboxRoutine">
                  <label id="slabelRoutine">Escolha o intervalo:</label>
                  <IntervalDropdown value={interval} onChange={handleIntervalChange} />
                </div>
              </div>
            )}

            {routine === "Semanalmente" && (
              <div className="weeklyOption">
                <label id="labelRoutine">Semanalmente</label>
                <div id="smallboxRoutine">
                  <label id="slabelRoutine">Escolha o horário:</label>
                  <input type="time" id="timeRoutine" value={time} onChange={handleTimeChange}></input>    
                </div>
                <div id="smallboxRoutine">
                  <label id="slabelRoutine">Escolha o intervalo:</label>
                  <IntervalDropdown value={interval} onChange={handleIntervalChange}/>
                </div>
                <div id="smallboxRoutine">
                  <label id="slabelRoutine">Escolha o dia:</label>
                  <div className="weekDayOptions">
                    <span>
                      <div className="weekDayRoutine" role="checkbox">D</div>
                    </span>
                    <span>
                      <div className="weekDayRoutine" role="checkbox">S</div>
                    </span>
                    <span>
                      <div className="weekDayRoutine" role="checkbox">T</div>
                    </span>
                    <span>
                      <div className="weekDayRoutine" role="checkbox">Q</div>
                    </span>
                    <span>
                      <div className="weekDayRoutine" role="checkbox">Q</div>
                    </span>
                    <span>
                      <div className="weekDayRoutine" role="checkbox">S</div>
                    </span>
                    <span>
                      <div className="weekDayRoutine" role="checkbox">S</div>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {routine === "Mensalmente" && (
              <div className="monthlyOption">
                <label id="labelRoutine">Mensalmente</label>
                <div id="smallboxRoutine">
                  <label id="slabelRoutine">Escolha o horário:</label>
                  <input type="time" id="timeRoutine" value={time} onChange={handleTimeChange}></input>
                </div>
                <div id="smallboxRoutine">
                  <label id="slabelRoutine">Escolha o intervalo:</label>
                  <IntervalDropdown value={interval} onChange={handleIntervalChange} />
                </div>
                <div id="smallboxRoutine">
                  <label id="slabelRoutine">Digite o dia do mês:</label>
                  <input placeholder="1-28" type="number" min="1" max="28" id="dayRoutine"></input>
                </div>
              </div>
            )}
          </div>
        )}
        </div>
        <div className="buttons-Routine">
          <button id="addRoutine">Adicionar Rotina</button>
          <button id="cancelEditRoutine">Cancelar</button>
        </div>
      </div>      
    </>
  );
}
