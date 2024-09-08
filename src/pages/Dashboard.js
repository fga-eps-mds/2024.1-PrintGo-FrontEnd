import React, { useState, useEffect } from "react";
import "../style/pages/dashboard.css";
import Navbar from "../components/navbar/Navbar";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, PieChart, Pie, Cell, Bar, BarChart, Label, LabelList } from 'recharts';
import { getFiltroOpcoes, getDashboardData } from "../services/dasboardService";
import '@fortawesome/fontawesome-free/css/all.min.css';
import PropTypes from 'prop-types';
import jsPDF from "jspdf";
import "jspdf-autotable"; // se quiser adicionar tabelas no PDF
import { LOGO_BASE64 } from "../utils/logo";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';



export function formatDate(dateString) {
    if (dateString === "") return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
}

export const animateCount = (setter, start, end, duration = 1000) => {
    // if (process.env.NODE_ENV === 'test') {
    //     // No animation in test environment, set directly
    //     setter(end);
    //     return;
    // }
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


export default function Dashboard() {
    const [impressaoTotal, setImpressao] = useState(0)
    const [impressorasCor, setImpressoraColorida] = useState(0)
    const [impressorasPB, setImpressoraPB] = useState(0)
    const [impressionsByLocation, setImpressionsByLocation] = useState([]);
    const [impressionsByType, setImpressionsByType] = useState({ totalPB: 0, totalCor: 0 });
    const [equipmentCountByUnit, setEquipmentCountByUnit] = useState([]);

    const [filters, setFilters] = useState({
        inicio: '',
        fim: '',
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
                }
            } catch (error) {
                console.log('Erro ao buscar opções de filtros:', error);
            }
        };

        fetchFiltroOpcoes();
    }, []);

    const CustomTooltip = ({ payload, label, active }) => {
        if (active && payload && payload.length) {
          const { regional, unidade, totalEquipamentos } = payload[0].payload;
          return (
            <div style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '10px',  maxWidth: '250px', maxHeight: '85px',  x: null, y: null  }}>
              <p>{`${regional}  -  `}{`${unidade}`}</p>
              <p style={{ color: '#007438' }}>{`Total de Equipamentos: ${totalEquipamentos}`}</p>
            </div>
          );
        }
      
        return null;
      };
      
      // Validando prop-types
      CustomTooltip.propTypes = {
        payload: PropTypes.array,
        label: PropTypes.string,
        active: PropTypes.bool,
      };

      const CustomTooltip2 = ({ payload, label, active }) => {
        if (active && payload && payload.length) {
          const { regional, unidade, TotalCor,TotalPB } = payload[0].payload;
          return (
            <div style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '10px', }}>
              <p>{`${regional}  -  `}{`${unidade}`}</p>
              <p style={{ color: '#007438' }}>{`Total Colorida: ${TotalCor}`}</p>
              <p style={{ color: '#03326D' }}>{`Total PB: ${TotalPB}`}</p> {/* Texto em azul */}
            </div>
          );
        }
      
        return null;
      };
      
      // Validando prop-types
      CustomTooltip2.propTypes = {
        payload: PropTypes.array,
        label: PropTypes.string,
        active: PropTypes.bool,
      };

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
                        const dataContador = impressora.dataContador ? new Date(impressora.dataContador) : null;

                        const dentroDoPeriodo = (!filters.inicio || dataContador >= new Date(filters.inicio)) &&
                            (!filters.fim || dataContador <= new Date(filters.fim));

                        return (
                            dentroDoPeriodo &&
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
                                cidade: cidade,
                                regional: regional,
                                unidade: unidade || '',
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

    }, [filters]);

    const handleChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;

        const logoWidth = 20; // Largura da imagem
        const logoHeight = 20; // Altura da imagem

        // posição X para centralizar a imagem
        const x = (pageWidth - logoWidth) / 2;

        // logotipo
        const logoPrintgo = LOGO_BASE64;
        doc.addImage(logoPrintgo, 'PNG', x, 5, 20, logoHeight);

        // Cabeçalho
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text("Relatório do Dashboard", 10, 30);

        let periodoInterval = "";

        if (filters.inicio === "" && filters.fim === "") {
            periodoInterval = "Até hoje";
        } else if (filters.inicio !== "" && filters.fim === "") {
            periodoInterval = `De: ${formatDate(filters.inicio)} até Hoje`;
        } else if (filters.inicio === "" && filters.fim !== "") {
            periodoInterval = `Até ${formatDate(filters.fim)}`;
        } else {
            periodoInterval = `De: ${formatDate(filters.inicio)} até: ${formatDate(filters.fim)}`;
        }

        // Tabela de informações do filtro
        const filterData = [
            ["Filtro", "Valor"],
            ["Período", `${periodoInterval}`],
            ["Cidade", filters.cidade || 'Todas'],
            ["Regional", filters.regional || 'Todas'],
            ["Unidade", filters.unidade || 'Todas']
        ];

        doc.autoTable({
            head: filterData.slice(0, 1),
            body: filterData.slice(1),
            startY: 40,
            theme: 'grid',
            styles: { fontSize: 10 },
            headStyles: { fillColor: [13, 61, 109] },
            margin: { left: 10, right: 10 },
            columnStyles: {
                0: { cellWidth: 80 }, // Largura da coluna "Filtro"
                1: { cellWidth: 110 } // Largura da coluna "Valor"
            }
        });

        // informações gerais 
        const generalInfoData = [
            ["Informação Geral", "Valor"],
            ["Impressões Totais", impressaoTotal],
            ["Impressoras Coloridas", impressorasCor],
            ["Impressoras PB", impressorasPB]
        ];

        doc.autoTable({
            head: generalInfoData.slice(0, 1),
            body: generalInfoData.slice(1),
            startY: doc.autoTable.previous.finalY + 10,
            theme: 'grid',
            styles: { fontSize: 10 },
            headStyles: { fillColor: [13, 61, 109] },
            margin: { left: 10, right: 10 },
            columnStyles: {
                0: { cellWidth: 80 }, // Largura da coluna "Filtro"
                1: { cellWidth: 110 } // Largura da coluna "Valor"
            }

        });


        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Distribuição de Impressões por Localidade", 10, doc.autoTable.previous.finalY + 20);


        // tabela com impressões por localidade

        doc.autoTable({
            head: [["Localização", "Total Impressões PB", "Total Impressões Cor", "Equipamentos"]],
            body: impressionsByLocation.map(loc => [
                `${loc.cidade} - ${loc.regional} - ${loc.unidade}`,
                loc.TotalPB,
                loc.TotalCor,
                equipmentCountByUnit.find(equip => equip.localizacao === `${loc.cidade};${loc.regional};${loc.unidade}`)?.totalEquipamentos || 0,
            ]),
            startY: doc.autoTable.previous.finalY + 30,
            theme: 'grid',
            styles: { fontSize: 10 },
            headStyles: { fillColor: [13, 61, 109] },
            margin: { left: 10, right: 10 },
        });

        // Distribuição de impressões por tipo
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Distribuição de Impressões por Tipo", 10, doc.autoTable.previous.finalY + 20);

        const impressionsTypeData = [
            ["Tipo", "Quantidade", "Porcentagem"],
            ["PB", impressionsByType.totalPB, `${(((impressionsByType.totalPB) / (impressionsByType.totalPB + impressionsByType.totalCor)).toFixed(2)) * 100}%`],
            ["Cor", impressionsByType.totalCor, `${(((impressionsByType.totalCor) / (impressionsByType.totalPB + impressionsByType.totalCor)).toFixed(2)) * 100}%`],
        ];

        doc.autoTable({
            head: impressionsTypeData.slice(0, 1),
            body: impressionsTypeData.slice(1),
            startY: doc.autoTable.previous.finalY + 30,
            theme: 'grid',
            styles: { fontSize: 10 },
            headStyles: { fillColor: [13, 61, 109] },
            margin: { left: 10, right: 10 },
        });

        // Rodapé
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.text("Gerado automaticamente pelo sistema", 10, doc.internal.pageSize.height - 10);

        // Salva o PDF
        doc.save(`Dashboard_Report_${filters.periodo || 'todos'}.pdf`);

        // Exibe um toast de sucesso após gerar o PDF
        toast.success("PDF gerado com sucesso!");
    };





    const data2 = [
        { name: 'PB', value: impressionsByType.totalPB },
        { name: 'Cor', value: impressionsByType.totalCor },
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


    return (
        <><Navbar />
            <ToastContainer />
            <div className="container-dash">
                <div className="top-container">
                    <div className="top-part1">
                        <div className="dash_periodo">
                            <h1>Dashboard</h1>
                            <div className="select-pel">
                                <div className="select-options">
                                    <div>
                                        <label htmlFor="inicio" className="input-label" >
                                            <i className="fas fa-calendar-alt"></i>
                                            Início:
                                        </label>
                                        <input
                                            type="date"
                                            name="inicio"
                                            value={filters.inicio}
                                            onChange={handleChange}
                                            className="input-date"
                                            data-testid="inicio"
                                        />

                                        <label htmlFor="fim" className="input-label">Fim:</label>
                                        <input
                                            type="date"
                                            name="fim"
                                            value={filters.fim}
                                            onChange={handleChange}
                                            className="input-date"
                                            data-testid="fim"
                                        />
                                    </div>
                                </div>
                                {/* Alteração: preenchendo o select de cidade com opções dinâmicas */}
                                <div className="select-options">
                                    <i className="fas fa-map-marker-alt"></i>
                                    <select id="cidade" name="cidade" value={filters.cidade} onChange={handleChange} data-testid="cidade">
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
                                    <select id="regional" name="regional" value={filters.regional} onChange={handleChange} data-testid="regional">
                                        <option value="">Regional</option>
                                        {opcoesFiltros.regionais.map(regional => (
                                            <option key={regional} value={regional}>{regional}</option>
                                        ))}
                                    </select>
                                </div>
                                {/* Alteração: preenchendo o select de unidade com opções dinâmicas */}
                                <div className="select-options">
                                    <i className="fas fa-map-marker-alt"></i>
                                    <select id="unidade" name="unidade" value={filters.unidade} onChange={handleChange} data-testid="unidade">
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
                                <button onClick={generatePDF}>Gerar PDF</button>
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
                                    <Legend width={150} wrapperStyle={{ top: 70, right: 220, backgroundColor: '#f5f5f5', border: '1px solid #d5d5d5', borderRadius: 3, lineHeight: '40px' }} />
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
                                    <Tooltip content={<CustomTooltip2 />} />
                                    <Legend />
                                    <Bar dataKey="TotalPB" fill="#03326D" />
                                    <Bar dataKey="TotalCor" fill="#007235" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
                <div className="bottom-part">
                    <h1>Número de equipamentos por localidade</h1>
                    <div>
                        <ResponsiveContainer width="95%" height="100%">
                            <BarChart
                                data={equipmentCountByUnit}
                                margin={{left: 80}}
                                layout="vertical"
                            >
                                <XAxis type="number" >
                                    
                                </XAxis>
                                <YAxis dataKey="cidade" type="category" />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
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