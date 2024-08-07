import React, { useEffect, useState } from "react";
import ItemBox from "../containers/ItemBox";
import { getPrinters } from "../../services/printerService";
import "../../style/components/listEquipment.css";
import Navbar from "../navbar/Navbar";
import Search from "../../assets/Search.svg";
import Input from "../Input";

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

  const handleEditClick = (id) => {
    window.location = `/visualizarimpressora/${id}`;
  };

  const handleToggleClick = (id) => {
    console.log(`Toggle button clicked for equipment ID: ${id}`);
  };

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

      <div className="equipment-list">
        {printers.map((printer) => (
          <ItemBox
            key={printer.id}
            label={`Printer ${printer.id}`}
            onEditClick={() => handleEditClick(printer.id)}
            onToggleClick={() => handleToggleClick(printer.id)}
          />
        ))}
      </div>
    </>
  );
};

export default ListEquipment;
