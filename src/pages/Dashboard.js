    import React, { useState ,useEffect} from "react";
    import '../style/pages/dashboard.css'
    import Navbar from "../components/navbar/Navbar";
    import { LineChart, Line, XAxis, YAxis,ResponsiveContainer,Tooltip,Legend,PieChart,Pie,Cell,Bar,BarChart,Label,LabelList} from 'recharts';
    import { getFiltroOpcoes, getDashboardData} from "../services/dasboardService";



    export default function Dashboard() {
        const [impressaoTotal, setImpressao]  = useState(0)
        const [impressorasCor, setImpressoraColorida]  = useState(0)
        const [impressorasPB, setImpressoraPB]  = useState(0)
        const [impressionsByLocation, setImpressionsByLocation] = useState([]);
        const [impressionsByType, setImpressionsByType] = useState({ totalPB: 0, totalCor: 0 });
        const [equipmentCountByUnit, setEquipmentCountByUnit] = useState([]);


        const [filters, setFilters] = useState({
            periodo: '',
            cidade: '',
            regional: '',
            unidade: '',
        });
        const [opcoesFiltros, setOpcoesFiltros] = useState({
            periodos: [],
            cidades: [],
            regionais: [],
            unidades: []
        });

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
            const fetchFiltroOpcoes = async () => {
                try {
                    const data = await getFiltroOpcoes();
                    if (data.type === 'success' && data.data) {
                        setOpcoesFiltros({
                            cidades: data.data.cidades,
                            regionais: data.data.regionais,
                            unidades: data.data.unidades,
                            periodos: data.data.periodos
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
            const fetchDashboardData = async () => {
                try {
                    const response = await getDashboardData(); // Faz a requisição ao backend e obtém o JSON
        
                    console.log("Dados recebidos do backend:", response);
        
                    if (response && response.data && response.data.impressoras) {
                        const data = response.data;
        
                        // Filtrando dados no frontend com base nos filtros aplicados
                        const filteredImpressoras = data.impressoras.filter((impressora) => {
                            const [cidade, regional, unidade] = impressora.localizacao.split(';');
                            const periodo = impressora.dataContador ? new Date(impressora.dataContador).toISOString().slice(0, 7) : '';
        
                            return (
                                (!filters.periodo || periodo === filters.periodo) &&
                                (!filters.cidade || cidade === filters.cidade) &&
                                (!filters.regional || regional === filters.regional) &&
                                (!filters.unidade || unidade === filters.unidade)
                            );
                        });
        
                        console.log("Impressoras após filtragem:", filteredImpressoras);
        
                        // Calculando o total de impressões (PB + Cor) após aplicação dos filtros
                        const totalImpressions = filteredImpressoras.reduce((acc, impressora) => {
                            return acc + impressora.contadorAtualPB + impressora.contadorAtualCor;
                        }, 0);
        
                        console.log("Total de impressões calculado:", totalImpressions);
        
                        // Contando impressoras coloridas e monocromáticas após aplicação dos filtros
                        const impressorasCor = filteredImpressoras.filter(impressora =>
                            data.colorModelIds.includes(impressora.modeloId)
                        ).length;
        
                        const impressorasPB = filteredImpressoras.filter(impressora =>
                            data.pbModelIds.includes(impressora.modeloId)
                        ).length;
        
                        console.log("Quantidade de impressoras coloridas:", impressorasCor);
                        console.log("Quantidade de impressoras monocromáticas:", impressorasPB);
        
                        // Calculando o total de impressões por tipo para o gráfico de distribuição
                        const totalPB = filteredImpressoras.reduce((acc, impressora) => acc + impressora.contadorAtualPB, 0);
                        const totalCor = filteredImpressoras.reduce((acc, impressora) => acc + impressora.contadorAtualCor, 0);
                        setImpressionsByType({ totalPB, totalCor });
        
                        // Agrupando os dados por localização para o gráfico de número de equipamentos por unidade
                        const equipmentCount = filteredImpressoras.reduce((acc, impressora) => {
                            const [cidade, regional, unidade] = impressora.localizacao.split(';');
                            const key = `${cidade};${regional};${unidade}`;
                            if (!acc[key]) {
                                acc[key] = {
                                    localizacao: `${cidade};${regional};${unidade}`,
                                    totalEquipamentos: 0,
                                };
                            }
                            acc[key].totalEquipamentos += 1;
                            return acc;
                        }, {});
        
                        const equipmentCountArray = Object.values(equipmentCount);
                        console.log("Dados para o gráfico de número de equipamentos por unidade:", equipmentCountArray);  
                        setEquipmentCountByUnit(equipmentCountArray);
        
                        // Agrupando dados para impressões por localidade (substituindo fetchImpressionsByLocation)
                        const groupedData = filteredImpressoras.reduce((acc, item) => {
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
        
                        console.log("Dados agrupados e transformados para gráficos:", transformedData);
                        setImpressionsByLocation(transformedData);
        
                        // Atualizando o estado com os valores calculados
                        animateCount(setImpressao, impressaoTotal, totalImpressions);
                        animateCount(setImpressoraColorida, impressorasCor, impressorasCor);
                        animateCount(setImpressoraPB, impressorasPB, impressorasPB);
        
                    } else {
                        console.log("Dados de impressoras não encontrados ou estrutura incorreta.");
                    }
                } catch (error) {
                    console.log('Erro ao buscar dados do dashboard:', error);
                }
            };
        
            fetchDashboardData();
            
            
            
            
            // Chamando as funções de fetch
            fetchDashboardData();
            
            
        }, [filters]); // Refaz a requisição sempre que os filtros mudarem
        
        const handleChange = (e) => {
            setFilters({
                ...filters,
                [e.target.name]: e.target.value,
            });
        };
        

        
        

        const data1 = [
            { semana: 'Semana 1', ativa: 120, inativa: 80 },
            { semana: 'Semana 2', ativa: 150, inativa: 70 },
            { semana: 'Semana 3', ativa: 130, inativa: 90 },
            { semana: 'Semana 4', ativa: 170, inativa: 60 },
        ];
        const data2 = [
            { name: 'PB', value: impressionsByType.totalPB },
            { name: 'Cor', value: impressionsByType.totalCor },
        ];

        const COLORS = ['#03326D', '#007235'];
        const RADIAN = Math.PI / 180;
            const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);

            return (
                <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
                </text>
            );
            };
                
            
            
            
        return (
            <><Navbar/>
            <div className="container-dash">
                <div className="top-container">
                    <div className="top-part1">
                        <div className="dash_periodo">
                            <h1>Dashboard</h1>
                            <div className="select-pel">
                            {/* Alteração: Seleção de período (mensal) baseada nas opções geradas */}
                            <select id="periodo" name="periodo" value={filters.periodo} onChange={handleChange}>
                                        <option value="">Período</option>
                                        {opcoesFiltros.periodos.map(periodo => (
                                            <option key={periodo} value={periodo}>{periodo}</option>
                                        ))}
                                    </select>
                        {/* Alteração: preenchendo o select de cidade com opções dinâmicas */}
                        <select id="cidade" name="cidade" value={filters.cidade} onChange={handleChange}>
                                    <option value="">Cidade</option>
                                    {opcoesFiltros.cidades.map(cidade => (
                                        <option key={cidade} value={cidade}>{cidade}</option>
                                    ))}
                                </select>
                                {/* Alteração: preenchendo o select de regional com opções dinâmicas */}
                                <select id="regional" name="regional" value={filters.regional} onChange={handleChange}>
                                    <option value="">Regional</option>
                                    {opcoesFiltros.regionais.map(regional => (
                                        <option key={regional} value={regional}>{regional}</option>
                                    ))}
                                </select>
                                {/* Alteração: preenchendo o select de unidade com opções dinâmicas */}
                                <select id="unidade" name="unidade" value={filters.unidade} onChange={handleChange}>
                                    <option value="">Unidade</option>
                                    {opcoesFiltros.unidades.map(unidade => (
                                        <option key={unidade} value={unidade}>{unidade}</option>
                                    ))}
                                </select>
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
                            </div>
                        </div>
                    </div>
                    <div className="top-part2">
                        <div className="contadores_card">
                            <label>CONTADORES NESTA UNIDADE</label>
                            <div>
                                <label>Impressora 1: 400</label>
                                <label>Impressora 2: 322</label>
                                <label>Impressora 3: 567</label>
                                <label>Impressora 4: 324</label>
                                <label>Impressora 5: 1234</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="middle-part">  
                    <div className="middle_containers">
                    <h1>Impressoras ativas e inativas</h1>
                    <div className="div_graficos">
                        
                        <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data1}>
                        <Line dataKey="ativa" stroke="#8884d8" />
                        <Line dataKey="inativa" stroke="#007438" />
                        <XAxis dataKey="semana" />
                        <YAxis />
                        <Tooltip />
                        <Legend verticalAlign="top" height={36}/>
                        </LineChart>
                        </ResponsiveContainer>
                    </div>
                    </div>
                    <div className="middle_containers">
                    <h1>Distribuição de impressões por Tipo</h1>
                    <div className="div_graficos">
                    <ResponsiveContainer width="100%" height="100%">
                    <PieChart width={400} height={400}>
                        <Pie
                            data={data2}
                            innerRadius={25}
                            outerRadius={80}
                            cx="30%"
                            cy="65%"
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
                        <Legend width={100} wrapperStyle={{ top: 50, right:160, backgroundColor: '#f5f5f5', border: '1px solid #d5d5d5', borderRadius: 3, lineHeight: '40px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                    </div>
                    </div>
                    <div className="middle_containers">
                    <h1>Número de impressões por localidade</h1>
                    <div className="div_graficos">
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={impressionsByLocation}
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
                    <ResponsiveContainer width="90%" height="100%">
                    <BarChart
                        data={equipmentCountByUnit}
                        layout="vertical"
                    >
                        <XAxis type="number" >
                            <Label value="Número de Equipamentos" offset={0} position="bottom" />
                        </XAxis>
                        <YAxis dataKey="localização" type="category"/>
                        <Tooltip wrapperStyle={{ width: 100, height:20, backgroundColor: '#007235' }} />
                        <Legend width={100} wrapperStyle={{ top: 40, right: 20, backgroundColor: '#f5f5f5', border: '1px solid #d5d5d5', borderRadius: 3, lineHeight: '40px' }} />
                        <Bar dataKey="totalEquipamentos" fill="#007235">
                            <LabelList dataKey="localizacao" position="right" formatter={(value) => value.split(';')[0]} />
                        </Bar> 
                        
                    </BarChart>
                    </ResponsiveContainer>
                    </div>
                </div>
            </div></>
        )
    }