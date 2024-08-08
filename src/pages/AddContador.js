import React from 'react';

const AddContador = () => {
  return (
    <div>
      <h1>Adicionar Impressão</h1>
      <form>
        <label>
          Nome do Documento:
          <input type="text" name="documentName" />
        </label>
        <br />
        <label>
          Quantidade de Cópias:
          <input type="number" name="copies" />
        </label>
        <br />
        <button type="submit">Adicionar</button>
      </form>
    </div>
  );
};

export default AddContador