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

  const altLocation = {
      id:"",
      marca: "",
      modelo: "",
      tipo: "",
      colorido: false,
      oidModelo:  "",
      oidNumeroSerie: "",
      oidFirmware:  "",
      oidTempoAtivo:  "",
      oidDigitalizacoes:  "",
      oidCopiasPB:  "",
      oidCopiasCor: "",
      oidTotalGeral:  ""
    }
  
  
  const previousPattern = location.state || altLocation;
 
  const id = previousPattern.id
  const [marca, setMarca] = useState(previousPattern.marca)
  const [type, setType] = useState(previousPattern.tipo)
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

  
  
  const registerPrinterSchema = getRegisterPatternSchema(fieldLabels);
  const {
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(registerPrinterSchema),
  });

  const updateData = () => {
    return {
      "tipo": type,
      "marca": marca,
      "modelo": modelo,
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
    const data = updateData()
    console.log(data);

    const response = await editPadrao(data, id);

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
    if(type === ""){return false}
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
                   value={type}
                   onChange={(e)=>setType(e.target.value)}/>
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

              <div id="selection">
                <label>Equipamento Colorido? </label>
                  <select onChange={(e)=>(setIsColorido(e.target.value === "sim"))} 
                  id="inputColorido" 
                  value={isColorido? "sim": "não"}>
                    <option>sim</option>
                    <option>não</option>
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
          
          <button onClick={onSubmit} className="printer-pattern-form-button"  id="registrar-bnt" disabled={!fieldsObrigatorios()}>

            EDITAR
          </button>
        </div>

      </form>
      <div className="elipse-pattern">
        <img alt="elipse" src={elipse6} />
      </div>
    </div>
  );
}
