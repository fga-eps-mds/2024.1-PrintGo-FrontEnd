import React, { useState, useMemo, useEffect } from "react";
import "../style/pages/printersList.css";
import { Link } from "react-router-dom";
import Search from '../assets/Search.svg';
import Filter from '../assets/Filter.svg';
import engine from '../assets/engine.svg';
import Input from '../components/Input'; 
import Modal from '../components/ui/Modal';
import Navbar from "../components/navbar/Navbar";
import { getPrinters, togglePrinter } from "../services/printerService";
import { extractDate } from "../utils/utils";
import { toast } from "react-toastify";

const mockPrinters = [
  {
    id: 1,
    codigoLocadora: "LOC123",
    ip: "192.168.1.10",
    padrao: { marca: "HP", tipo: "LaserJet", modelo: "P1102" },
    numeroSerie: "SN123456",
    status: "ATIVO",
    contadorInstalacao: 1500,
    dataUltimoContador: "2024-06-15"
  },
  {
    id: 2,
    codigoLocadora: "LOC124",
    ip: "192.168.1.11",
    padrao: { marca: "Canon", tipo: "InkJet", modelo: "MG2522" },
    numeroSerie: "SN654321",
    status: "DESATIVADO",
    contadorInstalacao: 200,
    dataUltimoContador: "2024-06-16"
  }
];

export default function PrintersList() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBodytext, setModalBodytext] = useState('');
  const [selectedPrinter, setSelectedPrinter] = useState(null);
  const [printers, setPrinters] = useState([]);

  useEffect( () => {
    async function fetchData() {
        try {
            const [dataPrinters] = await Promise.all([
                getPrinters()
            ]) 
            if (dataPrinters.type ==='success' && dataPrinters.data) {
              setPrinters(dataPrinters.data);
              console.log(dataPrinters.data);
            }
        } catch (error) {
            console.error('Erro ao obter lista de impressoras:', error);
          }
    }
    fetchData();
    setPrinters(mockPrinters);
  }, []);

  const modalTogglePrinter = (printer) => {
    setSelectedPrinter(printer);
    setModalTitle(printer.status === 'ATIVO' ? "Desativação de impressora": "Ativação de impressora");
    setModalBodytext(`Você tem certeza que deseja ${printer.status === 'ATIVO' ? 'desativar' : 'ativar'} a impressora?`);
    setModalOpen(true);
  }

  async function changePrinterStatus() {
    const data = await togglePrinter(selectedPrinter.id, selectedPrinter.status);
    if (data.type === 'success') {
      toast.success("Status da impressora alterado com sucesso!");
      const printer = printers.find(printer => printer.id === selectedPrinter.id);
      printer.status === 'ATIVO' ? printer.status = 'DESATIVADO' : printer.status = 'ATIVO';
    } else {
      toast.error("Não foi possível alterar status da impressora! Por favor, tente novamente.");
    }
    setModalOpen(false);
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

  //filtros para busca de impressora
  const filteredPrinters = useMemo(() => {
    return printers.filter(printer => {
     
      const searchLower = search.toLowerCase();
      const {
        codigoLocadora,
        ip,
        padrao,
        numeroSerie,
      } = printer;
  
      return (
        search === '' ||
        codigoLocadora?.toLowerCase().includes(searchLower) ||
        ip.toLowerCase().includes(searchLower) ||
        padrao.modelo.toLowerCase().includes(searchLower) ||
        numeroSerie.toLowerCase().includes(searchLower)
      );
    }).filter(printer => {
      return filter === 'all' ||
             (filter === 'active' && printer.status === "ATIVO") ||
             (filter === 'deactivated' && printer.status === "DESATIVADO");
    });
  }, [printers, search, filter]);

  return (
    <>
      {modalOpen && (
        <Modal 
          setOpenModal={setModalOpen} 
          title={modalTitle} 
          bodytext={modalBodytext}
          onConfirm={changePrinterStatus}
        />
      )}

      <>
        <Navbar />

        <div className="printerslist-container">

          <div className="printerslist-header">
            <div className="printerslist-header-title">
              <h2>Impressoras cadastradas</h2>
              <h4 data-testid="filter_beign_shown">{filterBeingShown(filter)}</h4>
            </div>

            <div className="printerslist-header-search-filter">
              <Input 
                onChange={(e) => setSearch(e.target.value)} 
              />
              <img alt="Search" src={Search} />
              
              <div className="printerslist-filter">
                <img alt="Filter" src={Filter} />
                <div className="printerslist-filter-dropdown-container">
                  <div className="printerslist-dropdown-filter">
                    <Link to="#" onClick={() => setFilter('all')}>Todas</Link>
                    <Link to="#" onClick={() => setFilter('active')}>Ativas</Link>
                    <Link to="#" onClick={() => setFilter('deactivated')}>Desativadas</Link>
                  </div>
                </div>
              </div> 
            </div>
          </div>

          {filteredPrinters.length > 0 ? filteredPrinters.map(printer => (
            <div 
              key={printer.id} 
              className="printerslist-printer" 
              style={{ color: printer.status === "ATIVO" ? '' : 'gray' }}
            >
              
              <div className="printerslist-model">
                <Link 
                  to={`/visualizarimpressora/${encodeURIComponent(btoa(JSON.stringify(printer)))}`}
                  style={{ color: printer.status === "ATIVO" ? '' : 'gray' }}
                >
                  {`${printer.padrao.marca} ${printer.padrao.tipo} ${printer.padrao.modelo}`}
                </Link>
                {printer.status === 'DESATIVADO' && <h5>Desativada</h5>}
              </div>
              
              <div className="printerslist-identification" style={{ color: printer.status === "ATIVO" ? '' : 'gray' }}> 
                <h6>S/N: {printer.numeroSerie}</h6>
                <h6>IP: {printer.ip}</h6>
                <h6>{printer.codigoLocadora}</h6> 
              </div>
              
              <div className="printerslist-location-counter" style={{ color: printer.status === "ATIVO" ? '' : 'gray' }}>
                <h6>{printer.contadorInstalacao}</h6>
              </div>
              
              <div className="printerslist-counter-date" style={{ color: printer.status === "ATIVO" ? '' : 'gray' }}>
                <h6>Data do último contador: {extractDate(printer.dataUltimoContador)}</h6>
              </div>
              
              <div className="printerslist-engine">
                <img alt="" src={engine} />
                <div tabIndex="0" className="printerslist-engine-dropdown">
                  <div className="printerslist-printer-dropdown">
                    <Link to="#" tabIndex="0" onClick={() => modalTogglePrinter(printer)}>{printer.status === "ATIVO" ? 'Desativar' : 'Ativar'}</Link>
                    <Link to={`/editarimpressora/${btoa(JSON.stringify(printer))}`} tabIndex="0">Editar</Link>
                  </div>
                </div> 
              </div>
            </div>
          )) : (
            <p className="no-results">Nenhum resultado encontrado</p>
          )}
        </div>
      </>
    </>
  );
}
