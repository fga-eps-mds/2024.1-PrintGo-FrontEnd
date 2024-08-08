import React, { useEffect, useMemo, useState } from "react";
import ItemBox from "../containers/ItemBox";
import { getPrinters } from "../../services/printerService";
import "../../style/components/listEquipment.css";
import Navbar from "../navbar/Navbar";
import Search from "../../assets/Search.svg";
import Input from "../Input";
import { useNavigate } from "react-router-dom";

const mockPrinters = [
  {
    id: 1,
    codigoLocadora: "LOC123",
    ip: "192.168.1.10",
    padrao: { marca: "HP", tipo: "LaserJet", modelo: "P1102" },
    numeroSerie: "SN123456",
    status: "ATIVO",
    contadorInstalacao: 1500,
    dataUltimoContador: "2024-06-15",
    localizacao: "DF",
  },
  {
    id: 2,
    codigoLocadora: "LOC124",
    ip: "192.168.1.11",
    padrao: { marca: "Canon", tipo: "InkJet", modelo: "MG2522" },
    numeroSerie: "SN654321",
    status: "DESATIVADO",
    contadorInstalacao: 200,
    dataUltimoContador: "2024-06-16",
    localizacao: "Goiás",
  },
];

const ListEquipment = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalBodytext, setModalBodytext] = useState("");
  const [selectedPrinter, setSelectedPrinter] = useState(null);
  const [printers, setPrinters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState(""); // Adicionado para filtro de Equipamento
  const [selectedModel, setSelectedModel] = useState(""); // Adicionado para filtro de Modelo
  const [selectedSerialNumber, setSelectedSerialNumber] = useState(""); // Adicionado para filtro de Número de Série
  const [selectedLocation, setSelectedLocation] = useState(""); // Adicionado para filtro de Localização

  const navigate = useNavigate();

  useEffect(() => {
    /*
    const fetchData = async () => {
      const response = await getPrinters();
      if (response.type === "success") {
        setPrinters(response.data);
      } else {
        setError(response.error || response.data);
      }
      setLoading(false);
    };
 
    fetchData();
    
    */
    setPrinters(mockPrinters);
    setLoading(false);
  }, []);

  const handleToggleClick = (id) => {
    console.log(`Toggle button clicked for equipment ID: ${id}`);
  };

  const filteredPrinters = useMemo(() => {
    return printers.filter((printer) => {
      const searchLower = search.toLowerCase();
      const { numeroSerie, padrao, localizacao } = printer;
      const matchesSearch = search === "" || numeroSerie.toLowerCase().includes(searchLower);
      const matchesEquipment = selectedEquipment === "" || padrao.tipo === selectedEquipment; // Adicionado filtro de Equipamento
      const matchesModel = selectedModel === "" || padrao.modelo === selectedModel; // Adicionado filtro de Modelo
      const matchesSerialNumber = selectedSerialNumber === "" || numeroSerie === selectedSerialNumber; // Adicionado filtro de Número de Série
      const matchesLocation = selectedLocation === "" || localizacao === selectedLocation; // Adicionado filtro de Localização
      return matchesSearch && matchesEquipment && matchesModel && matchesSerialNumber && matchesLocation;
    });
  }, [printers, search, selectedEquipment, selectedModel, selectedSerialNumber, selectedLocation]); // Adicionado selectedSerialNumber e selectedLocation

  if (loading) return <p>Loading...</p>;
  if (error)
    return <p>Error loading data: {error.message || "Unknown error"}</p>;

  return (
    <>
      <Navbar />

      <div className="listEquipment-header">
        <h1>Equipamentos cadastradas</h1>

        <div className="search-filter">
          <Input
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar Equipamento"
          />
          <img alt="Search" src={Search} />
        </div>
      </div>

      {/* Adicionado filtros de Equipamento, Modelo, Número de Série e Localização */}
      <div className="listEquipment-container">
        <div className="filters">
          <div className="filter">
            <label>Equipamento</label>
            <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="LaserJet">LaserJet</option>
              <option value="InkJet">InkJet</option>
              {/* Adicionado de acordo com os dados do mock */}
            </select>
          </div>
          <div className="filter">
            <label>Modelo</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="P1102">P1102</option>
              <option value="MG2522">MG2522</option>
              {/* Adicionado de acordo com os dados do mock */}
            </select>
          </div>
          <div className="filter"> {/* Adicionado filtro de Número de Série */}
            <label>Número de Série</label>
            <select
              value={selectedSerialNumber}
              onChange={(e) => setSelectedSerialNumber(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="SN123456">SN123456</option>
              <option value="SN654321">SN654321</option>
              {/* Adicionado de acordo com os dados do mock */}
            </select>
          </div>
          <div className="filter"> {/* Adicionado filtro de Localização */}
            <label>Localização</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="DF">DF</option>
              <option value="Goiás">Goiás</option>
              {/* Adicionado de acordo com os dados do mock */}
            </select>
          </div>
        </div>

        <div className="equipment-list">
          {filteredPrinters.map((printer) => (
            <ItemBox
              key={printer.id}
              label={printer.numeroSerie}
              onEditClick={() => navigate(`/visualizarimpressora/${printer.id}`)}
              onToggleClick={() => handleToggleClick(printer.id)}
            />
          ))}
        </div>
      </div>
      
      {/* Adicionado botão de Cadastrar Novo Equipamento */}
      <div className="add-equipment-button-container">
        <button className="add-equipment-button" onClick={() => navigate('/cadastroimpressora')}>
          Cadastrar Novo Equipamento
        </button>
      </div>
    </>
  );
};

export default ListEquipment;
