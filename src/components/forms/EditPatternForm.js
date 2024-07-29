import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import "../../style/components/printerPatternForm.css";
import elipse6 from "../../assets/elipse6.svg";
import { getRegisterPatternSchema } from "../utils/YupSchema";
import { editPadrao} from "../../services/patternService";
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
    totalImpressoesPb: "Total de impressões P&B",
    totalImpressoesColoridas: "Total de impressões coloridas",
    totalGeral: "Total geral",
    enderecoIp: "Endereço IP",
  },
}

export default function EditPatternForm() {
  
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location.state.tipo);
  
  const previousPattern = location.state;
  
  const [tipo, setTipo] = useState(previousPattern.tipo)
  const [marca, setMarca] = useState(previousPattern.marca)
  const [modelo, setModelo] = useState(previousPattern.modelo)
  const [isColorido, setIsColorido] = useState(previousPattern.colorido)
  const [oidModelo, setOidModelo] = useState(previousPattern.oidModelo)
  const [oidNumeroSerie, setOidNumeroSerie] = useState(previousPattern.oidNumeroSerie)
  const [oidFirmware, setOidFirmware] = useState(previousPattern.oidFirmware)
  const [oidTempoAtivo, setOidTempoAtivo] = useState(previousPattern.oidTempoAtivo)
  const [oidDigitalizacoes, setOidDigitalizacoes] = useState(previousPattern.oidDigitalizacoes)
  const [oidCopiasPB, setOidCopiasPB] = useState(previousPattern.oidCopiasPB)
  const [oidCopiasCor, setOidCopiasCor] = useState(previousPattern.oidCopiasCor)
  const [oidTotalGeral, setOidTotalGeral] = useState(previousPattern.oidTotalGeral)
  console.log(tipo);

  
  const registerPrinterSchema = getRegisterPatternSchema(fieldLabels);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(registerPrinterSchema),
    mode: "onSubmit",
  });

  const updateData = () => {
    return {
      "tipo": tipo,
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

  const onSubmit = async () => {
    const data = updateData()
    console.log(data);
    const response = await editPadrao(data);
    if (response.type === "success") {
      toast.success("Padrão editado com sucesso!");
      setTimeout(() => {
        navigate("/padroescadastrados");
      }, 1000);
    } else {
       toast.error("Erro ao editar o padrão!");
    }
    
    
  };

  const fieldsObrigatorios = ()=>{
    if(marca === ""){return false}
    if(modelo === ""){return false}
    if(tipo === ""){return false}
    return true
  }

  
  
  return (
    <div id="printer-pattern-signup-card" data-testid="printer-pattern-signup-card">
      <h2 id="printer-pattern-form-header">Edição de padrão de impressora</h2>
      <form >
          
        <div id="printer-pattern-fields">
              <div id="printer-pattern-input-line">
                  <label>Tipo<span>*</span></label>
                  <input
                   placeholder={`Digite ${"Tipo".toLowerCase()}`} 
                   value={tipo}
                   onChange={(e)=>setTipo(e.target.value)}/>
              </div>
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
                  <select onChange={setIsColorido} id="inputColorido" value={isColorido}>
                    <option value = "false">não</option>
                    <option value = "true" >sim</option>
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
          <button onClick={onSubmit} className="printer-pattern-form-button"  id="registrar-bnt" disabled={!fieldsObrigatorios() || isSubmitting}>

            {!isSubmitting ? 'EDITAR': "ALTERANDO"}
          </button>
        </div>

      </form>
      <div className="elipse-pattern">
        <img alt="elipse" src={elipse6} />
      </div>
    </div>
  );
}
