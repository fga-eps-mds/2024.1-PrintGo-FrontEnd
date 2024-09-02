import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../style/components/registerPrinterForms.css";
import SelectContainer from '../containers/SelectContainer';
import InputContainer from '../containers/InputContainer';
import DateContainer from '../containers/DateContainer';
import NumberContainer from '../containers/NumberContainer';
import { toast } from "react-toastify";
import Button from '../Button';
import { createImpressora, getLocalizacao } from "../../services/printerService";
import { getPadroes } from "../../services/patternService";
import { getContract } from "../../services/contractService";

export default function RegisterPrinterForm() {
    const [padroes, setPadroes] = useState([]);
    const [contratos, setContratos] = useState([]);
    const [selectedContrato, setSelectedContrato] = useState('');
    const [selectedMarca, setSelectedMarca] = useState('');
    const [selectedModelo, setSelectedModelo] = useState('');
    const [selectedPadrao, setSelectedPadrao] = useState({});
    const [enderecoIP, setEnderecoIP] = useState('');
    const [numSerie, setNumSerie] = useState('');
    const [localizacoes, setLocalizacoes] = useState([]);
    const [selectedCidade, setSelectedCidade] = useState('');
    const [workstations, setWorkstations] = useState([]);
    const [selectedWorkstation, setSelectedWorkstation] = useState('');
    const [subWorkstations, setSubWorkstations] = useState([]);
    const [selectedSubWorkstation, setSelectedSubWorkstation] = useState('');
    const [selectedDentroRede, setSelectedDentroRede] = useState('Sim');
    const [dataInstalacao, setDataInstalacao] = useState('');
    const [dataRetirada, setDataRetirada] = useState('');
    const [contadorInstalacaoPB, setContadorInstalacaoPB] = useState('');
    const [contadorInstalacaoCor, setContadorInstalacaoCor] = useState('');
    const [contadorRetiradaPB, setContadorRetiradaPB] = useState('');
    const [contadorRetiradaCor, setContadorRetiradaCor] = useState('');
    const [status, setStatus] = useState('Ativo');
    const [errors, setErrors] = useState({});
    const yesNo = ["Sim", "Não"];

    const navigate = useNavigate();

    useEffect(() => {
        const fetchLocalizacoes = async () => {
            try {
                const response = await getLocalizacao();
                setLocalizacoes(response.data);
            } catch (error) {
                console.error('Erro ao buscar localizações:', error);
            }
        };

        const fetchPadroes = async () => {
            try {
                const response = await getPadroes();
                setPadroes(response.data);
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

        fetchPadroes();
        fetchContratos();
        fetchLocalizacoes();
    }, []);

    const isValidIP = (ipAddress) => {
        const ipPattern = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/;
        return ipPattern.test(ipAddress);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!selectedContrato) newErrors.contrato = 'Contrato é obrigatório';
        if (!selectedMarca) newErrors.marca = 'Marca é obrigatória';
        if (!selectedModelo) newErrors.modelo = 'Modelo é obrigatório';
        if (!enderecoIP && selectedDentroRede === "Sim") newErrors.enderecoIP = 'Endereço IP é obrigatório';
        if (enderecoIP && !isValidIP(enderecoIP)) newErrors.enderecoIP = 'Endereço IP inválido';
        if (!numSerie) newErrors.numSerie = 'Número de série é obrigatório';
        if (!selectedCidade) newErrors.cidade = 'Cidade é obrigatória';
        if (!selectedWorkstation) newErrors.workstation = 'Posto de trabalho é obrigatório';
        if (!dataInstalacao) newErrors.dataInstalacao = 'Data de instalação é obrigatória';
        // if (!contadorInstalacaoCor) newErrors.contadorInstalacaoCor = 'Contador de instalação é obrigatório';
        if (selectedPadrao.colorido && !contadorInstalacaoCor) newErrors.contadorInstalacaoCor = 'Contador de instalação é obrigatório';
        if (!contadorInstalacaoPB) newErrors.contadorInstalacaoPB = 'Contador de instalação é obrigatório';
        if (status === 'Inativo') {
            if (!dataRetirada) newErrors.dataRetirada = 'Data de retirada é obrigatória';
            if (!contadorRetiradaPB) newErrors.contadorRetiradaPB = 'Contador de retirada PB é obrigatório';
            if (!contadorRetiradaCor) newErrors.contadorRetiradaCor = 'Contador de retirada Cor é obrigatório';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFormSubmit = async () => {
        try {
            if (validateForm()) {
                let data = {
                    numContrato: selectedContrato,
                    // marca: selectedMarca,
                    modeloId: selectedPadrao.id.toString(),
                    enderecoIp: enderecoIP,
                    numSerie: numSerie,
                    estaNaRede: selectedDentroRede == "Sim" ? true : false,
                    localizacao: selectedCidade + ';' + selectedWorkstation + (selectedSubWorkstation ? ';' + selectedSubWorkstation : ';'),
                    // cidade: selectedCidade,
                    // regional: selectedWorkstation,
                    // ...(selectedSubWorkstation !== "" && { subestacao: selectedSubWorkstation }),
                    dataInstalacao: dataInstalacao,
                    contadorInstalacaoPB: contadorInstalacaoPB,
                    contadorInstalacaoCor: contadorInstalacaoCor,
                    contadorInstalacaoCor: selectedPadrao.colorido ? contadorInstalacaoCor : 0,
                    contadorRetiradaPB: contadorRetiradaPB ? parseInt(contadorRetiradaPB) : 0,
                    contadorRetiradaCor: contadorRetiradaCor ? parseInt(contadorRetiradaCor) : 0,
                    contadorAtualPB: 0,
                    contadorAtualCor: 0,
                    ...(dataRetirada !== "" && { dataRetirada: dataRetirada }),
                    ativo: status == "Ativo" ? true : false,
                };

                const res = await createImpressora(data);
                if (res.type == "error") {
                    toast.error(res.error.response.data.message);
                } else {
                    navigate('/impressorascadastradas');
                }
            } else {
                toast.error("Erro ao criar impressora!");
            }
        } catch (error) {
            console.error("Erro ao criar impressora:", error);
            toast.error("Ocorreu um erro ao criar a impressora. Tente novamente.");
        }
    };

    const handleExitForm = () => {
        navigate('/impressorascadastradas');
    };

    const handleContratoChange = (event) => {
        setSelectedContrato(event.target.value);
    };

    const handleMarcaChange = (event) => {
        const marcaSelecionada = event.target.value;
        setSelectedMarca(marcaSelecionada);

        setSelectedModelo('');
    };

    const handleModeloChange = (event) => {
        const modeloSelecionado = event.target.value;
        if (modeloSelecionado === '') {
            setSelectedModelo('');
            setSelectedPadrao({});
            return;
        }
        setSelectedModelo(modeloSelecionado);

        const padrao = padroes.find(m => m.modelo === modeloSelecionado);
        setSelectedPadrao(padrao);
    };

    const handleEnderecoIPChange = (newValue) => {
        setEnderecoIP(newValue);
    };

    const handleNumSerieChange = (newValue) => {
        setNumSerie(newValue);
    };

    const handleContadorInstalacaoPBChange = (event) => {
        setContadorInstalacaoPB(event.target.value);
    };

    const handleContadorInstalacaoCorChange = (event) => {
        setContadorInstalacaoCor(event.target.value);
    };

    const handleContadorRetiradaPBChange = (event) => {
        setContadorRetiradaPB(event.target.value);
    };

    const handleContadorRetiradaCorChange = (event) => {
        setContadorRetiradaCor(event.target.value);
    };

    const handleLocalizacaoChange = (event) => {
        const cidadeSelecionada = event.target.value;
        setSelectedCidade(cidadeSelecionada);

        const localizacao = localizacoes.find(m => m.name === cidadeSelecionada);
        setWorkstations(localizacao ? localizacao.workstations : []);
        setSubWorkstations([]);

        setSelectedWorkstation('');
        setSelectedSubWorkstation('');
    };

    const handleWorkstationChange = (event) => {
        const workstationSelecionada = event.target.value;
        setSelectedWorkstation(workstationSelecionada);

        const subworkstations = workstations.find(m => m.name === workstationSelecionada);
        setSubWorkstations(subworkstations ? subworkstations.child_workstations : []);
    };

    const handleSubWorkstationChange = (event) => {
        const workstationSelecionada = event.target.value;
        setSelectedSubWorkstation(workstationSelecionada);
    };

    const handleDentroRedeChange = (event) => {
        const value = event.target.value;
        setSelectedDentroRede(value);

        if (value === "Não") {
            setEnderecoIP('');
        }
    };

    const handleStatusChange = (event) => {
        const newStatus = event.target.value;
        if (newStatus === 'Ativo') {
            setDataRetirada('');
            setContadorRetiradaPB('');
        }
        setStatus(newStatus);
    };

    const enderecoIPClass = selectedDentroRede === "Não" ? "disabled" : "";

    // Condicionalmente aplicar ou remover a classe "disabled" com base no status
    const retiradaClass = status === 'Ativo' ? 'disabled' : '';

    return (
        <div>
            <div className='register-printer-field'>
                <span className="form-title">Cadastrar Equipamento</span>

                <SelectContainer
                    id="contrato"
                    name="contrato"
                    options={contratos}
                    className="lg-select"
                    label="Contrato"
                    onChange={handleContratoChange}
                    value={selectedContrato}
                    error={errors.contrato}
                />

                <SelectContainer
                    id="marca"
                    name="marca"
                    options={padroes ? Array.from(new Set(padroes.map(m => m.marca))) : []}
                    className="md-select"
                    label="Marca"
                    onChange={handleMarcaChange}
                    value={selectedMarca}
                    error={errors.marca}
                />

                <div className="container" style={{ gap: '5rem' }}>
                    <SelectContainer
                        id="modelo"
                        name="modelo"
                        className="md-select"
                        label={"Modelo"}
                        value={selectedModelo}
                        error={errors.modelo}
                        options={padroes ? padroes.filter(m => m.marca === selectedMarca).map(m => m.modelo) : []}
                        onChange={handleModeloChange}
                    />

                    <InputContainer
                        label="Endereço IP"
                        placeholder="Insira o endereço IP"
                        value={enderecoIP}
                        onChange={handleEnderecoIPChange}
                        className={`md ${enderecoIPClass}`}
                        disabled={selectedDentroRede === "Não"}
                        error={errors.enderecoIP}
                    />

                    <SelectContainer
                        id="dentroRede"
                        name="dentroRede"
                        options={yesNo}
                        className="lg-select"
                        label="Dentro da rede"
                        onChange={handleDentroRedeChange}
                        value={selectedDentroRede}
                        usePlaceholder={false}
                    />
                </div>

                <InputContainer
                    label="Número de série"
                    placeholder="Insira número de série"
                    value={numSerie}
                    onChange={handleNumSerieChange}
                    className="lg"
                    error={errors.numSerie}
                />

                <div className="form-separator"> Localização </div>
                <div id='localization' className="container" style={{ gap: '5rem' }}>
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
                        options={workstations ? workstations.map(m => m.name) : []}
                        className="lg-select"
                        label="Posto de Trabalho"
                        onChange={handleWorkstationChange}
                        value={selectedWorkstation}
                        error={errors.workstation}
                    />

                    <SelectContainer
                        id="subworkstation"
                        name="subworkstation"
                        options={subWorkstations ? subWorkstations.map(m => m.name) : []}
                        className="lg-select"
                        label="Subposto de Trabalho"
                        onChange={handleSubWorkstationChange}
                        value={selectedSubWorkstation}
                        error={errors.subWorkstation}
                    />
                </div>

                <div className="form-separator"> Instalação </div>
                <div className="container" style={{ gap: '5rem' }}>
                    <DateContainer
                        label="Data de Instalação"
                        value={dataInstalacao}
                        onChange={(e) => setDataInstalacao(e.target.value)}
                        className="md"
                        error={errors.dataInstalacao}
                    />

                </div>
                <div className="container" style={{ gap: '5rem' }}>
                    <NumberContainer
                        id="contadorInstalacaoPB"
                        name="contadorInstalacaoPB"
                        value={contadorInstalacaoPB}
                        onChange={handleContadorInstalacaoPBChange}
                        className="md-select"
                        label="Contador preto e branco"
                        error={errors.contadorInstalacaoPB}
                    />

                    <NumberContainer
                        id="contadorInstalacaoCor"
                        name="contadorInstalacaoCor"
                        value={contadorInstalacaoCor}
                        onChange={handleContadorInstalacaoCorChange}
                        className="md-select"
                        label="Contador com cor"
                        error={errors.contadorInstalacaoCor}
                        disabled={selectedPadrao.colorido === false}
                    />
                </div>

                <div className="form-separator"> Retirada </div>
                <div className="container" style={{ gap: '3rem' }}>
                    <NumberContainer
                        id="contadorRetiradaPb"
                        name="contadorRetiradaPb"
                        value={contadorRetiradaPB}
                        onChange={handleContadorRetiradaPBChange}
                        className={`md-select ${retiradaClass}`}
                        label="Contador de Retirada PB"
                        error={errors.contadorRetirada}
                    />
                    <NumberContainer
                        id="contadorRetiradaCor"
                        name="contadorRetiradaCor"
                        value={contadorRetiradaCor}
                        onChange={handleContadorRetiradaCorChange}
                        className={`md-select ${retiradaClass}`}
                        label="Contador de Retirada Cor"
                        error={errors.contadorRetirada}
                    />
                </div>
                <div className='container' style={{ gap: '5rem' }}>
                    <DateContainer
                        label="Data de retirada"
                        value={dataRetirada}
                        onChange={(e) => setDataRetirada(e.target.value)}
                        className={`md ${retiradaClass}`}
                        error={errors.dataRetirada}
                        // disabled={status === 'Ativo'}
                    />

                    <SelectContainer
                        id="status"
                        name="status"
                        options={["Ativo", "Inativo"]}
                        className="lg-select"
                        label="Status"
                        onChange={handleStatusChange}
                        value={status}
                        usePlaceholder={false}
                    />

                </div>
            </div>


            <div className="space"></div>
            <div className="container">
                <Button
                    type="success"
                    size="medium"
                    text="Cadastrar"
                    onClick={handleFormSubmit}
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
    );
}
