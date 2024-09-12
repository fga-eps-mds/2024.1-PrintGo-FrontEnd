import React, { useState, useMemo, useEffect } from "react";
import "../style/pages/patternList.css";
import { Link, useNavigate } from "react-router-dom";
import Filter from "../assets/Filter.svg";
import Input from "../components/Input";
import Navbar from "../components/navbar/Navbar";
import { getPadroes, togglePattern } from "../services/patternService";
import { toast } from "react-toastify";
import {
  FaMagnifyingGlass,
  FaPencil,
  FaToggleOff,
  FaToggleOn,
} from "react-icons/fa6";
import Button from "../components/Button";

export default function PatternList() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [patterns, setPatterns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getPadroes();
        if (data.type === "success" && data.data) {
          setPatterns(data.data);
        }
      } catch (error) {
        console.error("Erro ao obter lista de padrões", error);
      }
    }

    fetchData();
  }, []);

  //ativa e desativa padrão.
  async function patternToggle(pattern) {
    try {
      if (pattern) {
        const data = await togglePattern(pattern.id);
        console.log(data);

        if (data.type === "success") {
          pattern.ativo
            ? toast.success("Padrão destivado com sucesso")
            : toast.success("Padrão reativado com sucesso");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      } else {
        console.error("Pattern not selected");
      }
    } catch (error) {
      console.error(error);
    }
  }

  //qual filtro esta sendo aplicado
  function filterBeingShown(filter){

    if (filter === 'all') {
      return 'Todas';
    } else if (filter === 'active') {
      return 'Ativas';
    } else {
      return 'Desativadas';
    }
  }
/*

*/
  //filtros para busca de impressora
  
  const filteredPatterns= useMemo(() => {
    return patterns.filter(pattern => {
      const searchLower = search.toLowerCase();
      const {
        tipo,
        modelo,
        marca,
      } = pattern;
  
      return (
        search === '' ||
        tipo.toLowerCase().includes(searchLower) ||
        modelo.toLowerCase().includes(searchLower) ||
        marca.toLowerCase().includes(searchLower)
      );
    }).filter(pattern => {
      return filter === 'all' ||
             (filter === 'active' && pattern.ativo) ||
             (filter === 'deactivated' && !pattern.ativo);
    });
  }, [patterns, search, filter]);

  const handleEdit = (pattern) => {
    navigate("/editarpadrao", { state: pattern });
  };

  const onReadClick = () => {};

  return (
    <>
      <Navbar />
      <div className="patternlist-container">
        <div className="patternlist-header">
          <div className="patternlist-header-title">
            <h2>Padrões de Impressoras Cadastradas</h2>
            <h4 data-testid="filter_beign_shown">{filterBeingShown(filter)}</h4>
          </div>

          <div className="patternlist-header-search-filter">
            <Input
              onChange={(e) => setSearch(e.target.value)}
              placeholder={"Pesquisar Padrão"}
            />

            <div className="patternlist-filter">
              <img alt="" src={Filter} className="patternlist-filter"></img>

              <div className="patternlist-filter-dropdown-container">
                <div className="patternlist-dropdown-filter">
                  <Link to="#" onClick={() => setFilter("all")}>
                    Todas
                  </Link>
                  <Link to="#" onClick={() => setFilter("active")}>
                    Ativas
                  </Link>
                  <Link to="#" onClick={() => setFilter("deactivated")}>
                    Desativas
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {filteredPatterns.map((pattern) => (
          <div
            key={pattern.id}
            className="patternlist-pattern"
            style={{ color: pattern.ativo ? "" : "gray" }}
          >
            <div className="patternlist-model">
              <h4>
                <span
                  style={{ color: pattern.ativo ? "" : "gray" }}
                >
                  Padrão: {pattern.marca} - {pattern.modelo}- {pattern.tipo}
                </span>
              </h4>
              {!pattern.ativo && <h5>Desativado</h5>}
            </div>
            <div className="actions">
              <div className="read">
                <Button
                  className="read"
                  type="icon"
                  size="small"
                  text={<FaMagnifyingGlass fontSize={"30px"} color="#0D3D6D" />}
                  onClick={() => {
                    navigate("/visualizarpadrao", { state: pattern });
                  }}
                />
              </div>

              <div className="edit">
                <Button
                  className="edit"
                  type="icon"
                  size="small"
                  text={<FaPencil fontSize={"35px"} color="#003366" />}
                  onClick={() => {
                    handleEdit(pattern);
                  }}
                />
              </div>

              <div className="toggle">
                <Button
                  type="icon"
                  size="small"
                  text={
                    pattern.ativo ? (
                      <FaToggleOn fontSize={"40px"} color="#003366" />
                    ) : (
                      <FaToggleOff fontSize={"40px"} color="#003366" />
                    )
                  }
                  onClick={() => {
                    patternToggle(pattern);
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
