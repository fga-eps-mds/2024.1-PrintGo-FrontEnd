import React from 'react';
import '../style/pages/addcontador.css';
import Navbar from '../components/navbar/Navbar';






const AddContador = () => {
  return (

    <><Navbar />
    <div className="add-contador-container">
          <h1>Adicionar Impressão</h1>
          <form className="add-contador-form">
              <label>
                  Nome do Documento:
                  <input type="text" name="documentName" />
              </label>
              <label>
                  Quantidade de Cópias:
                  <input type="number" name="copies" />
              </label>
              <button type="submit">Adicionar</button>
          </form>
      </div>    </>
  );
};

export default AddContador;
