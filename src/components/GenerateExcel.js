import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx/xlsx.mjs";
import { getPrinters } from "../services/printerService";

export default function GenerateExcel() {
  const [printers, setPrinters] = useState([]);

  const fetchPrinters = async () => {
    const res = await getPrinters();
    setPrinters(res.data);
  };

  const handleGenerateExcel = () => {
    printers.forEach((printer) => {
      delete printer.id;
      delete printer.enderecoIp;
      delete printer.modeloId;

      printer.dataInstalacao = new Date(
        printer.dataInstalacao
      ).toLocaleDateString();

      printer.dataRetirada = new Date(
        printer.dataRetirada
      ).toLocaleDateString();
    });

    console.log(printers);
    const workSheet = XLSX.utils.json_to_sheet(printers);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "Relatório");

    XLSX.utils.sheet_add_aoa(
      workSheet,
      [
        [
          "Contrato",
          "Nº de Serie",
          "Na rede",
          "Data instalação",
          "Data retirada",
          "Data Contador",
          "Ativo",
          "Contador Instalacao PB",
          "Contador Instalacao CL",
          "Contador Atual PB",
          "Contador Atual CL",
          "Contador Retirada PB",
          "Contador Retirada CL",
          "Localização",
        ],
      ],
      { origin: "A1" }
    );
    XLSX.writeFile(workBook, "Relatório.xlsx", { compression: true });
  };

  useEffect(() => {
    fetchPrinters();
  }, []);
  return <button onClick={handleGenerateExcel}>Gerar Relatório Geral</button>;
}
