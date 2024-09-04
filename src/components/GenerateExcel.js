import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { getPrinters } from "../services/printerService";
import { toast } from "react-toastify";

export default function GenerateExcel() {
  const [printers, setPrinters] = useState([]);

  const fetchPrinters = async () => {
    const res = await getPrinters();
    setPrinters(res.data);
  };

  const handleGenerateExcel = () => {
    try {
      const formattedPrinters = printers.map((printer) => {
        return {
          contrato: printer.numContrato,
          numeroSerie: printer.numSerie,
          estaNaRede: printer.estaNaRede ? "Sim" : "Não",
          dataInstalacao: new Date(printer.dataInstalacao).toLocaleDateString(),
          dataRetirada: printer.dataRetirada ? new Date(printer.dataRetirada).toLocaleDateString() : "N/A",
          dataContador: printer.dataContador ? new Date(printer.dataContador).toLocaleDateString() : "N/A",
          ativo: printer.ativo ? "Sim" : "Não",
          contadorInstalacaoPB: printer.contadorInstalacaoPB,
          contadorRetiradaPB: printer.contadorRetiradaPB,
          contadorInstalacaoCL: printer.contadorInstalacaoCor,
          contadorRetiradaCL: printer.contadorRetiradaCor,
          contadorPBAnterior: printer.relatorio?.contadorPB || 0,
          contadorPBAtual: printer.contadorAtualPB,
          contadorCLAnterior: printer.relatorio?.contadorCor || 0,
          contadorCLAtual: printer.contadorAtualCor,
          totPrintgoPB: printer.contadorAtualPB - printer.relatorio?.contadorPB || 0,
          totPrintgoCL: printer.contadorAtualCor - printer.relatorio?.contadorCor || 0,
          localizacao: printer.localizacao,
        };
      });

      console.log(formattedPrinters);
      const workSheet = XLSX.utils.json_to_sheet(formattedPrinters);
      const workBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workBook, workSheet, "Relatório");

      XLSX.utils.sheet_add_aoa(
        workSheet,
        [
          [
            "Contrato",
            "Nº de Serie",
            "Na Rede",
            "Data Instalação",
            "Data Retirada",
            "Data Contador",
            "Ativo",
            "Contador Instalacao PB",
            "Contador Retirada PB",
            "Contador Instalacao CL",
            "Contador Retirada CL",
            "Contador PB Anterior",
            "Contador PB Atual",
            "Contador CL Anterior",
            "Contador CL Atual",
            "Total PrintGo PB",
            "Total PrintGo CL",
            "Localização",
          ],
        ],
        { origin: "A1" }
      );

      workSheet["!cols"] = [  //Tamanho das colunas
        { wch: 15 },          // Contrato
        { wch: 20 },          // Nº de Serie
        { wch: 10 },          // Na Rede
        { wch: 15 },          // Data Instalação
        { wch: 15 },          // Data Retirada
        { wch: 15 },          // Data Contador
        { wch: 10 },          // Ativo
        { wch: 20 },          // Contador Instalacao PB
        { wch: 20 },          // Contador Retirada PB
        { wch: 20 },          // Contador Instalacao CL
        { wch: 20 },          // Contador Retirada CL
        { wch: 20 },          // Contador PB Anterior
        { wch: 20 },          // Contador PB Atual
        { wch: 20 },          // Contador CL Anterior
        { wch: 20 },          // Contador CL Atual
        { wch: 20 },          // Total PrintGo PB
        { wch: 20 },          // Total PrintGo CL
        { wch: 25 },          // Localização
      ];

      XLSX.writeFile(workBook, "Relatório.xlsx", { compression: true });
      toast.success('Relatório gerado com sucesso!');

    } catch (error) {
      console.error(error);
      toast.error('Falha ao gerar relatório excel');
    }
  };

  useEffect(() => {
    fetchPrinters();
  }, []);
  return <button onClick={handleGenerateExcel}>Gerar Relatório Geral</button>;
}
