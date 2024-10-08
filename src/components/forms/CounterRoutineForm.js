import Navbar from "../navbar/Navbar";
import React, { useState, useEffect } from "react";
import "../../style/components/counterRoutineForm.css";
import IntervalDropdown from "../containers/IntervalDropdown";
import { getLocalizacao, addRotina } from "../../services/printerService";
import SelectContainer from "../containers/SelectContainer";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function UpdateRoutine() {
  const [routine, setRoutine] = useState("");
  const [selectedRoutine, setSelectedRoutine] = useState(false);
  const [time, setTime] = useState("");
  const [day, setDay] = useState("");
  const [interval, setInterval] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [localizacoes, setLocalizacoes] = useState([]);
  const [workstations, setWorkstations] = useState([]);
  const [subWorkstations, setSubworkstations] = useState([]);
  const [selectedCidade, setCidade] = useState("");
  const [selectedRegional, setRegional] = useState("");
  const [selectedUnidade, setUnidade] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [hora, setHora] = useState("");
  const [minuto, setMinuto] = useState("");

  useEffect(() => {
    const fetchLocalizacoes = async () => {
      try {
        const response = await getLocalizacao();

        if (response.type === "error") {
          toast.error("Erro ao buscar localizações!");
        } else {
          setLocalizacoes(response.data);
        }
      } catch (error) {
        console.error("Erro ao buscar localizações:", error);
      }
    };
    fetchLocalizacoes();
  }, []);

  const handleLocalizacaoChange = (event) => {
    const cidadeSelecionada = event.target.value;
    setCidade(cidadeSelecionada);

    const localizacao = localizacoes.find((m) => m.name === cidadeSelecionada);
    setWorkstations(localizacao ? localizacao.workstations : []);
  };

  const handleWorkstationChange = (event) => {
    const workstationSelecionada = event.target.value;
    setRegional(workstationSelecionada);

    const workstation = workstations.find(
      (m) => m.name === workstationSelecionada
    );
    setSubworkstations(workstation ? workstation.child_workstations : []);
  };

  const handleSubWorkstationChange = (event) => {
    const subworkstationSelecionada = event.target.value;
    setUnidade(subworkstationSelecionada);
  };

  const handleRoutineChange = (e) => {
    const selectedRoutine = e.target.value;
    setRoutine(selectedRoutine);

    if (selectedRoutine !== "") {
      setErrors((prevErrors) => {
        const { rotina, ...rest } = prevErrors;
        return rest;
      });
    }

    if (
      selectedRoutine === "Diariamente" ||
      selectedRoutine === "Semanalmente" ||
      selectedRoutine === "Mensalmente"
    ) {
      setSelectedRoutine(true);
    } else {
      setSelectedRoutine(false);
    }
  };

  useEffect(() => {
    if (routine === "Semanalmente") {
      const buttons = document.querySelectorAll(".weekDayRoutine");

      buttons.forEach((button) => {
        button.addEventListener("click", () => {
          const dayByValue = button.getAttribute("value");

          if (button.classList.contains("selectedDay")) {
            button.classList.remove("selectedDay");
            setSelectedDays((prevDays) =>
              prevDays.filter((d) => d !== dayByValue)
            );
          } else {
            button.classList.add("selectedDay");
            setSelectedDays((prevDays) => {
              const newDays = [...prevDays, dayByValue];
              if (newDays.length > 0) {
                setErrors((prevErrors) => {
                  const { diasSemana, ...restErrors } = prevErrors;
                  return restErrors;
                });
              }
              return newDays;
            });
          }
        });
      });
    }
  }, [routine]);

  useEffect(() => {
    console.log(selectedDays);
  }, [selectedDays]);

  const handleTimeChange = (e) => {
    const selectedTime = e.target.value;
    setTime(selectedTime);

    if (selectedTime) {
      const [hour, minute] = selectedTime.split(":");
      setHora(parseInt(hour).toString());
      setMinuto(parseInt(minute).toString());
      setInterval("");
      setErrors((prevErrors) => {
        const { horario, intervalo, ...rest } = prevErrors;
        return rest;
      });
    }
  };

  const handleIntervalChange = (e) => {
    const selectedInterval = e.target.value;
    setInterval(selectedInterval);

    if (selectedInterval) {
      const [hour, minute] = selectedInterval.split(":");
      setHora(parseInt(hour).toString());
      setMinuto(parseInt(minute).toString());
      setTime("");
      setErrors((prevErrors) => {
        const { intervalo, horario, ...rest } = prevErrors;
        return rest;
      });
    }
  };

  const handleDayChange = (e) => {
    const value = e.target.value;
    setDay(value);
    if (value === "" || isNaN(value) || value < 1 || value > 28) {
      setErrors((prevErrors) => ({ ...prevErrors, diaMes: "Por favor, insira um valor entre 1 e 28" }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, diaMes: undefined }));
    }
  };

  const handleExitForm = () => {
    navigate("/");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!selectedRoutine) newErrors.rotina = "Uma Rotina precisa ser escolhida";
    if (!time && !interval) {
      newErrors.horario = "Um horário precisa ser escolhido";
      newErrors.intervalo = "Um intervalo precisa ser escolhido";
    }
    if (routine === "Semanalmente") {
      if (selectedDays.length === 0)
        newErrors.diasSemana = "Escolha o(s) dia(s) da semana";
    }
    if (routine === "Mensalmente") {
      if (!day) newErrors.diaMes = "Um dia do mês precisa ser escolhido";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retorna true se não houver erros
  };

  const handleRoutineSubmit = async () => {
    if (!validateForm()) {
      toast.error("Por Favor preencha os campos obrigatórios.");
      return;
    }
    const cronString = () => {
      let pattern = "";
      switch (routine) {
        case "Diariamente":
          if (time === "") {
            // intervalo
            hora == 0 // Não tem suporte para intervalos como 1:30, precisar usar expressões diferentes
              ? (pattern = "* " + "*/" + minuto + " * * * *") // "A cada x minutos"
              : (pattern = "* " + "0 " + "*/" + hora + " * * *"); // "A cada x horas"
          } else {
            // horario
            pattern = "* " + minuto + " " + hora + " * * *"; // "todos os dias as x horas e y minutos"
          }
          return pattern;
        case "Semanalmente":
          if (time === "") {
            // intervalo
            hora == 0
              ? (pattern =
                  "* " + "*/" + minuto + " * * * " + selectedDays.toString()) // A cada x minutos nos dias a,b e c
              : (pattern =
                  "* " +
                  "*" +
                  " */" +
                  hora +
                  " * * " +
                  selectedDays.toString()); // A cada x horas nos dias a,b e c
          } else {
            // horario
            pattern =
              "* " + minuto + " " + hora + " * * " + selectedDays.toString();
          }

          return pattern;
        case "Mensalmente":
          if (time === "") {
            // intervalo'
            hora == 0
              ? (pattern = "* " + "*/" + minuto + " * " + day + " * *") // cada x minutos no dia y do mes
              : (pattern = "* " + "0 " + "*/" + hora + " " + day + " * *"); // cada x horas no dia y do mes
          } else {
            // horario
            pattern = "* " + minuto + " " + hora + " " + day + " * * ";
          }
          return pattern;
      }
      return pattern;
    };

    const rotinaData = {
      localizacao: `${selectedCidade};${selectedRegional};${selectedUnidade}`,
      dataCriado: new Date(Date.now()).toISOString().split("T")[0],
      cronExpression: cronString(),
      dataUltimoUpdate: null,
      ativo: true,
      cidadeTodas: selectedCidade == "Todas" ? true : false,
      regionalTodas: selectedRegional == "Todas" ? true : false,
      unidadeTodas: selectedUnidade == "Todas" ? true : false,
    };

    try {
      const response = await addRotina(rotinaData);

      if (response.type === "success") {
        toast.success("Rotina registrada com sucesso!");
        setTimeout(() => {
          navigate(`/`);
        }, 3000);
      } else {
        console.error("Erro recebido do backend:", response.error);
        toast.error(
          "Erro ao registrar rotina: " + (response.error || response.data)
        );
        console.log(response);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      toast.error("Erro ao registrar rotina: " + error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-Routine">
        <div className="topRoutine">
          <h1 id="titleRoutine">Rotina de Registro Automático</h1>
        </div>
        <div className="midPage-Routine">
          <div>
            <label htmlFor="Cidade" id="labelRoutine">
              Cidade
            </label>
            <SelectContainer
              data-testid="cidade-dropdown"
              id="Cidade"
              className="dropdownRoutine"
              name="cidade"
              label=""
              options={
                localizacoes
                  ? localizacoes.map((localizacao) => localizacao.name)
                  : []
              }
              onChange={handleLocalizacaoChange}
              value={selectedCidade}
              error={errors.cidade}
              placeHolder={"Todos"}
            />
          </div>
          <div>
            <label htmlFor="Regional" id="labelRoutine">
              Regional
            </label>
            <SelectContainer
              data-testid="regional-dropdown"
              id="Regional"
              className="dropdownRoutine"
              name="regional"
              label=""
              options={
                workstations
                  ? workstations.map((workstation) => workstation.name)
                  : []
              }
              onChange={handleWorkstationChange}
              value={selectedRegional}
              error={errors.regional}
              placeHolder={"Todos"}
            />
          </div>
          <div>
            <label htmlFor="Unidade de Trabalho" id="labelRoutine">
              Unidade de Trabalho
            </label>
            <SelectContainer
              data-testid="unidade-dropdown"
              id="Unidade de Trabalho"
              className="dropdownRoutine"
              name="Unidade de Trabalho"
              label=""
              options={
                subWorkstations
                  ? subWorkstations.map((subworkstation) => subworkstation.name)
                  : []
              }
              onChange={handleSubWorkstationChange}
              value={selectedUnidade}
              error={errors.unidade}
              placeHolder={"Todos"}
            />
          </div>
        </div>
        <div className="bottomPage-Routine">
          <div className="optionsRoutine">
            <label htmlFor="Rotina de Registro" id="labelRoutine">
              Rotina de Registro
            </label>
            <select
              id="Rotina de Registro"
              value={routine}
              onChange={handleRoutineChange}
              className={errors.rotina ? "inputRoutine-error" : "dropdownRoutine"}
            >
              <option value={""}>Escolha uma opção</option>
              <option value={"Diariamente"}>Diariamente</option>
              <option value={"Semanalmente"}>Semanalmente</option>
              <option value={"Mensalmente"}>Mensalmente</option>
            </select>
            {errors.rotina && (
              <span className="errorRoutine-message">{errors.rotina}</span>
            )}
          </div>
          {selectedRoutine && (
            <div className="routineResults">
              {routine === "Diariamente" && (
                <div className="dailyOption">
                  <label id="labelRoutine">Diariamente</label>
                </div>
              )}

              {routine === "Semanalmente" && (
                <div className="weeklyOption">
                  <label id="labelRoutine">Semanalmente</label>
                  <div id="smallboxRoutine">
                    <div>
                      <label htmlFor="weekDays" id="slabelRoutine">
                        Escolha o dia:
                      </label>
                    </div>
                    <div className="weekDayOptions">
                      <span>
                        <div
                          className="weekDayRoutine"
                          role="checkbox"
                          value={"0"}
                          id="weekDays"
                        >
                          D
                        </div>
                      </span>
                      <span>
                        <div
                          className="weekDayRoutine"
                          role="checkbox"
                          value={"1"}
                          id="weekDays"
                        >
                          S
                        </div>
                      </span>
                      <span>
                        <div
                          className="weekDayRoutine"
                          role="checkbox"
                          value={"2"}
                          id="weekDays"
                        >
                          T
                        </div>
                      </span>
                      <span>
                        <div
                          className="weekDayRoutine"
                          role="checkbox"
                          value={"3"}
                          id="weekDays"
                        >
                          Q
                        </div>
                      </span>
                      <span>
                        <div
                          className="weekDayRoutine"
                          role="checkbox"
                          value={"4"}
                          id="weekDays"
                        >
                          Q
                        </div>
                      </span>
                      <span>
                        <div
                          className="weekDayRoutine"
                          role="checkbox"
                          value={"5"}
                          id="weekDays"
                        >
                          S
                        </div>
                      </span>
                      <span>
                        <div
                          className="weekDayRoutine"
                          role="checkbox"
                          value={"6"}
                          id="weekDays"
                        >
                          S
                        </div>
                      </span>
                    </div>
                    <div id="erroArea">
                      {errors.diasSemana && (
                        <span className="errorRoutine-message">
                          {errors.diasSemana}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {routine === "Mensalmente" && (
                <div className="monthlyOption">
                  <label id="labelRoutine">Mensalmente</label>
                  <div id="smallboxRoutine">
                    <div>
                      <label htmlFor="dayRoutine" id="slabelRoutine">
                        Digite o dia do mês:
                      </label>
                    </div>
                    <div>
                      <input
                        data-testid="dayInput"
                        placeholder="1-28"
                        type="number"
                        min="1"
                        max="28"
                        id="dayRoutine"
                        value={day}
                        onChange={handleDayChange}
                        className={errors.diaMes ? "inputRoutineDay-error" : ""}
                      ></input>
                    </div>
                    <div>
                      {errors.diaMes && (
                        <span className="errorRoutine-message">
                          {errors.diaMes}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div id="smallboxRoutine">
                    <div>
                      <label htmlFor="timeRoutine" id="slabelRoutine">
                        Escolha um horário:
                      </label>
                    </div>
                    <div className="inputRoutine">
                      <input
                        type="time"
                        id="timeRoutine"
                        value={time}
                        onChange={handleTimeChange}
                        className={errors.horario ? "inputRoutine-error" : ""}
                      ></input>
                    </div>
                    {errors.horario && (
                      <div id="errorArea">
                        <span className="errorRoutine-message">
                          {errors.horario}
                        </span>
                      </div>
                    )}
                  </div>
                  <div id="smallboxRoutine">
                    <div>
                      <label htmlFor="intervalRoutine" id="slabelRoutine">
                        Escolha o intervalo:
                      </label>
                    </div>
                    <div id="interval-div">
                      <IntervalDropdown
                        className={errors.horario ? "inputInterval-error" : "intervalRoutine"}
                        id="intervalRoutine"
                        data-testid="interval-dropdown" 
                        value={interval}
                        onChange={handleIntervalChange}
                        error={errors.intervalo}
                      />
                    </div>
                    {errors.intervalo && (
                      <div id="errorArea">
                        <span className="errorRoutine-message">
                          {errors.intervalo}</span>
                      </div>                     
                    )}
                  </div>
            </div>
          )}
        </div>
        <div className="buttons-Routine">
          <button id="addRoutine" onClick={handleRoutineSubmit}>
            Adicionar Rotina
          </button>
          <button id="cancelEditRoutine" data-testid="cancel-button" onClick={handleExitForm}>
            Cancelar
          </button>
        </div>
      </div>
    </>
  );
}
