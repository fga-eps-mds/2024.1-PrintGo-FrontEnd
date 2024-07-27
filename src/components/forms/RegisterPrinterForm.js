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

export default function RegisterPrinterForm() {
    const [marcas, setMarcas] = useState([]);
    const [modelos, setModelos] = useState([]);
    const [contratos, setContratos] = useState([]);
    const [selectedContrato, setSelectedContrato] = useState('');
    const [selectedMarca, setSelectedMarca] = useState('');
    const [selectedModelo, setSelectedModelo] = useState('');
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
    const [contadorInstalacao, setContadorInstalacao] = useState('');
    const [contadorRetirada, setContadorRetirada] = useState('');
    const [status, setStatus] = useState('Ativo');  // Estado para armazenar o status
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

        const fetchMarcas = async () => {
            try {
                const data = [
                    {
                        marca: 'HP',
                        modelos: ['Model A', 'Model B', 'Model C']
                    },
                    {
                        marca: 'Canon',
                        modelos: ['Model X', 'Model Y']
                    }
                ];
                setMarcas(data);
            } catch (error) {
                console.error('Erro ao buscar marcas:', error);
            }
        };

        const fetchContratos = async () => {
            try {
                const data = [
                    'A1B2C3D4',
                    'E5F6G7H8',
                    'I9J0K1L2',
                    'M3N4O5P6',
                    'Q7R8S9T0',
                    'U1V2W3X4',
                    'Y5Z6A7B8',
                    'C9D0E1F2'
                ];
                setContratos(data);
            } catch (error) {
                console.error('Erro ao buscar contratos:', error);
            }
        };

        fetchMarcas();
        fetchContratos();
        fetchLocalizacoes();
    }, []);


    const validateForm = () => {
        const newErrors = {};

        if (!selectedContrato) newErrors.contrato = 'Contrato é obrigatório';
        if (!selectedMarca) newErrors.marca = 'Marca é obrigatória';
        if (!selectedModelo) newErrors.modelo = 'Modelo é obrigatório';
        if (!enderecoIP && selectedDentroRede === "Sim") newErrors.enderecoIP = 'Endereço IP é obrigatório';
        if (!numSerie) newErrors.numSerie = 'Número de série é obrigatório';
        if (!selectedCidade) newErrors.cidade = 'Cidade é obrigatória';
        if (!selectedWorkstation) newErrors.workstation = 'Posto de trabalho é obrigatório';
        if (!dataInstalacao) newErrors.dataInstalacao = 'Data de instalação é obrigatória';
        if (!contadorInstalacao) newErrors.contadorInstalacao = 'Contador de instalação é obrigatório';
        if (status === 'Inativo') {
            if (!dataRetirada) newErrors.dataRetirada = 'Data de retirada é obrigatória';
            if (!contadorRetirada) newErrors.contadorRetirada = 'Contador de retirada é obrigatório';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Retorna true se não houver erros
    };

    const handleFormSubmit = async () => {
        try {
            if (validateForm()) {
                let data = {
                    contrato: selectedContrato,
                    marca: selectedMarca,
                    modelo: selectedModelo,
                    enderecoIp: enderecoIP,
                    numSerie: numSerie,
                    dentroRede: selectedDentroRede == "Sim" ? true : false,
                    cidade: selectedCidade,
                    regional: selectedWorkstation,
                    ...(selectedSubWorkstation !== "" && { subestacao: selectedSubWorkstation }),
                    dataInstalacao: dataInstalacao,
                    contadorInstalacao: contadorInstalacao,
                    ...(dataRetirada !== "" && { dataRetirada: dataRetirada }),
                    status: status,
                    ...(contadorRetirada !== "" && { contadorRetirada: contadorRetirada }),
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
            // Trate o erro aqui, por exemplo, mostrar uma mensagem para o usuário
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

        const marca = marcas.find(m => m.marca === marcaSelecionada);
        setModelos(marca ? marca.modelos : []);
    };

    const handleModeloChange = (event) => {
        setSelectedModelo(event.target.value);
    };

    const handleEnderecoIPChange = (newValue) => {
        setEnderecoIP(newValue);
    };

    const handleNumSerieChange = (newValue) => {
        setNumSerie(newValue);
    };

    const handleContadorInstalacaoChange = (event) => {
        setContadorInstalacao(event.target.value);
    };

    const handleContadorRetiradaChange = (event) => {
        setContadorRetirada(event.target.value);
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
                    options={marcas.map(m => m.marca)}
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
                        options={modelos}
                        className="md-select"
                        label="Modelo"
                        onChange={handleModeloChange}
                        value={selectedModelo}
                        error={errors.modelo}
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
                        options={localizacoes.map(m => m.name)}
                        className="md-select"
                        label="Cidade"
                        onChange={handleLocalizacaoChange}
                        value={selectedCidade}
                        error={errors.cidade}
                    />

                    <SelectContainer
                        id="workstation"
                        name="workstation"
                        options={workstations.map(m => m.name)}
                        className="lg-select"
                        label="Posto de Trabalho"
                        onChange={handleWorkstationChange}
                        value={selectedWorkstation}
                        error={errors.workstation}
                    />

                    <SelectContainer
                        id="subworkstation"
                        name="subworkstation"
                        options={subWorkstations.map(m => m.name)}
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

                    <NumberContainer
                        id="contadorInstalacao"
                        name="contadorInstalacao"
                        value={contadorInstalacao}
                        onChange={handleContadorInstalacaoChange}
                        className="md-select"
                        label="Contador de Instalação"
                        error={errors.contadorInstalacao}
                    />
                </div>

                <div className="form-separator"> Retirada </div>
                <div className="container">
                    <NumberContainer
                        id="contadorRetirada"
                        name="contadorRetirada"
                        value={contadorRetirada}
                        onChange={handleContadorRetiradaChange}
                        className={`md-select ${retiradaClass}`}
                        label="Contador de Retirada"
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
                    />

                    <SelectContainer
                        id="status"
                        name="status"
                        options={["Ativo", "Inativo"]}
                        className="lg-select"
                        label="Status"
                        onChange={handleStatusChange}
                        value={status}
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
