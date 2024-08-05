import React, { useEffect, useState } from 'react';
import '../style/pages/viewPrinter.css';
import Navbar from "../components/navbar/Navbar";
import Button from "../components/Button.js";
import SelectContainer from '../components/containers/SelectContainer.js';
import '../style/pages/auditPrinter.css';


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
            </div>
        </>
    )
}