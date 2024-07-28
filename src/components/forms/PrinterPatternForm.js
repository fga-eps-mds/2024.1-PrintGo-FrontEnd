import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom';
import "../../style/components/printerPatternForm.css";
import elipse6 from "../../assets/elipse6.svg";
import { getRegisterPatternSchema } from "../utils/YupSchema";
import { ReloadIcon } from "@radix-ui/react-icons";
import { createPadraoImpressora } from "../../services/patternService";
import { toast } from "react-toastify";

const fieldLabels = {
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
 
  const registerPrinterSchema = getRegisterPatternSchema(fieldLabels);
  const {
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(registerPrinterSchema),
    mode: "onChange",
  });


  const onSubmit = async () => {
    const data = createData()
    console.log(data)
    const response = await createPadraoImpressora(data)
    if(response.type === "success") {
      toast.success("Padrao de impressora criado com sucesso!")
      reset();
    } else {
      toast.error("Erro ao criar o padrao de impressora!")
    }
  };

  const createData = ()=>{
    return{
      "marca": marca,
      "modelo": modelo,
      "colorido": isColorido,
      "oidModelo":  oidModelo,
      "oidNumeroSerie": oidNumeroSerie,
      "oidFirmware":  oidFirmware,
      "oidTempoAtivo":  oidTempoAtivo,
      "oidDigitalizacoes":  oidDigitalizacoes,
      "oidCopiasPB":  oidCopiasPB,
      "oidCopiasCor": oidCopiasCor,
      "oidTotalGeral":  oidTotalGeral
    }
  }

  const fildsObrigatorios = ()=>{
    if(marca === ""){return false}
    if(modelo === ""){return false}
    return true
  }

  return (
    <div id="printer-pattern-signup-card">
      <h2 id="printer-pattern-form-header">Cadastrar padrão de impressora</h2>
      <form onSubmit={onSubmit}>
          
        <div id="printer-pattern-fields">
              <div id="printer-pattern-input-line">
                  <label>Marca<span>*</span></label>
                  <input
                   placeholder={`Digite ${"Marca".toLowerCase()}`} 
                   value={marca}
                   onChange={(e)=>setMarca(e.target.value)}/>
              </div>

              <div id="printer-pattern-input-line">
                  <label>Modelo<span>*</span></label>
                  <input
                   placeholder={`Digite ${"Modelo".toLowerCase()}`} 
                   value={modelo}
                   onChange={(e)=>setModelo(e.target.value)}/>
              </div>

              <div id="inputCheckBox">
                <label>Equipamento Colorido? </label>
                  <select onChange={(e)=>{setIsColorido(e.target.value === "sim")}} id="inputColorido">
                    <option>não</option>
                    <option>sim</option>
                  </select> 
              </div>
        </div>

        <div id="printer-pattern-snmp-fields">
              <label htmlFor="snmp">SNMP:</label>

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
          <button className="printer-pattern-form-button" type="button" id="cancelar-bnt">
            <Link to="/">
              CANCELAR
            </Link>
          </button>
          <button className="printer-pattern-form-button" type="submit" id="registrar-bnt" disabled={!fildsObrigatorios() || isSubmitting}>
            {isSubmitting && (
              <ReloadIcon id="animate-spin"/>
            )}
            {!isSubmitting ? 'REGISTRAR': "CADASTRANDO"}
          </button>
        </div>

      </form>
      <div className="elipse-pattern">
        <img alt="elipse" src={elipse6} />
      </div>
    </div>
  );
}
export { fieldLabels };

