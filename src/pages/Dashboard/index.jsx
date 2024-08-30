    import React, { useState ,useEffect} from "react";
    import '../Dashboard/dashboard.css'
    import Navbar from "../../components/navbar/Navbar";
    import { LineChart, Line, CartesianGrid, XAxis, YAxis,ResponsiveContainer,Tooltip,Legend,PieChart,Pie,Cell,Bar,BarChart,Label} from 'recharts';
    import data from './data.json'
    import { getImpressoesTotais,getFiltroOpcoes, getImpressorasColoridas, getImpressorasPB, getImpressionsByLocation} from "../../services/dasboardService";
    import '@fortawesome/fontawesome-free/css/all.min.css';




    export default function Dashboard() {
        const [impressaoTotal, setImpressao]  = useState(0)
        const [impressorasCor, setImpressoraColorida]  = useState(0)
        const [impressorasPB, setImpressoraPB]  = useState(0)
        const [impressionsByLocation, setImpressionsByLocation] = useState([]);

        const data = [
            { id: 1, periodo: "2023-08-01T00:00:00Z" },
            { id: 2, periodo: "2023-09-01T00:00:00Z" },
            { id: 3, periodo: "2023-10-01T00:00:00Z" },
            { id: 4, periodo: "2024-08-01T00:00:00Z" },
            { id: 5, periodo: "2024-01-01T00:00:00Z" },
            { id: 6, periodo: "2024-02-01T00:00:00Z" },
            { id: 7, periodo: "2024-03-01T00:00:00Z" },
            { id: 8, periodo: "2024-05-01T00:00:00Z" },
            { id: 9, periodo: "2024-06-01T00:00:00Z" },
          ];

        const [filters, setFilters] = useState({
            periodo: '',
            cidade: '',
            regional: '',
            unidade: '',
        });
        const [opcoesFiltros, setOpcoesFiltros] = useState({
            cidades: [],
            regionais: [],
            unidades: []
        });
        const [periodos, setPeriodos] = useState([]);
        //Função para animar os números
        const animateCount = (setter, start, end, duration = 1000) => {
            const range = end - start;
            const startTime = performance.now();
            const animate = (time) => {
                const elapsed = time - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const currentValue = start + Math.round(progress * range);
                setter(currentValue);
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            requestAnimationFrame(animate);
        };

        //opções que aparecem nos filtros
        useEffect(() => {
            setPeriodos(data);
            const fetchFiltroOpcoes = async () => {
                try {
                    const data = await getFiltroOpcoes();
                    if (data.type === 'success' && data.data) {
                        setOpcoesFiltros({
                            cidades: data.data.cidades,
                            regionais: data.data.regionais,
                            unidades: data.data.unidades
                            
                        });
                    } else {
                        console.log('Erro ao buscar opções de filtros');
                    }
                } catch (error) {
                    console.log('Erro ao buscar opções de filtros:', error);
                }
            };
    
            fetchFiltroOpcoes();
        }, []);

        //conectando back e front dos blocos azuis da tela
        useEffect(() => {
            const fetchImpressoesTotais = async () => {
                try {
                    const data = await getImpressoesTotais(filters); // Passa os filtros na requisição
                    
                    if (data.type === 'success' && data.data) {
                        animateCount(setImpressao, impressaoTotal, data.data.totalImpressions);
                        console.log(data.data.totalImpressions);
                    } else {
                        console.log('erro');
                    }
                } catch (error) {
                    console.log('Erro ao buscar dados do usuário:', error);
                }
            };
        
            const fetchImpressorasCor = async () => {
                try {
                    const data = await getImpressorasColoridas(filters); // Passa os filtros na requisição
                    
                    if (data.type === 'success' && data.data) {
                        animateCount(setImpressoraColorida, impressorasCor, data.data.colorPrintersCount);
                        console.log(data.data.colorPrintersCount);
                    } else {
                        console.log('erro');
                    }
                } catch (error) {
                    console.log('Erro ao buscar dados do usuário:', error);
                }
            };

            const fetchImpressorasPB = async () => {
                try {
                    const data = await getImpressorasPB(filters); // Passa os filtros na requisição
                    
                    if (data.type === 'success' && data.data) {
                        animateCount(setImpressoraPB, impressorasPB, data.data.PbPrintersCount);
                        console.log(data.data.PbPrintersCount);
                    } else {
                        console.log('erro');
                    }
                } catch (error) {
                    console.log('Erro ao buscar dados do usuário:', error);
                }
            };
            
            const fetchImpressionsByLocation = async () => {
                try {
                    const response = await getImpressionsByLocation();
                    console.log('Data received from API:', response);
            
                    if (response.type === 'success' && Array.isArray(response.data.data)) {
                        const groupedData = response.data.data.reduce((acc, item) => {
                            const [cidade, regional, unidade] = item.localizacao.split(';');
                            const periodo = item.dataContador ? new Date(item.dataContador).toISOString().slice(0, 7) : '';
            
                            // Determina a chave de agrupamento com ou sem o período
                            const key = filters.periodo ? `${cidade};${regional};${unidade || ''};${periodo}` : `${cidade};${regional};${unidade || ''}`;
            
                            if (!acc[key]) {
                                acc[key] = {
                                    cidade: cidade,
                                    regional: regional,
                                    unidade: unidade || '',
                                    TotalPB: 0,
                                    TotalCor: 0,
                                    periodos: new Set() 
                                };
                            }
            
                            acc[key].TotalPB += item.contadorAtualPB;
                            acc[key].TotalCor += item.contadorAtualCor;
                            acc[key].periodos.add(periodo); // Adiciona o período ao Set de períodos únicos
            
                            return acc;
                        }, {});
            
                        // Transformar o Set de períodos em um array antes de aplicar os filtros
                        const transformedData = Object.values(groupedData).map(group => ({
                            ...group,
                            periodos: Array.from(group.periodos) // Converte o Set para um array
                        }));
            
                        console.log('Transformed Data:', transformedData);
                        setImpressionsByLocation(transformedData);
                    } else {
                        console.log('Erro: os dados não estão no formato esperado.');
                    }
                } catch (error) {
                    console.log('Erro ao buscar impressões por localidade:', error);
                }
            };
            
            
            // Chamando as funções de fetch
            fetchImpressoesTotais();
            fetchImpressorasCor();
            fetchImpressorasPB();
            fetchImpressionsByLocation();
            
        }, [filters]); // Refaz a requisição sempre que os filtros mudarem
        
        const handleChange = (e) => {
            setFilters({
                ...filters,
                [e.target.name]: e.target.value,
            });
        };
        

        
        

        const data1 = [
            { semana: 'Unidade 1', ativa: 120, inativa: 80 },
            { semana: 'Unidade 2', ativa: 150, inativa: 70 },
            { semana: 'Unidade 3', ativa: 130, inativa: 90 },
            { semana: 'Unidade 4', ativa: 170, inativa: 60 },
        ];
        const data2 = [
            { name: 'Coloridas', value: 120 },
            { name: 'Monocromáticas', value: 80 },
        ];
        const COLORS = ['#03326D', '#007235'];
        const RADIAN = Math.PI / 180;
            const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
            const radius = innerRadius + (outerRadius - innerRadius) * 0.3;
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);

            return (
                <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
                </text>
            );
            };
                
            
            const filteredData = impressionsByLocation.filter(item =>
                (!filters.periodo || item.periodo === filters.periodo || (item.periodos && item.periodos.includes(filters.periodo))) &&
                (!filters.cidade || item.cidade === filters.cidade) &&
                (!filters.regional || item.regional === filters.regional) &&
                (!filters.unidade || item.unidade === filters.unidade)
            );
            
        return (
            <><Navbar/>
            <div className="container-dash">
                <div className="top-container">
                    <div className="top-part1">
                        <div className="dash_periodo">
                            <h1>Dashboard</h1>
                            <div className="select-pel">
                            {/* Alteração: Seleção de período (mensal) baseada nas opções geradas */}
                            <div className="select-options">
                            <i className="fas fa-calendar-alt"></i>     
                            <select id="periodo" name="periodo" value={filters.periodo} onChange={handleChange}>
                                        <option value="">Selecione o período</option>
                                        {periodos.map((periodo) => (
                                        <option key={periodo.id} value={periodo.periodo}>
                                            {new Date(periodo.periodo).toLocaleDateString('pt-BR', { year: 'numeric', month: 'numeric' })}
                                        </option>
                                        ))}
                                    </select>
                                    </div>
                        {/* Alteração: preenchendo o select de cidade com opções dinâmicas */}
                                <div className="select-options">
                                <i className="fas fa-map-marker-alt"></i>     
                                <select id="cidade" name="cidade" value={filters.cidade} onChange={handleChange}>
                                    <i className="fas fa-map-marker-alt"></i>
                                    <option value="">Cidade</option>
                                    {opcoesFiltros.cidades.map(cidade => (
                                        <option key={cidade} value={cidade}>{cidade}</option>
                                    ))}
                                </select>
                                </div>    
                                {/* Alteração: preenchendo o select de regional com opções dinâmicas */}
                                <div className="select-options">
                                <i className="fas fa-map-marker-alt"></i>     
                                <select id="regional" name="regional" value={filters.regional} onChange={handleChange}>
                                    <option value="">Regional</option>
                                    {opcoesFiltros.regionais.map(regional => (
                                        <option key={regional} value={regional}>{regional}</option>
                                    ))}
                                </select>
                                </div>
                                {/* Alteração: preenchendo o select de unidade com opções dinâmicas */}
                                <div className="select-options">
                                <i className="fas fa-map-marker-alt"></i>     
                                <select id="unidade" name="unidade" value={filters.unidade} onChange={handleChange}>
                                    <option value="">Unidade</option>
                                    {opcoesFiltros.unidades.map(unidade => (
                                        <option key={unidade} value={unidade}>{unidade}</option>
                                    ))}
                                </select>
                                </div>
                            </div>
                            
                        </div>
                        <div>
                            <div className="impressao_card">
                                <div>
                                    <h1>Impressões totais</h1>
                                    <label>{impressaoTotal}</label>
                                </div>
                                <div>
                                    <h1>Impressoras coloridas</h1>
                                    <label>{impressorasCor}</label>
                                </div>
                                <div>
                                    <h1>Impressoras Monocromáticas</h1>
                                    <label>{impressorasPB}</label>
                                </div>
                                <button>Gerar Relatório Geral</button>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="middle-part">  
                    <div className="middle_containers">
                    <h1>Distribuição de impressões por Tipo</h1>
                    <div className="div_graficos">
                    <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data2}
                            innerRadius={75}
                            outerRadius={120}
                            cx="30%"
                            cy="75%"
                            labelLine={false}
                            fill="#8884d8"
                            dataKey="value"
                            label={renderCustomizedLabel}  
                        >
                            {data2.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend width={150} wrapperStyle={{ top: 70, right:220, backgroundColor: '#f5f5f5', border: '1px solid #d5d5d5', borderRadius: 3, lineHeight: '40px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                    </div>
                    </div>
                    <div className="middle_containers">
                    <h1>Número de impressões por localidade</h1>
                    <div className="div_graficos">
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={filteredData}
                        layout="vertical"
                        margin={{
                        top: 20, right: 30, left: 20, bottom: 5,
                        }}
                    >
                        <XAxis type="number" />
                        <YAxis dataKey="cidade" type="category" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="TotalPB" fill="#03326D" />
                        <Bar dataKey="TotalCor" fill="#007235" />
                    </BarChart>
                    </ResponsiveContainer>
                    </div>
                    </div>
                </div>
                <div className="bottom-part">
                        <h1>Número de equipamentos por unidade</h1>
                    <div>
                    <ResponsiveContainer width="95%" height="100%">
                    <BarChart
                        data={data1}
                        layout="vertical"
                    >
                        <XAxis type="number" >
                            <Label value="Número de Equipamentos" offset={0} position="bottom" />
                        </XAxis>
                        <YAxis dataKey="semana" type="category"/>
                        <Legend width={100} wrapperStyle={{ top: 40, right: 20, backgroundColor: '#f5f5f5', border: '1px solid #d5d5d5', borderRadius: 3, lineHeight: '40px' }} />
                        <Tooltip wrapperStyle={{ width: 100, backgroundColor: '#007235' }} />
                        <Bar dataKey="ativa" fill="#007235" />
                    </BarChart>
                    </ResponsiveContainer>
                    </div>
                </div>
            </div></>
        )
    }