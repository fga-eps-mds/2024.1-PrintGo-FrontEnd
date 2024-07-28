import React, { useState } from 'react';
import PropTypes from 'prop-types';

function StatusDropdown({ onChange }) {
  // Estado para armazenar o valor selecionado
  const [selectedOption, setSelectedOption] = useState('');

  // Função para lidar com a mudança de seleção
  const handleChange = (event) => {
    setSelectedOption(event.target.value);

    if (onChange) {
      onChange(event);  // Passa o evento completo
    }
  };

  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <label
        htmlFor="status-dropdown"
        style={{
          fontSize: '25px',
          marginBottom: '5px',
          fontFamily: 'Jost'
        }}
      >
        Status
      </label>
      <select 
        id="status-dropdown" 
        value={selectedOption} 
        onChange={handleChange}
        style={{
          fontFamily: 'Jost',
          height: '40px',
          width: '12vw',
          border: '2px solid #0D3D6D',
          borderRadius: '10px',
          fontSize: '20px',
          paddingLeft: '10px',
          cursor: 'pointer',
          color: '#0D3D6D',
          outline: 'none',
          backgroundSize: '10px'
        }}
      >
        <option value="">
          --Selecione--
        </option>
        <option value="ativo">Ativo</option>
        <option value="inativo">Inativo</option>
      </select>
    </div>
  );
}

StatusDropdown.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default StatusDropdown;
