import React, { useState } from 'react';

function StatusButton() {
  // Estado para armazenar se o status está "Ativo" ou "Inativo"
  const [isActive, setIsActive] = useState(false);

  // Função para alternar o estado
  const toggleStatus = () => {
    setIsActive(!isActive);
  };

  return (
    <div>
      {/* Botão que chama a função toggleStatus ao ser clicado */}
      <button 
        onClick={(e) => {
          e.preventDefault();
          toggleStatus();
        }}
        style={{
          height: '39px',
          width: '10vw',
          backgroundColor: isActive ? 'green' : 'red',
          color: 'white',
          border: 'none',
          borderRadius: '20px',
          cursor: 'pointer',
          fontFamily: 'Jost',
          fontSize: '20px',
          fontWeight: '700'
        }}
      >
        {isActive ? 'Ativo' : 'Inativo'}
      </button>
    </div>
  );
}

export default StatusButton;
