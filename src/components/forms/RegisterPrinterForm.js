import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../style/components/registerPrinterForms.css";
import SelectContainer from '../containers/SelectContainer';
import InputContainer from '../containers/InputContainer';
import DateContainer from '../containers/DateContainer';
import NumberContainer from '../containers/NumberContainer';
import ViewDataContainer from "../containers/ViewDataContainer";
import { toast } from "react-toastify";
import Button from '../Button';
import { createImpressora, getLocalizacao } from "../../services/printerService";
import { getPadroes } from "../../services/patternService";
import { getContract } from "../../services/contractService";

export default function RegisterPrinterForm() {
    const [marcas, setMarcas] = useState([]);
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
    const [contadorInstalacaoPB, setContadorInstalacaoPB] = useState('');
    const [contadorInstalacaoCor, setContadorInstalacaoCor] = useState('');
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
                const response = await getPadroes();
                setMarcas(response.data);
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
        if (!contadorInstalacaoCor) newErrors.contadorInstalacaoCor = 'Contador de instalação é obrigatório';
        if (!contadorInstalacaoPB) newErrors.contadorInstalacaoPB = 'Contador de instalação é obrigatório';
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
                    numContrato: selectedContrato,
                    // marca: selectedMarca,
                    modeloId: selectedModelo,
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
                    contadorRetiradaPB: 0,
                    contadorRetiradaCor: 0,
                    contadorAtualPB: 0,
                    contadorAtualCor: 0,
                    ...(dataRetirada !== "" && { dataRetirada: dataRetirada }),
                    ativo: status == "Ativo" ? true : false,
                    ...(contadorRetirada !== "" && { contadorRetiradaPB: contadorRetirada }),
                    ...(contadorRetirada !== "" && { contadorRetiradaCor: contadorRetirada }),
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
        setSelectedModelo(marca ? marca.modelo : 'Selecione uma marca');
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
                    <ViewDataContainer
                        id="marca-equipamento"
                        name="marca-equipamento"
                        className="small-view"
                        labelName={"Modelo"}
                        value={selectedModelo}
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
