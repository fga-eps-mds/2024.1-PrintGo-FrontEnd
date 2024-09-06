import React from "react";
import PropTypes from "prop-types";
import "../../style/components/auditBox.css";
import imageButton from "../../assets/report.png"

const AuditBox = ({ equipamento, contadorCor, contadorCorAnterior, contadorPB, contadorPBAnterior, contadorLocPB, contadorLocCor, totPrintgoCor, totPrintgoPB, totLoc, onClick, marginError }) => {
    let errorClass = "";
    if (Math.abs(contadorCor - contadorLocCor) > marginError || Math.abs(contadorPB - contadorLocPB) > marginError || Math.abs((contadorCor + contadorPB) - totLoc) > marginError) {
        errorClass = "box-error";
    }

    return (
        <div className={`box ${errorClass}`}>
            <h2 className="audit-box-element">{equipamento}</h2>
            <h2 className="audit-box-element-color">{contadorCorAnterior}</h2>
            <h2 className="audit-box-element-color">{contadorCor}</h2>
            <h2 className="audit-box-element-pb">{contadorPBAnterior}</h2>
            <h2 className="audit-box-element-pb">{contadorPB}</h2>
            <h2 className="audit-box-element">{totPrintgoCor}</h2>
            <h2 className="audit-box-element">{totPrintgoPB}</h2>
            <h2 className="audit-box-element">{contadorLocCor}</h2>
            <h2 className="audit-box-element">{contadorLocPB}</h2>
            <h2 className="audit-box-element">{totLoc}</h2>
            <div className="audit-box-element-report">
                <button className="report" onClick={onClick} data-testid="report-image" >
                    <img src={imageButton} alt="Button" className="report-image" />
                </button>
            </div>
        </div>

    );
};

AuditBox.propTypes = {
    equipamento: PropTypes.string,
    contadorCor: PropTypes.number,
    contadorCorAnterior: PropTypes.number,
    contadorPB: PropTypes.number,
    contadorPBAnterior: PropTypes.number,
    contadorLocPB: PropTypes.number,
    contadorLocCor: PropTypes.number,
    totPrintgoCor: PropTypes.number,
    totPrintgoPB: PropTypes.number,
    totLoc: PropTypes.number,
    ativo: PropTypes.bool,
    onClick: PropTypes.func,
    marginError: PropTypes.number,
};

AuditBox.defaultProps = {
    contadorCor: 0,
    contadorPB: 0,
    contadorCorAnterior: 0,
    contadorPBAnterior: 0,
    contadorLocPB: 0,
    contadorLocCor: 0,
    totPrintgoCor: 0,
    totPrintgoPB: 0,
    totLoc: 0,
    marginError: 0,
};

export default AuditBox;
