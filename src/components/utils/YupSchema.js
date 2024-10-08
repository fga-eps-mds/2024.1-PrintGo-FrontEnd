import * as yup from 'yup';

export const getPrinterSchema = (printerFieldLabels) => {
  return yup.object().shape({
    padrao_id: yup.string().required(`${printerFieldLabels.padrao_id} é obrigatório`),
    ip: yup.string().required(`${printerFieldLabels.ip} é obrigatório`),
    numeroSerie: yup.string().required(`${printerFieldLabels.numeroSerie} é obrigatório`),
    codigoLocadora: yup.string().required(`${printerFieldLabels.codigoLocadora} é obrigatório`),
    contadorInstalacao: yup.number().required(`${printerFieldLabels.contadorInstalacao} é obrigatório`),
    dataInstalacao: yup.string().required(`${printerFieldLabels.dataInstalacao} é obrigatória`),
    contadorRetiradas: yup.number().required(`${printerFieldLabels.contadorRetiradas} é obrigatório`),
    dataContadorRetirada: yup.string().required(`${printerFieldLabels.dataContadorRetirada} é obrigatória`),
    ultimoContador: yup.number().required(`${printerFieldLabels.ultimoContador} é obrigatório`),
    dataUltimoContador: yup.string().required(`${printerFieldLabels.dataUltimoContador} é obrigatória`),
    unidadeId: yup.string().required(`${printerFieldLabels.unidadeId} é obrigatória`),
  });
};


export const getRegisterPatternSchema = (fieldLabels) => {

  return yup.object().shape({
    tipo: yup.string().required(`${fieldLabels.tipo} é obrigatório`),
    marca: yup.string().required(`${fieldLabels.marca} é obrigatório`),
    modelo: yup.string().required(`${fieldLabels.modelo} é obrigatório`),
  });
}

export const getPasswordSchema = () => {
  return yup.object().shape({
    novaSenha: yup.string()
      .required('Senha é obrigatória')
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial'
      ),
    confirmacaoNovaSenha: yup.string()
      .oneOf([yup.ref('novaSenha'), null], 'As senhas devem corresponder')
      .required('Confirmação de senha é obrigatória')
  });
};

export const getEditUserSchema = (userFiledLabels) => {

  
  return yup.object().shape({
    nome: yup.string().required(`${userFiledLabels.nome} é obrigatório`),
    documento: yup.string().required(`${userFiledLabels.documento} é obrigatório`),
    email: yup.string().required(`${userFiledLabels.email} é obrigatório`),
    emailConfirmar: yup.string().required(`${userFiledLabels.emailConfirmar} é obrigatório`),
    unidade_id: yup.string().required(`${userFiledLabels.unidade_id} é obrigatório`),
    isAdmin: yup.boolean(),
    isLocadora: yup.boolean(),
  });
};
