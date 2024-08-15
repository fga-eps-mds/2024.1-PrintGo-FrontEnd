import React from 'react';
import PropTypes from 'prop-types';
import '../style/components/UploadReport.css';
import Button from './Button.js';
import { toast } from "react-toastify";
import Papa from 'papaparse';

function UploadReport({ isOpen, onClose, onUpload }) {
    if (!isOpen) return null;

    const toCamelCase = (str) => {
        return str
            .toLowerCase()
            .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
                index === 0 ? match.toLowerCase() : match.toUpperCase()
            ).replace(/\s+/g, '');
    };

    const schema = {
        actualColorCounter: "number",
        actualMonoCounter: "number",
        brand: "string",
        customerDescription: "string",
        endTotalCounter: "number",
        lastUpdateTime: "string",
        model: "string",
        serialnumber: "string",
    };

    const validateObjectStructure = (obj, schema) => {
        for (const key in schema) {
            if (!Object.prototype.hasOwnProperty.call(obj, key)) {
                console.error(`Erro: Faltando o campo ${key} no objeto.`);
                return false;
            }
        }
        return true;
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.name.split('.').pop() !== 'csv') {
                toast.error('Arquivo inválido! Por favor, selecione um arquivo .csv');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const csvText = e.target.result;

                const parsedData = Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    dynamicTyping: true,
                });

                const cleanedData = parsedData.data.map(item => {
                    const cleanedItem = {};
                    Object.keys(item).forEach(key => {
                        const cleanedKey = toCamelCase(key.replace(/\[|\]/g, '').trim());
                        cleanedItem[cleanedKey] = item[key];
                    });

                    if (validateObjectStructure(cleanedItem, schema)) {
                        return cleanedItem;
                    } else {
                        toast.error('Erro na estrutura dos dados do CSV.');
                        return null;
                    }
                }).filter(item => item !== null);

                onUpload(cleanedData);
            };
            reader.readAsText(file);
        }
    };

    const handleDownloadTemplate = async () => {
        try {
            const response = await fetch('https://raw.githubusercontent.com/fga-eps-mds/2024.1-PrintGo-FrontEnd/dev/public/Modelo_Relatorio.csv');
            if (!response.ok) throw new Error('Erro ao buscar o arquivo');

            const csvContent = await response.text();
            console.log(csvContent);
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);

            link.setAttribute('href', url);
            link.setAttribute('download', 'Modelo_Relatorio.csv');
            link.style.visibility = 'hidden';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Erro ao baixar o arquivo:', error);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Upload do Relatório</h2>
                <input className='modal-input' type="file" accept=".xls,.xlsx,.xml,.csv" onChange={handleFileUpload} />

                <div className="modal-info">
                    <Button
                        text="Baixar Modelo de Relatório"
                        onClick={handleDownloadTemplate}
                        type="success"
                    />
                    <Button
                        text="Fechar"
                        onClick={onClose}
                        type="info"
                    />
                </div>
            </div>
        </div>
    );
}

UploadReport.defaultProps = {
    isOpen: false,
    onClose: () => { },
    onUpload: () => { }
};

UploadReport.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onUpload: PropTypes.func.isRequired
};

export default UploadReport;

