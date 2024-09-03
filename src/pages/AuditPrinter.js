import React, { useEffect, useState } from 'react';
import '../style/pages/viewPrinter.css';
import Navbar from "../components/navbar/Navbar";
import NumberContainer from '../components/containers/NumberContainer.js';
import SelectContainer from '../components/containers/SelectContainer.js';
import '../style/pages/auditPrinter.css';
import AuditBox from '../components/containers/AuditBox.js';
import Button from '../components/Button.js';
import { getContract } from "../services/contractService.js";
import { getPrintersByContract, generatePrinterPDF } from "../services/printerService.js";
import { toast } from "react-toastify";
import UploadReport from '../components/UploadReport.js';
import GenerateExcel from '../components/GenerateExcel.js';

export default function AuditPrinter() {
    const [relatorioLocadora, setRelatorioLocadora] = useState(null);
    const [contratos, setContratos] = useState([]);
    const [selectedContrato, setSelectedContrato] = useState('');
    const [printers, setPrinters] = useState([]);
    const [marginError, setMarginError] = useState(0);
    const [uploadReport, setUploadReport] = useState(false);
    let relatorio = null;

    useEffect(() => {
        const fetchContratos = async () => {
            try {
                const response = await getContract();
                const data = response.data.data.map(c => c.numero);
                setContratos(data);
            } catch (error) {
                console.error('Erro ao buscar contratos:', error);
            }
        };

        fetchContratos();
    }, []);

    const handleContratoChange = async (event) => {
        const contract = event.target.value;
        setSelectedContrato(contract);
        if (contract) {
            await fetchPrinters(contract);
        } else {
            setPrinters([]);
        }
    };

    const handleGeneratePrinterPDF = (printerId) => async () => {
        try {
            const response = await generatePrinterPDF(printerId);
            if (response.type === 'error') {
                throw new Error(response.error);
            }
            toast.success('PDF gerado com sucesso!');
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            toast.error('Erro ao gerar PDF!');
        }
    };

    const fetchPrinters = async (contract) => {
        try {
            const response = await getPrintersByContract(contract);
            if (response.type === 'error') {
                throw new Error(response.error);
            }
            setPrinters(response.data.data);
        } catch (error) {
            console.error('Erro ao buscar impressoras:', error);
            toast.error('Erro ao buscar impressoras!');
        }
    };

    const handleFileUpload = (data) => {
        setUploadReport(false);

        const mapBySerialNumber = data.reduce((acc, item) => {
            if (item.serialnumber) {
                acc[item.serialnumber] = item;
            }
            return acc;
        }, {});

        setRelatorioLocadora(mapBySerialNumber);
        toast.success('Arquivo carregado com sucesso!');
    };

    return (
        <>
            <Navbar />
            <div className='page'>
                <div className='header'>
                    <h1 className="titulo">Auditoria</h1>
                    <div className='search-bar container'>
                        <NumberContainer
                            id="contadorInstalacaoPB"
                            name="contadorInstalacaoPB"
                            value={marginError}
                            onChange={(event) => event.target.value >= 0 ? setMarginError(event.target.value) : 0}
                            className="md-select search-number-select"
                            label="Margem de erro"
                        />
                        <SelectContainer
                            id="contrato"
                            name="contrato"
                            options={contratos}
                            className="lg-select search-select"
                            label="Contrato"
                            onChange={handleContratoChange}
                            value={selectedContrato}
                            containerStyle="search-select"
                        />
                        <div className='search-button'>
                            <Button
                                text="Adicionar relatório locadora"
                                onClick={() => setUploadReport(true)}
                                type="info"
                                size="large"
                            />
                        </div>
                        <div className='excel-button'>
                            <GenerateExcel/>
                        </div>                     
                    </div>
                </div>

                {selectedContrato ? (
                    printers.length > 0 ? (
                        relatorioLocadora !== null ? (
                            <div>
                                <div className='columns'>
                                    <h2 className='audit-element'>Equipamentos</h2>
                                    <div className='counters-color'>
                                        <h2 className='audit-counter-color'>Cont. Cor PrintGo</h2>
                                        <div className='audit-counter-color-months'>
                                            <h2 className='audit-counter-color-month'>anterior</h2>
                                            <h2 className='audit-counter-color-month' id='counter-color-current'>atual</h2>
                                        </div>
                                    </div>
                                    <div className='counters-pb'>
                                        <h2 className='audit-counter-pb'>Cont. PB PrintGo</h2>
                                        <div className='audit-counter-pb-months'>
                                            <h2 className='audit-counter-pb-month'>anterior</h2>
                                            <h2 className='audit-counter-pb-month' id='counter-pb-current'>atual</h2>
                                        </div>
                                    </div>
                                    <h2 className='audit-element'>Tot.Impressões PrintGo Cor</h2>
                                    <h2 className='audit-element'>Tot.Impressões PrintGo PB</h2>
                                    <h2 className='audit-element'>Cont.PB Relatório</h2>
                                    <h2 className='audit-element'>Cont.Cor Relatório</h2>
                                    <h2 className='audit-element'>Tot.Impressões Relatório</h2>
                                    <h2 className='audit-element'>Relatório do PrintGO</h2>
                                </div>
                                <div className='container-auditbox'>
                                    {printers.map(printer => {
                                        relatorio = relatorioLocadora[printer.numSerie] || {};

                                        relatorio.actualColorCounter = relatorio.actualColorCounter || 0;
                                        relatorio.actualMonoCounter = relatorio.actualMonoCounter || 0;
                                        relatorio.endTotalCounter = relatorio.endTotalCounter || 0;

                                        return (
                                            <AuditBox
                                                key={printer.id}
                                                equipamento={printer.numSerie}
                                                contadorCor={printer.contadorAtualCor}
                                                contadorCorAnterior={printer.relatorio.contadorCor}
                                                contadorPB={printer.contadorAtualPB}
                                                contadorPBAnterior={printer.relatorio.contadorPB}
                                                contadorLocPB={relatorio.actualColorCounter}
                                                contadorLocCor={relatorio.actualMonoCounter}
                                                totPrintgoPB={printer.contadorAtualPB  - printer.relatorio.contadorPB}
                                                totPrintgoCor={printer.contadorAtualCor - printer.relatorio.contadorCor}
                                                totLoc={relatorio.endTotalCounter}
                                                onClick={handleGeneratePrinterPDF(printer.id)}
                                                marginError={marginError}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h2>Por favor, adicione o relatório da locadora</h2>
                            </div>
                        )
                    ) : (
                        <div>
                            <h2>Por favor, selecione outro contrato ou verifique se o contrato possui impressoras cadastradas</h2>
                        </div>
                    )
                ) : (
                    <div>
                        <h2>Por favor, selecione um contrato</h2>
                    </div>
                )}

                <UploadReport
                    isOpen={uploadReport}
                    onClose={() => setUploadReport(false)}
                    onUpload={handleFileUpload}
                />
            </div>
        </>
    )
}
