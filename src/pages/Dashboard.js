import React, { useState, useEffect } from "react";
import "../style/pages/dashboard.css";
import Navbar from "../components/navbar/Navbar";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, PieChart, Pie, Cell, Bar, BarChart, Label, LabelList } from 'recharts';
import { getFiltroOpcoes, getDashboardData, getDashboardPdf } from "../services/dasboardService";
import '@fortawesome/fontawesome-free/css/all.min.css';
import PropTypes from 'prop-types';
import jsPDF from "jspdf";
import "jspdf-autotable"; // se quiser adicionar tabelas no PDF
import "../style/pages/dashboard.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "../assets/logo.png";





export default function Dashboard() {
    const [impressaoTotal, setImpressao] = useState(0)
    const [impressorasCor, setImpressoraColorida] = useState(0)
    const [impressorasPB, setImpressoraPB] = useState(0)
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

        // Definindo a largura e altura da imagem
        const logoWidth = 20; // Largura da imagem
        const logoHeight = 20; // Altura da imagem

        // Calculando a posição X para centralizar a imagem
        const x = (pageWidth - logoWidth) / 2;

        // Adicionar logotipo
        const logoUrl = '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'; // Substitua pelo seu base64 ou URL
        doc.addImage(logoUrl, 'PNG', x, 5, 20, logoHeight); // Ajuste as coordenadas e o tamanho conforme necessário

        // Cabeçalho
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text("Relatório do Dashboard", 10, 30); // Ajuste a posição para que o texto não sobreponha o logotipo

        // Tabela de informações do filtro
        const filterData = [
            ["Filtro", "Valor"],
            ["Período", filters.periodo || 'Todos'],
            ["Cidade", filters.cidade || 'Todas'],
            ["Regional", filters.regional || 'Todas'],
            ["Unidade", filters.unidade || 'Todas']
        ];

        doc.autoTable({
            head: filterData.slice(0, 1),
            body: filterData.slice(1),
            startY: 40, // Ajuste a posição inicial conforme necessário
            theme: 'grid',
            styles: { fontSize: 10 },
            headStyles: { fillColor: [13, 61, 109] },
            margin: { left: 10, right: 10 },
            columnStyles: {
                0: { cellWidth: 80 }, // Largura da coluna "Filtro"
                1: { cellWidth: 110 } // Largura da coluna "Valor"
            }
        });

        // Adicionando informações gerais em tabela
        const generalInfoData = [
            ["Informação Geral", "Valor"],
            ["Impressões Totais", impressaoTotal],
            ["Impressoras Coloridas", impressorasCor],
            ["Impressoras PB", impressorasPB]
        ];

        doc.autoTable({
            head: generalInfoData.slice(0, 1),
            body: generalInfoData.slice(1),
            startY: doc.autoTable.previous.finalY + 10, // Ajuste a posição inicial conforme necessário
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


        // Exemplo de tabela com impressões por localidade

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

        // Salvando o PDF
        doc.save(`Dashboard_Report_${filters.periodo || 'todos'}.pdf`);
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
                                        {opcoesFiltros.periodos.map(periodo => (
                                            <option key={periodo} value={periodo}>{periodo}</option>
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
                    <h1>Número de equipamentos por localidade</h1>
                    <div>
                        <ResponsiveContainer width="95%" height="100%">
                            <BarChart
                                data={equipmentCountByUnit}
                                layout="vertical"
                            >
                                <XAxis type="number" >
                                    <Label value="Número de Equipamentos" offset={0} position="bottom" />
                                </XAxis>
                                <YAxis dataKey="localizacao" type="category" />
                                <Tooltip contentStyle={{ maxHeight: '60px', maxWidth: '250px', overflowY: 'auto' }} />
                                <Legend width={150} wrapperStyle={{ top: 40, right: 20, backgroundColor: '#f5f5f5', border: '1px solid #d5d5d5', borderRadius: 3, lineHeight: '40px' }} />
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