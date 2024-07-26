import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../style/components/registerPrinterForms.css";
import SelectContainer from '../containers/SelectContainer';
import InputContainer from '../containers/InputContainer';
import DateContainer from '../containers/DateContainer';
import NumberContainer from '../containers/NumberContainer';
import Button from '../Button';

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
                const data = mockLocations;
                setLocalizacoes(data);
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
        if (!selectedSubWorkstation) newErrors.subWorkstation = 'Subposto de trabalho é obrigatório';
        if (!dataInstalacao) newErrors.dataInstalacao = 'Data de instalação é obrigatória';
        if (!contadorInstalacao) newErrors.contadorInstalacao = 'Contador de instalação é obrigatório';
        if (status === 'Inativo') {
            if (!dataRetirada) newErrors.dataRetirada = 'Data de retirada é obrigatória';
            if (!contadorRetirada) newErrors.contadorRetirada = 'Contador de retirada é obrigatório';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Retorna true se não houver erros
    };

    const handleFormSubmit = () => {
        if (validateForm()) {
            // Log form data to the console
            console.log({
                contrato: selectedContrato,
                marca: selectedMarca,
                modelo: selectedModelo,
                enderecoIP: enderecoIP,
                numSerie: numSerie,
                dentroRede: selectedDentroRede,
                cidade: selectedCidade,
                workstation: selectedWorkstation,
                subWorkstation: selectedSubWorkstation,
                dataInstalacao: dataInstalacao,
                contadorInstalacao: contadorInstalacao,
                dataRetirada: dataRetirada,
                status: status,
                contadorRetirada: contadorRetirada
            });

            // Redirect to impressoras-cadastradas
            navigate('/impressorascadastradas');
        }
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
            <div>
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

                <div className="container">
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
                <div className="container">
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
                <div className="container">
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
                <div className='container'>
                    <DateContainer
                        label="Data de retirada"
                        value={dataRetirada}
                        onChange={(e) => setDataRetirada(e.target.value)}
                        className={`md ${retiradaClass}`}
                        error={errors.dataRetirada}
                    />

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
            </div>


            <Button
                type="success"
                size="medium"
                text="Salvar"
                onClick={handleFormSubmit}
            />
        </div>
    );
}

const mockLocations = [
    {
        id: '1',
        name: 'Goiânia',
        state: 'GO',
        workstations: [
            {
                id: '101',
                name: 'Workstation A',
                phone: '1234-5678',
                ip: '192.168.0.1',
                gateway: '192.168.0.254',
                is_regional: true,
                vpn: true,
                parent_workstation: null,
                child_workstations: [
                    {
                        id: '102',
                        name: 'Workstation B',
                        phone: '2345-6789',
                        ip: '192.168.0.2',
                        gateway: '192.168.0.254',
                        is_regional: false,
                        vpn: true,
                        parent_workstation: { id: '101', name: 'Workstation A' },
                        child_workstations: []
                    }
                ]
            }
        ]
    },
    {
        id: '2',
        name: 'Anápolis',
        state: 'GO',
        workstations: [
            {
                id: '201',
                name: 'Workstation C',
                phone: '3456-7890',
                ip: '192.168.1.1',
                gateway: '192.168.1.254',
                is_regional: false,
                vpn: false,
                parent_workstation: null,
                child_workstations: []
            }
        ]
    }
];
