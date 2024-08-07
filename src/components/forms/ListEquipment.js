import React, { useEffect, useState } from "react";
import ItemBox from "../containers/ItemBox";
import { getPrinters } from "../../services/printerService";
import "../../style/components/listEquipment.css";
import { FaWindows } from "react-icons/fa6";
import Navbar from "../navbar/Navbar";

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
