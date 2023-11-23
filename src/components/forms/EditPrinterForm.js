import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "../../style/components/editPrinterForms.css";
import elipse6 from '../../assets/elipse6.svg';

const fieldLabels = {
  padrao: 'Padrão',
  ip: 'IP',
  numeroSerie: 'Número de Série',
  codigoLocadora: 'Código da Locadora',
  contadorInstalacao: 'Contador de Instalação',
  dataInstalacao: 'Data de Instalação',
  contadorRetirada: 'Contador de Retirada',
  dataRetirada: 'Data de Retirada',
  ultimoContador: 'Último Contador',
  dataUltimoContador: 'Data do Último Contador',
  unidadePai: 'Unidade Pai',
  unidadeFilho: 'Unidade Filho',
};

const testObject = {
  padrao: 'teste',
  ip: '1111111',
  numeroSerie: '222222222',
  codigoLocadora: '333333333',
  contadorInstalacao: '444444444',
  dataInstalacao: '01/01/2000',
  contadorRetirada: '555555555',
  dataRetirada: '02/02/2002',
  ultimoContador: '666666666',
  dataUltimoContador: '03/03/2003',
  unidadePai: 'pai',
  unidadeFilho: 'filho',
};

const editPrinterSchema = yup.object().shape({
  padrao: yup.string().required(`${fieldLabels.padrao} é obrigatório`),
  ip: yup.string().required(`${fieldLabels.ip} é obrigatório`),
  numeroSerie: yup.string().required(`${fieldLabels.numeroSerie} é obrigatório`),
  codigoLocadora: yup.string().required(`${fieldLabels.codigoLocadora} é obrigatório`),
  contadorInstalacao: yup.string().required(`${fieldLabels.contadorInstalacao} é obrigatório`),
  dataInstalacao: yup.string().required(`${fieldLabels.dataInstalacao} é obrigatória`),
  contadorRetirada: yup.string().required(`${fieldLabels.contadorRetirada} é obrigatório`),
  dataRetirada: yup.string().required(`${fieldLabels.dataRetirada} é obrigatória`),
  ultimoContador: yup.string().required(`${fieldLabels.ultimoContador} é obrigatório`),
  dataUltimoContador: yup.string().required(`${fieldLabels.dataUltimoContador} é obrigatória`),
  unidadePai: yup.string().required(`${fieldLabels.unidadePai} é obrigatória`),
  unidadeFilho: yup.string().required(`${fieldLabels.unidadeFilho} é obrigatória`),
});

export default function EditPrinterForm() {
  const { register, setValue, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(editPrinterSchema),
    mode: "onSubmit"
  });

  useEffect(() => {
    Object.entries(testObject).forEach(([key, value]) => {
      setValue(key, value);
    });
  }, [setValue]);

  const onSubmit = async (data) => {
    console.log(data);
    reset();
  }

  return (
    <div id="editPrinter-card">
      <div id="buttons">
        <button className="form-button" type="button" id="voltar-bnt">Voltar</button>
      </div>
      <header id="form-header">
        Editar impressora
      </header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div id="input-group">
          {Object.entries(fieldLabels).map(([key, field]) => (
            <div id="input-line" key={key}>
              <div id="input-box">
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}<span>*</span></label>
                <input
                    {...register(key)}
                    placeholder={field.includes('data') ? 'DD/MM/AAAA' : field.charAt(0).toUpperCase() + field.slice(1)}
                />
                <span>{errors[key]?.message}</span>
              </div>
            </div>
          ))}
        </div>
        <div id="buttons">
          <button className="form-button" type="button" id="cancelar-bnt">CANCELAR</button>
          <button className="form-button" type="submit" id="editar-bnt">EDITAR</button>
        </div>
      </form>
      <div className="elipse-signup">
        <img alt="elipse" src={elipse6} />
      </div>
    </div>
  );
}
