import React, { useEffect, useState } from 'react';
import '../style/pages/viewPrinter.css';
import Navbar from "../components/navbar/Navbar";
import Button from "../components/Button.js";
import SelectContainer from '../components/containers/SelectContainer.js';
import '../style/pages/auditPrinter.css';
import ItemBox from '../components/containers/ItemBox.js';
import AuditBox from '../components/containers/AuditBox.js';

export default function AuditPrinter() {
    const [contratos, setContratos] = useState([]);
    const [selectedContrato, setSelectedContrato] = useState('');

    const handleContratoChange = (event) => {
        setSelectedContrato(event.target.value);
    };

    return (
        <>
            <Navbar />
            <div className='page'>
                <div className='header'>
                    <h1 className="titulo">Auditoria</h1>
                    <div className='search-bar container'>
                        <Button
                            type="info"
                            size="large"
                            text="Gerar Relatório do Contrato"
                            disabled={true}

                        />
                        <SelectContainer
                            id="contrato"
                            name="contrato"
                            options={contratos}
                            className="lg-select search-select"
                            label="Contrato"
                            onChange={handleContratoChange}
                            value={selectedContrato}
                            containerStyle="search-select"
                        />
                    </div>
                </div>
                <div className='columns'>
                    <h2 className='equipamento'>Equipamentos</h2>
                    <h2 className='cont-atual'>Cont.Atual</h2>
                    <h2 className='cont-loc'>Cont.Locadora</h2>
                    <h2 className='tot-printgo'>Tot.Impressões PrintGo</h2>
                    <h2 className='tot-loc'>Tot.Impressões Locadora</h2>
                </div>
                <div>
                    <AuditBox />
                    <AuditBox />
                    <AuditBox />
                    <AuditBox />
                    <AuditBox />
                    <AuditBox />
                    <AuditBox />
                    <AuditBox />
                    <AuditBox />
                </div>
            </div>
        </>
    )
}