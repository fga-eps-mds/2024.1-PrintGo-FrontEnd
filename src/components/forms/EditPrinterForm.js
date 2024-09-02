import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../style/pages/viewPrinter.css';
import "../../style/components/registerPrinterForms.css";
import ViewDataContainer from '../containers/ViewDataContainer.js';
import SmallInfoCard from '../cards/SmallInfoCard.js';
import BigInfoCard from '../cards/BigInfoCard.js';
import Button from '../Button.js';
import { getPrinterById } from '../../services/printerService.js';
import InputContainer from '../containers/InputContainer.js';
import SelectContainer from '../containers/SelectContainer.js';
import { getLocalizacao, editImpressora } from "../../services/printerService";
import { getContract } from "../../services/contractService";
import { getPadroes } from "../../services/patternService";
import DateContainer from '../containers/DateContainer.js';
import { toast } from "react-toastify";
import NumberContainer from '../containers/NumberContainer';


export default function EditPrinterForm() {

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
    const [localizacoes, setLocalizacoes] = useState([]);
    const [marcasData, setMarcasData] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [modelos, setModelos] = useState([]);
    const [selectedModelo, setSelectedModelo] = useState('');
    const [selectedMarca, setSelectedMarca] = useState('');
    const [contratos, setContratos] = useState([]);
    const yesNo = ["Sim", "Não"];
    const [selectedCidade, setSelectedCidade] = useState('');
    const [workstations, setWorkstations] = useState([]);
    const [selectedWorkstation, setSelectedWorkstation] = useState('');
    const [subWorkstations, setSubWorkstations] = useState([]);
    const [selectedSubWorkstation, setSelectedSubWorkstation] = useState('');
    const [errors, setErrors] = useState({});

    const { id } = useParams()

    useEffect(() => {
        const fetchLocalizacoes = async () => {
            try {
                const response = await getLocalizacao();
                setLocalizacoes(response.data);
            } catch (error) {
                console.error('Erro ao buscar localizações:', error);
            }
        };

        const fetchMarcas = async () => {
            try {
                const response = await getPadroes();
                setSelectedModelo(printerData.modeloId);
                setMarcasData(response.data);

                const marcas = response.data.map(m => m.marca);
                const modelos = response.data.map(m => m.modelo);

                if (printerData.modeloId) {
                    const selectedMarca = response.data.find(m => m.modelo === printerData.modeloId)?.marca;
                    setSelectedMarca(selectedMarca);
                }

                setMarcas(marcas);
                setModelos(modelos);
            } catch (error) {
                console.error('Erro ao buscar padrões:', error);
            }
        };

        const fetchContratos = async () => {
            try {
                const response = await getContract();
                const data = response.data.data.map(c => c.numero);
                setContratos(data);
            } catch (error) {
                console.error('Erro ao buscar contratos:', error);
            }
        };
        const fetchData = async () => {
            const response = await getPrinterById(id);

            if (response.type === 'success') {
                const { localizacao, ...restData } = response.data;
                const [cidade, regional, subestacao] = localizacao.split(';');

                setPrinterData(restData);
                setSelectedCidade(cidade);
                setSelectedWorkstation(regional);
                setSelectedSubWorkstation(subestacao);

                const cidadeData = localizacoes.find(loc => loc.name === cidade);
                const regionalData = cidadeData?.workstations.find(ws => ws.name === regional);
                const subestacoes = regionalData?.child_workstations.map(child => child.name) || [];

                setSubWorkstations(subestacoes);
            }
        };

        fetchData();
        fetchMarcas();
        fetchContratos();
        fetchLocalizacoes();
    }, [id, printerData.modeloId]);

    const handleNumSerieChange = (newNumSerie) => {
        setPrinterData((prevData) => ({
            ...prevData,
            numSerie: newNumSerie,
        }));
    };

    const handleContratoChange = (event) => {
        const newNumContrato = event.target.value;
        setPrinterData((prevData) => ({
            ...prevData,
            numContrato: newNumContrato,
        }));
    };

    const handleEnderecoIPChange = (newEnderecoIP) => {
        setPrinterData((prevData) => ({
            ...prevData,
            enderecoIp: newEnderecoIP,
        }));
    };

    const handleAtivoChange = (event) => {
        const newStatus = event.target.value;
        setPrinterData((prevData) => ({
            ...prevData,
            ativo: newStatus === "Ativo",
        }));
    };

    const handleDentroRedeChange = (event) => {
        const value = event.target.value;
        setPrinterData((prevData) => ({
            ...prevData,
            estaNaRede: value === "Sim",
        }));

        if (value === "Não") {
            setPrinterData((prevData) => ({
                ...prevData,
                enderecoIp: '0.0.0.0',
            }));
        }
    };

    const handleLocalizacaoChange = (event) => {
        const cidadeSelecionada = event.target.value;
        setSelectedCidade(cidadeSelecionada);

        const localizacao = localizacoes.find(m => m.name === cidadeSelecionada);
        setWorkstations(localizacao ? localizacao.workstations : []);
        setSubWorkstations([]);

        setSelectedWorkstation('');
    };

    const handleWorkstationChange = (event) => {
        const workstationSelecionada = event.target.value;
        setSelectedWorkstation(workstationSelecionada);

        const subworkstations = workstations.find(m => m.name === workstationSelecionada);
        setSubWorkstations(subworkstations ? subworkstations.child_workstations.map(m => m.name) : []);
        setSelectedSubWorkstation('');
    };

    const handleSubWorkstationChange = (event) => {
        const workstationSelecionada = event.target.value;
        console.log(workstationSelecionada);
        setSelectedSubWorkstation(workstationSelecionada);
    };

    const handleDataInstalacaoChange = (event) => {
        const newDataInstalacao = event.target.value;
        setPrinterData((prevData) => ({
            ...prevData,
            dataInstalacao: newDataInstalacao,
        }));
    }

    const handleDataRetiradaChange = (event) => {
        const newDataRetirada = event.target.value;
        setPrinterData((prevData) => ({
            ...prevData,
            dataRetirada: newDataRetirada,
        }));
    }

    const handleContadorRetiradaPBChange = (event) => {
        const newContadorRetiradaPB = event.target.value;
        setPrinterData((prevData) => ({
            ...prevData,
            contadorRetiradaPB: newContadorRetiradaPB,
        }));
    };

    const handleContadorRetiradaCorChange = (event) => {
        const newContadorRetiradaCor = event.target.value;
        setPrinterData((prevData) => ({
            ...prevData,
            contadorRetiradaCor: newContadorRetiradaCor,
        }));
    };

    const handleMarcaChange = (event) => {
        const marcaSelecionada = event.target.value;
        const marca = marcasData.find(m => m.marca === marcaSelecionada);
        setSelectedModelo(marca ? marca.modelo : 'Selecione uma marca');
        setSelectedMarca(marcaSelecionada);
    }

    const formatDate = (date) => {
        if (!date) return '';
        return (date.split('T')[0]);
    }

    const navigate = useNavigate();

    const handleExitForm = () => {
        navigate('/impressorascadastradas');
    };

    const validateForm = () => {
        const newErrors = {};

        if (!printerData.numContrato) newErrors.contrato = 'Contrato é obrigatório';
        if (!printerData.numSerie) newErrors.numSerie = 'Número de série é obrigatório';
        if (!selectedCidade) newErrors.cidade = 'Cidade é obrigatória';
        if (!selectedWorkstation) newErrors.workstation = 'Regional é obrigatória';
        if (!printerData.dataInstalacao) newErrors.dataInstalacao = 'Data de instalação é obrigatória';
        if (!selectedMarca) newErrors.marca = 'Marca é obrigatória';
        if (!selectedModelo) newErrors.modelo = 'Modelo é obrigatório';
        if (!printerData.enderecoIp && printerData.estaNaRede) newErrors.enderecoIP = 'Endereço IP é obrigatório';
        if (!printerData.ativo) {
            if (!printerData.dataRetirada) newErrors.dataRetirada = 'Data de retirada é obrigatória';
            if (!printerData.contadorRetiradaPB) newErrors.contadorRetirada = 'Contador de retirada PB é obrigatório';
            if (!printerData.contadorRetiradaCor) newErrors.contadorRetirada = 'Contador de retirada Cor é obrigatório';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleEditButton = async () => {
        try {
            if (!validateForm()) {
                toast.error('Preencha todos os campos obrigatórios');
                return;
            }

            let data = {
                ...printerData,
                modeloId: selectedModelo,
                localizacao: `${selectedCidade};${selectedWorkstation};${selectedSubWorkstation}`,
                ...(printerData.dataRetirada !== "" && { dataRetirada: printerData.dataRetirada }),
                contadorRetiradaPB: printerData.contadorRetiradaPB ? parseInt(printerData.contadorRetiradaPB) : 0,
                contadorRetiradaCor: printerData.contadorRetiradaCor ? parseInt(printerData.contadorRetiradaCor) : 0,
            };

            const res = await editImpressora(data);
            if (res.type == "error") {
                toast.error(res.error.response.data.message);
            } else {
                navigate(`/visualizarimpressora/${printerData.id}`);
            }
        } catch (error) {
            console.error('Erro ao editar impressora:', error);
        }
    };

    return (
        <>
            <div id="view-printer-data">
                <div className="header-container">
                    <span className="form-title">Editar Equipamento</span>
                    <div className="info-cards-container" style={{ gap: '2rem' }}>
                        <SmallInfoCard
                            className="grey-info-card"
                            title="Último contador"
                            imageSrc={require('../../assets/green-calendar.png')}
                            info="25/07/2024"
                        />
                        <SmallInfoCard
                            className="grey-info-card"
                            title="Tempo Ativo"
                            imageSrc={require('../../assets/green-calendar.png')}
                            info="20 dias"
                        />
                        <SmallInfoCard
                            className="blue-info-card"
                            title="Versão do Firmware"
                            imageSrc={require('../../assets/processor.png')}
                            info="1.9.2"
                        />
                    </div>
                </div>
                <div className="printer-field">
                    <div className='info-field'>
                        <InputContainer
                            label="Número de série"
                            placeholder="Insira número de série"
                            value={printerData.numSerie}
                            onChange={handleNumSerieChange}
                            className="lg"
                            error={errors.numSerie}
                        />

                        <SelectContainer
                            id="marca"
                            name="marca"
                            options={marcas}
                            className="lg-select"
                            label="Marca"
                            onChange={handleMarcaChange}
                            value={selectedMarca}
                            error={errors.marca}
                        />
                        <ViewDataContainer
                            id="marca-equipamento"
                            className="small-view"
                            labelName={"Modelo"}
                            value={selectedModelo}
                        />

                        <SelectContainer
                            id="contrato"
                            name="contrato"
                            options={contratos}
                            className="lg-select"
                            label="Contrato"
                            onChange={handleContratoChange}
                            value={printerData.numContrato}
                            error={errors.contrato}
                        />

                        <div className="container" style={{ gap: '5rem' }}>
                            <InputContainer
                                label="Endereço IP"
                                placeholder="Insira o endereço IP"
                                value={printerData.enderecoIp}
                                onChange={handleEnderecoIPChange}
                                className={`md ${printerData.estaNaRede ? '' : 'disabled'}`}
                                disabled={printerData.estaNaRede}
                                error={errors.enderecoIP}
                            />

                            <SelectContainer
                                id="dentroRede"
                                name="dentroRede"
                                options={yesNo}
                                className="lg-select"
                                label="Dentro da rede"
                                onChange={handleDentroRedeChange}
                                value={printerData.estaNaRede ? "Sim" : "Não"}
                                error={errors.dentroRede}
                            />
                        </div>

                        <DateContainer
                            label="Data de Instalação"
                            value={formatDate(printerData.dataInstalacao)}
                            onChange={handleDataInstalacaoChange}
                            className="md"
                            error={errors.dataInstalacao}
                        />

                        <div className="form-separator"> Retirada </div>
                        <div className="container" style={{ gap: '3rem' }}>
                            <NumberContainer
                                id="contadorRetiradaPb"
                                name="contadorRetiradaPb"
                                value={printerData.contadorRetiradaPB}
                                onChange={handleContadorRetiradaPBChange}
                                className={`md-select ${printerData.ativo ? 'disabled' : ''}`}
                                label="Contador de Retirada PB"
                                error={errors.contadorRetirada}
                            />
                            <NumberContainer
                                id="contadorRetiradaCor"
                                name="contadorRetiradaCor"
                                value={printerData.contadorRetiradaCor}
                                onChange={handleContadorRetiradaCorChange}
                                className={`md-select ${printerData.ativo ? 'disabled' : ''}`}
                                label="Contador de Retirada Cor"
                                error={errors.contadorRetirada}
                            />
                        </div>
                        <div className="container" style={{ gap: '5rem' }}>
                            <DateContainer
                                label="Data de Retirada"
                                value={formatDate(printerData.dataRetirada)}
                                onChange={handleDataRetiradaChange}
                                className={`md ${printerData.ativo ? 'disabled' : ''}`}
                                error={errors.dataRetirada}
                            />

                            <SelectContainer
                                id="status"
                                name="status"
                                options={["Ativo", "Inativo"]}
                                className="lg-select"
                                label="Status"
                                onChange={handleAtivoChange}
                                value={printerData.ativo ? "Ativo" : "Inativo"}
                                error={errors.status}
                                usePlaceholder={false}
                            />
                        </div>
                    </div>
                    <div className='cards-field'>
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
                    <SelectContainer
                        id="cidade"
                        name="cidade"
                        options={localizacoes ? localizacoes.map(m => m.name) : []}
                        className="md-select"
                        label="Cidade"
                        onChange={handleLocalizacaoChange}
                        value={selectedCidade}
                        error={errors.cidade}
                    />

                    <SelectContainer
                        id="workstation"
                        name="workstation"
                        options={localizacoes ? localizacoes.find(m => m.name === selectedCidade)?.workstations.map(m => m.name) || [] : []}
                        className="lg-select"
                        label="Posto de trabalho"
                        onChange={handleWorkstationChange}
                        value={selectedWorkstation}
                        error={errors.workstation}
                    />

                    <SelectContainer
                        id="subworkstation"
                        name="subworkstation"
                        options={subWorkstations}
                        className="lg-select"
                        label="Subposto de trabalho"
                        onChange={handleSubWorkstationChange}
                        value={selectedSubWorkstation}
                        error={errors.subestacao}
                    />
                </div>
                <div className="space"></div>
                <div className="container">
                    <Button
                        type="success"
                        size="medium"
                        text="Salvar"
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
