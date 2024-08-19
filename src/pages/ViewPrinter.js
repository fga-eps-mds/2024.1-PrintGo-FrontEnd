import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../style/pages/viewPrinter.css';
import Navbar from "../components/navbar/Navbar";
import ViewDataContainer from "../components/containers/ViewDataContainer";
import SmallInfoCard from "../components/cards/SmallInfoCard.js";
import BigInfoCard from "../components/cards/BigInfoCard.js";
import Button from "../components/Button.js";
import { getPrinterById, generatePrinterPDF } from '../services/printerService.js';
import { toast } from "react-toastify";

export default function ViewPrinter() {

    const [printerData, setPrinterData] = useState({
        numContrato: '',
        numSerie: '',
        enderecoIp: '',
        estaNaRede: false,
        dataInstalacao: '',
        dataRetirada: null,
        ativo: false,
        contadorInstalacaoPB: 0,
        contadorInstalacaoCor: 0,
        contadorAtualPB: 0,
        contadorAtualCor: 0,
        contadorRetiradaPB: 0,
        contadorRetiradaCor: 0,
        localizacao: '',
        modeloId: '',
        cidade: '',
        regional: '',
        subestacao: ''
    });

    const { id } = useParams()

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getPrinterById(id);
                if (response.type === 'success') {
                    const { localizacao, ...restData } = response.data;
                    const [cidade, regional, subestacao] = localizacao.split(';');
                    console.log(restData.dataInstalacao);

                    setPrinterData({
                        ...restData,
                        cidade: cidade || '',
                        regional: regional || '',
                        subestacao: subestacao || ''
                    });
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [id]);

    const dataRetiradaClass = printerData.status === "Ativo" ? "inactive-field" : "";

    // Labels dos campos de informação
    const infoLabels = {
        equipamento: "Equipamento",
        numeroSerie: "Número de série",
        modelo: "Modelo",
        localizacao: "Localização",
        contrato: "Contrato",
        enderecoIp: "Endereço IP",
        dentroDaRede: "Dentro da rede",
        dataInstalacao: "Data de instalação",
        dataRetirada: "Data de retirada",
        status: "Status",
        marca: "Marca",
        cidade: "Cidade",
        regional: "Posto de trabalho",
        subestacao: "Subposto de trabalho"
    };

    const handleExitForm = () => {
        navigate('/impressorascadastradas');
    };

    const handleEditButton = () => {
        window.location = `/editimpressora/${id}`
    };

    const formatDate = (date) => {
        if (!date) return '';
        return (date.split('T')[0]);
    }

    const handleReportGenerate = async () => {
        try {
            const response = await generatePrinterPDF(id);
            if (response.type === 'error') {
                throw new Error(response.error);
            }
            toast.success('PDF gerado com sucesso!');
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            toast.error('Erro ao gerar PDF!');
        }
    };


    return (
        <>
            <Navbar />
            <div id="view-printer-data">
                <div className="header-container">
                    <span className="form-title">Visualizar Equipamento</span>
                    <div className="info-cards-container" style={{ gap: '2rem' }}>
                        <SmallInfoCard
                            className="grey-info-card"
                            title="Último Relatório"
                            imageSrc={require('../assets/green-calendar.png')}
                            info="06/08/2024"
                        />
                        <SmallInfoCard
                            className="grey-info-card"
                            title="Tempo Ativo"
                            imageSrc={require('../assets/green-calendar.png')}
                            info="20 dias"
                        />
                        <SmallInfoCard
                            className="blue-info-card"
                            title="Versão do Firmware"
                            imageSrc={require('../assets/processor.png')}
                            info="1.9.2"
                        />
                    </div>
                </div>
                <div className="printer-field">
                    <div className='info-field'>
                        <ViewDataContainer
                            id="nserie-equipamento"
                            className="large-view"
                            labelName={infoLabels.numeroSerie}
                            value={printerData.numSerie}
                        />

                        <ViewDataContainer
                            id="modelo-equipamento"
                            className="large-view"
                            labelName={infoLabels.modelo}
                            value={printerData.modeloId}
                        />

                        <ViewDataContainer
                            id="contrato-equipamento"
                            className="large-view"
                            labelName={infoLabels.contrato}
                            value={printerData.numContrato}
                        />

                        <div className="container" style={{ gap: '5rem' }}>
                            <ViewDataContainer
                                id="ip-equipamento"
                                className="large-view"
                                labelName={infoLabels.enderecoIp}
                                value={printerData.enderecoIp}
                            />

                            <ViewDataContainer
                                id="rede-equipamento"
                                className="small-view"
                                labelName={infoLabels.dentroDaRede}
                                value={printerData.estaNaRede ? "Sim" : "Não"}
                            />
                        </div>

                        <ViewDataContainer
                            id="data-instalacao-equipamento"
                            className="large-view"
                            labelName={infoLabels.dataInstalacao}
                            value={formatDate(printerData.dataInstalacao)}
                        />

                        <div className="container" style={{ gap: '5rem' }}>
                            <ViewDataContainer
                                id="data-retirada-equipamento"
                                className={`large-view ${dataRetiradaClass}`}
                                labelName={infoLabels.dataRetirada}
                                value={printerData.dataRetirada ? new Date(printerData.dataRetirada).toLocaleString() : "Equipamento ainda ativo"}
                            />

                            <ViewDataContainer
                                id="status-equipamento"
                                className="small-view"
                                labelName={infoLabels.status}
                                value={printerData.ativo ? "Ativo" : "Inativo"}
                            />
                        </div>
                    </div>
                    <div className='cards-field'>
                        <Button
                            type="success"
                            size="adaptive"
                            text="Gerar Relatório"
                            onClick={handleReportGenerate}
                        />                    
                        <BigInfoCard
                            title="Impressões totais"
                            info={printerData.contadorAtualPB + printerData.contadorAtualCor}
                        />
                        <BigInfoCard
                            title="Contador Atual"
                            info={printerData.contadorInstalacaoCor + printerData.contadorInstalacaoPB}
                        />
                        <BigInfoCard
                            title="Impressões Preto e Branco"
                            info={printerData.contadorAtualPB}
                        />
                        <BigInfoCard
                            title="Impressões Coloridas"
                            info={printerData.contadorAtualCor}
                        />
                        <BigInfoCard
                            title="Digitalizações totais"
                            info="80"
                        />
                    </div>
                </div>

                <div className="form-separator"> Localização </div>
                <div className="container" style={{ gap: '5rem' }}>
                    <ViewDataContainer
                        id="cidade-equipamento"
                        className={`medium-view`}
                        labelName={infoLabels.cidade}
                        value={printerData.cidade}
                    />

                    <ViewDataContainer
                        id="regional-equipamento"
                        className="medium-view"
                        labelName={infoLabels.regional}
                        value={printerData.regional}
                    />

                    <ViewDataContainer
                        id="subestacao-equipamento"
                        className="medium-view"
                        labelName={infoLabels.subestacao}
                        value={printerData.subestacao}
                    />
                </div>
                <div className="space"></div>
                <div className="container">
                    <Button
                        type="success"
                        size="medium"
                        text="Editar"
                        onClick={handleEditButton}
                    />

                    <Button
                        type="info"
                        size="medium"
                        text="Acessar Lista de Equipamentos"
                        onClick={handleExitForm}
                    />
                </div>

                <div className="space"></div>
            </div>
        </>
    );
}
