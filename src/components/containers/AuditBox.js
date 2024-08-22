import React from "react";
import PropTypes from "prop-types";
import "../../style/components/auditBox.css";
import imageButton from "../../assets/report.png"

const AuditBox = ({ equipamento, contadorCor, contadorPB, contadorLocPB, contadorLocCor, totPrintgo, totLoc, onClick, marginError }) => {
    let errorClass = "";
    if (Math.abs(contadorCor - contadorLocCor) > marginError || Math.abs(contadorPB - contadorLocPB) > marginError || Math.abs(totPrintgo - totLoc) > marginError) {
        errorClass = "box-error";
    }

    return (
        <div className={`box ${errorClass}`}>
            <h2 className="audit-box-element">{equipamento}</h2>
            <h2 className="audit-box-element">{contadorCor}</h2>
            <h2 className="audit-box-element">{contadorPB}</h2>
            <h2 className="audit-box-element">{contadorLocCor}</h2>
            <h2 className="audit-box-element">{contadorLocPB}</h2>
            <h2 className="audit-box-element">{totPrintgo}</h2>
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
    contadorPB: PropTypes.number,
    contadorLocPB: PropTypes.number,
    contadorLocCor: PropTypes.number,
    totPrintgo: PropTypes.number,
    totLoc: PropTypes.number,
    ativo: PropTypes.bool,
    onClick: PropTypes.func,
    marginError: PropTypes.number,
};

AuditBox.defaultProps = {
    contadorCor: 0,
    contadorPB: 0,
    contadorLocPB: 0,
    contadorLocCor: 0,
    totPrintgo: 0,
    totLoc: 0,
    marginError: 0,
};

export default AuditBox;
