import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import "../../style/components/printerPatternForm.css";
import { getRegisterPatternSchema } from "../utils/YupSchema";
import { ReloadIcon } from "@radix-ui/react-icons";
import { createPadraoImpressora } from "../../services/patternService";
import { toast } from "react-toastify";

const fieldLabels = {
  tipo: "Tipo",
  marca: "Marca",
  modelo: "Modelo",
  snmp: {
    modeloImpressora: "Modelo da impressora",
    numeroSerie: "Número de série",
    versaoFirmware: "Versão do Firmware",
    tempoAtivoSistema: "Tempo ativo do sistema",
    totalDigitalizacoes: "Total de digitalizações",
    totalCopiasPB: "Total de cópias P&B",
    totalCopiasColoridas: "Total de cópias coloridas",
    totalGeral: "Total geral",
  },
};

export default function PrinterPatternForm() {
  const [tipo, setTipo] = useState("")
  const [marca, setMarca] = useState("")
  const [modelo, setModelo] = useState("")
  const [isColorido, setIsColorido] = useState(false)
  const [oidModelo, setOidModelo] = useState("")
  const [oidNumeroSerie, setOidNumeroSerie] = useState("")
  const [oidFirmware, setOidFirmware] = useState("")
  const [oidTempoAtivo, setOidTempoAtivo] = useState("")
  const [oidDigitalizacoes, setOidDigitalizacoes] = useState("")
  const [oidCopiasPB, setOidCopiasPB] = useState("")
  const [oidCopiasCor, setOidCopiasCor] = useState("")
  const [oidTotalGeral, setOidTotalGeral] = useState("")
  const navigate = useNavigate()

  const registerPrinterSchema = getRegisterPatternSchema(fieldLabels);
  const {
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(registerPrinterSchema),
    mode: "onChange",
  });

  const createData = ()=>{
    return{
      "tipo": tipo,
      "marca": marca ,
      "modelo": modelo ,
      "colorido": isColorido,
      "oidModelo":  oidModelo || null,
      "oidNumeroSerie": oidNumeroSerie || null,
      "oidFirmware":  oidFirmware || null,
      "oidTempoAtivo":  oidTempoAtivo || null,
      "oidDigitalizacoes":  oidDigitalizacoes || null,
      "oidCopiasPB":  oidCopiasPB || null,
      "oidCopiasCor": oidCopiasCor || null,
      "oidTotalGeral":  oidTotalGeral || null
    }
  }
  const onSubmit = async (e) => {
    e.preventDefault();
      const data = createData()
      const response = await createPadraoImpressora(data)
      if(response.type === "success") {
        toast.success("Padrao de impressora criado com sucesso!")
      setTimeout(() => {
        navigate("/padroescadastrados");
      }, 1000);
    } else {
        toast.error("Erro ao criar o padrao de impressora!")
    }
  };
  const fildsObrigatorios = ()=>{
    if(marca === ""){return false}
    if(modelo === ""){return false}
    if(tipo === ""){return false}
    return true
  }

  return (
    <div id="printer-pattern-signup-card">
      <h2 id="printer-pattern-form-header">Cadastrar padrão de impressora</h2>
      <form >
          
        <div id="printer-pattern-fields">
          <div className="printer-pattern-input-line">
            <label>Tipo</label>
            <input
              placeholder={`Digite ${"Tipo".toLowerCase()}`}
              value={tipo}
                   onChange={(e)=>setTipo(e.target.value)}/>
          </div>

          <div className="printer-pattern-input-line">
            <label>Marca</label>
            <input
              placeholder={`Digite ${"Marca".toLowerCase()}`}
              value={marca}
                   onChange={(e)=>setMarca(e.target.value)}/>
          </div>

          <div className="printer-pattern-input-line">
            <label>Modelo</label>
            <input
              placeholder={`Digite ${"Modelo".toLowerCase()}`}
              value={modelo}
                   onChange={(e)=>setModelo(e.target.value)}/>
          </div>

          <div id="selection">
            <label>Equipamento Colorido? </label>
                  <select onChange={(e)=>{setIsColorido(e.target.value === "sim")}} id="inputColorido">
              <option>não</option>
              <option>sim</option>
            </select>
          </div>
        </div>

        <h2 htmlFor="snmp" className="snmp-header">
          SNMP:
        </h2>
        <div id="printer-pattern-snmp-fields">
          <div id="snmp-fields-input-line">
            <label>Modelo da impressora</label>
            <input
              placeholder="Código OID"
              value={oidModelo}
                    onChange={(e)=>setOidModelo(e.target.value)}/>
          </div>

          <div id="snmp-fields-input-line">
            <label>Número de série</label>
            <input
              placeholder="Código OID"
              value={oidNumeroSerie}
                    onChange={(e)=>setOidNumeroSerie(e.target.value)}/>
          </div>

          <div id="snmp-fields-input-line">
            <label>Versão do Firmware</label>
            <input
              placeholder="Código OID"
              value={oidFirmware}
                    onChange={(e)=>setOidFirmware(e.target.value)}/>
          </div>

          <div id="snmp-fields-input-line">
            <label>Tempo ativo do sistema</label>
            <input
              placeholder="Código OID"
              value={oidTempoAtivo}
                    onChange={(e)=>setOidTempoAtivo(e.target.value)}/>
          </div>

          <div id="snmp-fields-input-line">
            <label>Total de digitalizações</label>
            <input
              placeholder="Código OID"
              value={oidDigitalizacoes}
                    onChange={(e)=>setOidDigitalizacoes(e.target.value)}/>
          </div>

          <div id="snmp-fields-input-line">
            <label>Total de cópias P&B</label>
            <input
              placeholder="Código OID"
              value={oidCopiasPB}
                    onChange={(e)=>setOidCopiasPB(e.target.value)}/>
          </div>

          <div id="snmp-fields-input-line">
            <label>Total de cópias coloridas</label>
            <input
              placeholder="Código OID"
              value={oidCopiasCor}
                    onChange={(e)=>setOidCopiasCor(e.target.value)}/>
          </div>

          <div id="snmp-fields-input-line">
            <label>Total geral</label>
            <input
              placeholder="Código OID"
              value={oidTotalGeral}
                    onChange={(e)=>setOidTotalGeral(e.target.value)}/>
          </div>
        </div>

        <div id="printer-pattern-buttons">
          <button
            className="printer-pattern-form-button"
            type="button"
            id="cancel-bnt"
          >
            <Link to="/">CANCELAR</Link>
          </button>
          <button onClick={onSubmit} className="printer-pattern-form-button"  id="registrar-bnt" disabled={!fildsObrigatorios() || isSubmitting}>
            {isSubmitting && (
              <ReloadIcon id="animate-spin"/>
            )}
            {!isSubmitting ? 'REGISTRAR': "CADASTRANDO"}
          </button>
        </div>
      </form>
    </div>
  );
}
export { fieldLabels };
