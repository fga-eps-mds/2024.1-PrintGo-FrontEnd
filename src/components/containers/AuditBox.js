import React, { useState } from "react";
import PropTypes from "prop-types";
import "../../style/components/auditBox.css";
import { FaToggleOn, FaToggleOff, FaPencil, FaMagnifyingGlass } from "react-icons/fa6";
import Button from "../Button";
import imageButton from "../../assets/report.png"

const AuditBox = ({ equipamento, contadorAtual, contadorLoc, totLoc, totPrintgo }) => {

    return (
        <div className="box">
            <h2 className="equipamento-box">{equipamento}</h2>
            <h2 className="cont-atual-box">{contadorAtual}</h2>
            <h2 className="cont-loc-box">{contadorLoc}</h2>
            <h2 className="tot-loc-box">{totLoc}</h2>
            <h2 className="tot-printgo-box">{totPrintgo}</h2>
            <button className="report">
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
    onReadClick: PropTypes.func,
    onEditClick: PropTypes.func,
    onToggleClick: PropTypes.func,
};

AuditBox.defaultProps = {
    equipamento: "Default Equipamento",
    contadorAtual: 170,
    contadorLoc: 0,
    totPrintgo: 0,
    totLoc: 0,
};

export default AuditBox;