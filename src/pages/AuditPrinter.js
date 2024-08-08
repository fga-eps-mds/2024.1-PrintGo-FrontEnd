import React, { useEffect, useState } from 'react';
import '../style/pages/viewPrinter.css';
import Navbar from "../components/navbar/Navbar";
import NumberContainer from '../components/containers/NumberContainer.js';
import SelectContainer from '../components/containers/SelectContainer.js';
import '../style/pages/auditPrinter.css';
import AuditBox from '../components/containers/AuditBox.js';
import { getContract } from "../services/contractService.js";
import { getPrintersByContract, generatePrinterPDF } from "../services/printerService.js";
import { toast } from "react-toastify";

export default function AuditPrinter() {
    const [contratos, setContratos] = useState([]);
    const [selectedContrato, setSelectedContrato] = useState('');
    const [printers, setPrinters] = useState([]);
    const [marginError, setMarginError] = useState(0);

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
            console.log(response.data.data);
            setPrinters(response.data.data);
        } catch (error) {
            console.error('Erro ao buscar impressoras:', error);
            toast.error('Erro ao buscar impressoras!');
        }
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
                            className="md-select search-select"
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
                    </div>
                </div>
                {selectedContrato && (printers.length > 0 ? (
                    <div className='columns'>
                        <h2 className='equipamento'>Equipamentos</h2>
                        <h2 className='cont-atual'>Cont.Atual</h2>
                        <h2 className='cont-loc'>Cont.Locadora</h2>
                        <h2 className='tot-printgo'>Tot.Impressões PrintGo</h2>
                        <h2 className='tot-loc'>Tot.Impressões Locadora</h2>
                        <h2 className='space-report'>Relatório</h2>
                    </div>
                ) : (
                    <div>
                        <h2>Por favor, selecione outro contrato ou verifique se o contrato possui impressoras cadastradas</h2>
                    </div>
                ))}
                <div className='container-auditbox'>
                    {printers.map(printer => {
                        const relatorioLocadora = printer.relatorioLocadora || {
                            contadorPB: 0,
                            contadorCor: 0,
                            contadorTotal: 10
                        };

                        return (
                            <AuditBox
                                key={printer.id}
                                equipamento={printer.numSerie}
                                contadorAtual={printer.contadorAtualPB + printer.contadorAtualCor}
                                contadorLoc={relatorioLocadora.contadorPB + relatorioLocadora.contadorCor}
                                totPrintgo={printer.contadorAtualPB + printer.contadorAtualCor + printer.contadorInstalacaoPB + printer.contadorInstalacaoCor + printer.contadorRetiradaPB + printer.contadorRetiradaCor}
                                totLoc={relatorioLocadora.contadorTotal}
                                onClick={handleGeneratePrinterPDF(printer.id)}
                                marginError={marginError}
                            />
                        );
                    })}
                </div>
            </div>
        </>
    )
}
