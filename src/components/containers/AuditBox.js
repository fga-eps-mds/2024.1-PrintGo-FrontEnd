import React from "react";
import PropTypes from "prop-types";
import "../../style/components/auditBox.css";
import imageButton from "../../assets/report.png"

const AuditBox = ({ equipamento, contadorAtual, contadorLoc, totPrintgo, totLoc, onClick, marginError }) => {
    let errorClass = "";
    if (Math.abs(contadorAtual - contadorLoc) > marginError || Math.abs(totPrintgo - totLoc) > marginError) {
        errorClass = "box-error";
    }

    return (
        <div className={`box ${errorClass}`}>
            <h2 className="equipamento-box">{equipamento}</h2>
            <h2 className="cont-atual-box">{contadorAtual}</h2>
            <h2 className="cont-loc-box">{contadorLoc}</h2>
            <h2 className="tot-printgo-box">{totPrintgo}</h2>
            <h2 className="tot-loc-box">{totLoc}</h2>
            <button className="report" onClick={onClick}>
                <img src={imageButton} alt="Button" className="report-image" />
            </button>
        </div>

    );
};

AuditBox.propTypes = {
    equipamento: PropTypes.string,
    contadorAtual: PropTypes.number,
    contadorLoc: PropTypes.number,
    totPrintgo: PropTypes.number,
    totLoc: PropTypes.number,
    ativo: PropTypes.bool,
    onClick: PropTypes.func,
    marginError: PropTypes.number,
};

AuditBox.defaultProps = {
    contadorAtual: 0,
    contadorLoc: 0,
    totPrintgo: 0,
    totLoc: 0,
};

export default AuditBox;
