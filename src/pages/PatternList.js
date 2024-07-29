import React, { useState, useMemo, useEffect } from "react";
import "../style/pages/patternList.css";
import { Link, useNavigate } from "react-router-dom";
import Search from '../assets/Search.svg';
import Filter from '../assets/Filter.svg';
import Engine from '../assets/engine.svg';
import Input from '../components/Input'; 
import Modal from '../components/ui/Modal';
import Navbar from "../components/navbar/Navbar";
import { getPadroes, togglePattern } from "../services/patternService";
import { toast } from "react-toastify";



export default function PatternList() {

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBodytext, setModalBodytext] = useState('');
  const [selectedPattern, setSelectedPattern] = useState();
  const [patterns, setPatterns] = useState([]);
  const navigate = useNavigate();

  useEffect( () => {
    async function fetchData() {
      try {
        const data = await getPadroes();
        if (data.type === 'success' && data.data) {
          setPatterns(data.data);
        }
      } catch (error) {
        console.error('Erro ao obter lista de padrões', error);
      }
    }

    fetchData();
  }, []);

  // modal para desativar impressora
  const modalDeactivatePattern = (pattern) => {
    setSelectedPattern(pattern);
    setModalTitle("Desativação de padrão");
    setModalBodytext("Você tem certeza que deseja desativar o padrão?");
    setModalOpen(true);
  }

  //modal para ativar impressora
  const modalActivePattern= (pattern) => {
    setSelectedPattern(pattern);
    setModalTitle("Ativação de padrão");
    setModalBodytext("Você tem certeza que deseja reativar o padrão?");
    setModalOpen(true);
  }
  
  //ativa e desativa padrão.
  async function patternToggle() {
    try {
      if (selectedPattern) {
        const data = await togglePattern(selectedPattern.id);
        console.log(data);
        
        if (data.type === 'success') {
          setModalOpen(false);
          selectedPattern.ativo? toast.success("Padão destivado com sucesso"): toast.success("Padão reativado com sucesso")
          setTimeout(() => {
            window.location.reload()
          }, 1000);
        }
      } else {
        console.error("Pattern not selected");
      }
    } catch (error) {
      setModalOpen(false);
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

  return (
    <>
      {modalOpen && (
        <Modal 
          setOpenModal={setModalOpen} 
          title={modalTitle} 
          bodytext={modalBodytext}
          onConfirm={patternToggle}
        />
      )}

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
                placeholder={"Pesquisar Padão"}
              />

             

              <div className="patternlist-filter">
                <img alt="" src={Filter} className="patternlist-filter"></img>
              
                <div className="patternlist-filter-dropdown-container">
                  <div className="patternlist-dropdown-filter">
                    <Link to="#" onClick={() => setFilter('all')}>Todas</Link>
                    <Link to="#" onClick={() => setFilter('active')}>Ativas</Link>
                    <Link to="#" onClick={() => setFilter('deactivated')}>Desativas</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {filteredPatterns.map(pattern => (
            <div key={pattern.id} className="patternlist-pattern" style={{ color: pattern.ativo ? '' : 'gray' }}>
              
              <div className="patternlist-model">
                <h4>
                  <span 
                    onClick={()=>{navigate("/visualizarpadrao", {state:pattern})}}
                    style={{ color: pattern.ativo ? '' : 'gray' }}
                   >
                    Padrão: {pattern.marca} - {pattern.modelo}- {pattern.tipo}
                   </span>
                </h4>
                {!pattern.ativo && <h5>Desativado</h5>}
              </div>
              
              <div className="patternlist-engine">
                <img alt="" src={Engine}/>
                <div className="patternlist-engine-dropdown">
                    <div  className="patternlist-pattern-dropdown">
                      {pattern.ativo
                        ? <Link to="#" tabIndex="0" onClick={() => modalDeactivatePattern(pattern)}>Desativar</Link>
                        : <Link to="#" tabIndex="0" onClick={() => modalActivePattern(pattern)}>Ativar</Link>
                      }
                      <button onClick={()=>{navigate("/editarpadrao",{state:pattern})}}>editar</button>
                    </div>
                </div> 
              </div>
            </div>
          ))
          }
        </div>
      </>
    </>
  );
}
