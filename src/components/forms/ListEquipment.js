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
      const { numeroSerie, padrao } = printer;
      const matchesSearch = search === "" || numeroSerie.toLowerCase().includes(searchLower);
      const matchesEquipment = selectedEquipment === "" || padrao.tipo === selectedEquipment; // Adicionado filtro de Equipamento
      const matchesModel = selectedModel === "" || padrao.modelo === selectedModel; // Adicionado filtro de Modelo
      return matchesSearch && matchesEquipment && matchesModel;
    });
  }, [printers, search, selectedEquipment, selectedModel]); // Adicionado selectedEquipment e selectedModel

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

      {/* Adicionado filtros de Equipamento e Modelo */}
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
              {/* Adicione outras opções conforme necessário */}
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
              {/* Adicione outras opções conforme necessário */}
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
    </>
  );
};

export default ListEquipment;
