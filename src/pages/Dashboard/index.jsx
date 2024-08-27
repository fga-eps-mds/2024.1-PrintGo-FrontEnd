import React, { useState } from "react";
import '../Dashboard/dashboard.css'
import Navbar from "../../components/navbar/Navbar";
import { LineChart, Line, CartesianGrid, XAxis, YAxis,ResponsiveContainer,Tooltip,Legend,PieChart,Pie,Cell,Bar,BarChart,Label} from 'recharts';

export default function Dashboard() {
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
    return (
        <><Navbar/>
        <div className="container">
            <div className="top-container">
                <div className="top-part1">
                    <div className="dash_periodo">
                        <h1>Dashboard</h1>
                        <div className="select-pel">
                        <select id="NivelEscolar" name="NivelEscolar" >
                            <option value="">Selecione</option>
                            <option value="fundamental">Fundamental</option>
                            <option value="medio">Médio</option>
                            <option value="superior">Superior</option>
                        </select>
                        <select id="NivelEscolar" name="NivelEscolar" >
                            <option value="">Selecione</option>
                            <option value="fundamental">Fundamental</option>
                            <option value="medio">Médio</option>
                            <option value="superior">Superior</option>
                        </select>
                        <select id="NivelEscolar" name="NivelEscolar" >
                            <option value="">Selecione</option>
                            <option value="fundamental">Fundamental</option>
                            <option value="medio">Médio</option>
                            <option value="superior">Superior</option>
                        </select>
                        </div>
                        
                    </div>
                    <div>
                        <div className="impressao_card">
                            <div>
                                <h1>Impressões totais</h1>
                                <label>350</label>
                            </div>
                            <div>
                                 <h1>Páginas Impressas</h1>
                                <label>738</label>
                            </div>
                            <div>
                                <h1>Número de Impressões</h1>
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
                    data={data1}
                    layout="vertical"
                    margin={{
                    top: 20, right: 30, left: 20, bottom: 5,
                    }}
                >
                    <XAxis type="number" />
                    <YAxis dataKey="semana" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="ativa" fill="#03326D" />
                    <Bar dataKey="inativa" fill="#007235" />
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