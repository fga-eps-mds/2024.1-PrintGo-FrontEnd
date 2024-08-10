import React, { useEffect, useMemo, useState } from "react";
import ItemBox from "../containers/ItemBox";
import {
  editImpressora,
  getPrinters,
  togglePrinter,
} from "../../services/printerService";
import "../../style/components/listEquipment.css";
import Navbar from "../navbar/Navbar";
import Search from "../../assets/Search.svg";
import Input from "../Input";
import { useNavigate } from "react-router-dom";

const ListEquipment = () => {
  const [search, setSearch] = useState("");
  const [printers, setPrinters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState(""); // Adicionado para filtro de Equipamento
  const [selectedModel, setSelectedModel] = useState(""); // Adicionado para filtro de Modelo
  const [selectedSerialNumber, setSelectedSerialNumber] = useState(""); // Adicionado para filtro de Número de Série
  const [selectedLocation, setSelectedLocation] = useState(""); // Adicionado para filtro de Localização

  const navigate = useNavigate();

  useEffect(() => {
    verprinter();
    setLoading(false);
  }, []);

  const verprinter = async () => {
    const response = await getPrinters();
    if (response.type === "success") {
      setPrinters(response.data);
    } else {
      setError(response.error);
    }
  };

  const filteredPrinters = useMemo(() => {
    return printers.filter((printer) => {
      const searchLower = search.toLowerCase();
      const { numSerie, modeloId, localizacao } = printer;
      const matchesSearch =
        search === "" || numSerie.toLowerCase().includes(searchLower);
      const matchesEquipment =
        selectedEquipment === "" || numSerie === selectedEquipment; // Adicionado filtro de Equipamento
      const matchesModel = selectedModel === "" || modeloId === selectedModel; // Adicionado filtro de Modelo
      const matchesSerialNumber =
        selectedSerialNumber === "" || numSerie === selectedSerialNumber; // Adicionado filtro de Número de Série
      const matchesLocation =
        selectedLocation === "" || localizacao === selectedLocation; // Adicionado filtro de Localização
      return (
        matchesSearch &&
        matchesEquipment &&
        matchesModel &&
        matchesSerialNumber &&
        matchesLocation
      );
    });
  }, [
    printers,
    search,
    selectedEquipment,
    selectedModel,
    selectedSerialNumber,
    selectedLocation,
  ]); // Adicionado selectedSerialNumber e selectedLocation

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
              {printers.map((printer) => (
                <option value={printer.numSerie} key={printer.id}>
                  {printer.numSerie}
                </option>
              ))}
            </select>
          </div>
          <div className="filter">
            <label>Modelo</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              <option value="">Todos</option>
              {printers.map((printer) => (
                <option value={printer.modelo} key={printer.id}>
                  {printer.modeloId}
                </option>
              ))}
            </select>
          </div>
          <div className="filter">
            {" "}
            {/* Adicionado filtro de Número de Série */}
            <label>Número de Série</label>
            <select
              value={selectedSerialNumber}
              onChange={(e) => setSelectedSerialNumber(e.target.value)}
            >
              <option value="">Todos</option>
              {printers.map((printer) => (
                <option value={printer.numSerie} key={printer.id}>
                  {printer.numSerie}
                </option>
              ))}
            </select>
          </div>
          <div className="filter">
            {" "}
            {/* Adicionado filtro de Localização */}
            <label>Localização</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">Todos</option>
              {printers.map((printer) => (
                <option value={printer.localizacao} key={printer.id}>
                  {printer.localizacao}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="equipment-list">
          {filteredPrinters.map((printer) => (
            <ItemBox
              key={printer.id}
              label={printer.numSerie}
              onEditClick={() =>
                navigate(`/visualizarimpressora/${printer.id}`)
              }
              printer={printer}
            />
          ))}
        </div>
      </div>

      {/* Adicionado botão de Cadastrar Novo Equipamento */}
      <div className="add-equipment-button-container">
        <button
          className="add-equipment-button"
          onClick={() => navigate("/cadastroimpressora")}
        >
          Cadastrar Novo Equipamento
        </button>
      </div>
    </>
  );
};

export default ListEquipment;
