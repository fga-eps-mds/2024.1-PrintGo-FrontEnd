import React, { useState ,useEffect} from "react";
import '../Dashboard/dashboard.css'
import Navbar from "../../components/navbar/Navbar";
import { LineChart, Line, CartesianGrid, XAxis, YAxis,ResponsiveContainer,Tooltip,Legend,PieChart,Pie,Cell,Bar,BarChart,Label} from 'recharts';
import data from './data.json'
import { getImpressoesTotais, getImpressorasColoridas} from "../../services/dasboardService";
export default function Dashboard() {
    const [impressaoTotal, setImpressao]  = useState('0')
    const [impressorasCor, setImpressoraColorida]  = useState('0')

    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const data = await getImpressoesTotais();
            
            if (data.type === 'success' && data.data) {
              setImpressao(data.data.totalImpressions);
              console.log(data.data.totalImpressions);
            } else {
              console.log('erro')
            }
          } catch(error) {
            console.log('Erro ao buscar dados do usuário:', error);
            
          }
        }
        fetchUserData();
        const fetchImpressorasCorData = async () => {
            try {
              const data = await getImpressorasColoridas();
              
              if (data.type === 'success' && data.data) {
                setImpressoraColorida(data.data.colorPrintersCount);
                console.log(data.data.colorPrintersCount);
              } else {
                console.log('erro')
              }
            } catch(error) {
              console.log('Erro ao buscar dados do usuário:', error);
              
            }
          }
          fetchImpressorasCorData();
      }, []);

    const [filters, setFilters] = useState({
        periodo: '',
        cidade: '',
        regional: '',
        unidade: '',
      });
    const data1 = [
        { semana: 'Semana 1', ativa: 120, inativa: 80 },
        { semana: 'Semana 2', ativa: 150, inativa: 70 },
        { semana: 'Semana 3', ativa: 130, inativa: 90 },
        { semana: 'Semana 4', ativa: 170, inativa: 60 },
      ];
      const data2 = [
        { name: 'Ativa', value: 120 },
        { name: 'Inativa', value: 80 },
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
            const handleChange = (e) => {
            setFilters({
              ...filters,
              [e.target.name]: e.target.value,
            });
          };
        
          const filteredData = data.filter(item => 
            (!filters.periodo || item.periodo === filters.periodo) &&
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
                        <select id="periodo" name="periodo" value={filters.periodo} onChange={handleChange} >
                            <option value="">Período</option>
                            <option value="2023">2023</option>
                            <option value="2024">2024</option>
                          
                        </select>
                        <select id="cidade" name="cidade" value={filters.cidade}  onChange={handleChange} >
                            <option value="">Cidade</option>
                            <option value="São Paulo">São Paulo</option>
                            <option value="Rio de Janeiro">Rio de Janeiro</option>
                            <option value="Belo Horizonte">Belo Horizonte</option>
                        </select>
                        <select id="regional" name="regional" value={filters.regional} onChange={handleChange} >
                            <option value="">Regional</option>
                            <option value="Sudeste">Sudeste</option>
                            <option value="Sul">Sul</option>
                            <option value="Centro-Oeste<">Centro-Oeste</option>
                        </select>
                        <select id="unidade" name="unidade" value={filters.unidade} onChange={handleChange} >
                            <option value="">Unidade</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
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
                                <label>56</label>
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
                <h1>Número de páginas por localidade</h1>
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
                    <Bar dataKey="nomeCampoX" fill="#03326D" />
                    <Bar dataKey="nomeCampoY" fill="#007235" />
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
                    data={data1}
                    layout="vertical"
                >
                    <XAxis type="number" >
                        <Label value="Número de Equipamentos" offset={0} position="bottom" />
                    </XAxis>
                    <YAxis dataKey="semana" type="category"/>
                    <Tooltip wrapperStyle={{ width: 100, height:20, backgroundColor: '#007235' }} />
                    <Legend width={100} wrapperStyle={{ top: 40, right: 20, backgroundColor: '#f5f5f5', border: '1px solid #d5d5d5', borderRadius: 3, lineHeight: '40px' }} />
                    <Bar dataKey="ativa" fill="#007235" />
                </BarChart>
                </ResponsiveContainer>
                </div>
            </div>
        </div></>
    )
}