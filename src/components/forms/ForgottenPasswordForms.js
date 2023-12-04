import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as yup from "yup";
import elipse6 from '../../assets/elipse6.svg';
import { getUnidades } from "../../services/unidadeService";
import { createUser } from "../../services/userService";
import "../../style/components/forgottenPasswordForms.css";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useNavigate } from 'react-router-dom';



const forgottenPasswordSchema = yup.object().shape({
    email: yup
      .string()
      .email('Email inválido')
      .required('Email é obrigatório')
  });

export default function ForgottenPasswordForm(){
    const navigate = useNavigate();
    
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }, 
        reset
    } = useForm({resolver: yupResolver(forgottenPasswordSchema), mode: "onChange"})

    const onSubmit = async (data) =>  {

    //     data.cargos = ["USER"];
    //     if (data.isAdmin) {
    //         data.cargos.push("ADMIN");
    //     }
    //     const response = await createUser(data);
    //     if(response.type === 'success'){
    //         toast.success("Usuario cadastrado com sucesso!")
    //         reset()
    //         navigate('/')
    //     } else {
    //         toast.error("Erro ao cadastrar usuario")
    //     }
    }

    return(
        <div id="signup-card">
            <div id="center-container">
                <header id="form-header">
                    Esqueci minha senha
                </header>
                <p id="header-description">
                    Para redefinir sua senha, informe o email cadastrado na sua conta e lhe enviaremos um link de recuperação.<span></span>
                </p>
            </div>
            <form id="signup-form"onSubmit={handleSubmit(onSubmit)}>
                <div id="signup-input-group">
                    <div id="signup-input-box">
                        <label>Email Cadastrado</label>
                        <input id="email" {...register("email", {required: true} )} type="email" placeholder="Email" />
                        <span>{errors.email?.message}</span>
                    </div>
                </div>

                <div id="signup-buttons">
                    <button className="form-button" type="submit" id="register-bnt" disabled={isSubmitting}>
                        {isSubmitting && (
                            <ReloadIcon id="animate-spin"/>
                        )}

                        {isSubmitting ? 'Enviando': "Confirmar"}
                    </button>
                </div>
            </form>
            <div className="elipse-signup">
                <img alt= "elipse"  src={elipse6}></img>
            </div>
            <ToastContainer />
        </div>
    );
}