import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { getPrinters } from "../services/printerService";
import { toast } from "react-toastify";

// Função que formata os dados das impressoras
export const handleGenerateExcel = (printers) => {
  return printers.map((printer) => ({
    contrato: printer.numContrato,
    numeroSerie: printer.numSerie,
    estaNaRede: printer.estaNaRede ? "Sim" : "Não",
    dataInstalacao: printer.dataInstalacao ? new Date(printer.dataInstalacao).toLocaleDateString() : "N/A",
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
  }));
};

// Função que gera o arquivo Excel
export const generateExcelFile = (printers) => {
  try {
    const formattedPrinters = handleGenerateExcel(printers); // Usa a função para formatar os dados

    const workSheet = XLSX.utils.json_to_sheet(formattedPrinters);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "Relatório");

    XLSX.writeFile(workBook, "Relatório.xlsx", { compression: true });
    toast.success('Relatório gerado com sucesso!');
  } catch (error) {
    console.error(error);
    toast.error('Falha ao gerar relatório excel');
  }
};

// Componente React que chama as funções
export default function GenerateExcel() {
  const [printers, setPrinters] = useState([]);

  const fetchPrinters = async () => {
    const res = await getPrinters();
    setPrinters(res.data);
  };

  useEffect(() => {
    fetchPrinters();
  }, []);

  return <button onClick={() => generateExcelFile(printers)}>Gerar Relatório Geral</button>;
}
