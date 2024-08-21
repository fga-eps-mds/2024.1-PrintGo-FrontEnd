import React, { useState } from "react";
import PropTypes from "prop-types";
import "../../style/components/counterRoutineForm.css";

function IntervalDropdown({ onChange , value, error, className }) {
  const [selectedOption, setSelectedOption] = useState("");

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <select
      id="intervalRoutine"
      value={value}
      onChange={handleChange}
      className={error ? `${className} input-error` : className}
    >
      <option value={""}>Escolha</option>
      <option value={"00:00"}>Tempo Real</option>
      <option value={"00:10"}>00:10</option>
      <option value={"00:15"}>00:15</option>
      <option value={"00:30"}>00:30</option>
      <option value={"01:00"}>01:00</option>
      <option value={"01:30"}>01:30</option>
      <option value={"02:00"}>02:00</option>
      <option value={"03:00"}>03:00</option>
      <option value={"04:00"}>04:00</option>
      <option value={"05:00"}>05:00</option>
      <option value={"06:00"}>06:00</option>
      <option value={"07:00"}>07:00</option>
      <option value={"08:00"}>08:00</option>
      <option value={"09:00"}>09:00</option>
      <option value={"10:00"}>10:00</option>
      <option value={"11:00"}>11:00</option>
      <option value={"12:00"}>12:00</option>
    </select>
  );
}

IntervalDropdown.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  error: PropTypes.string
};

IntervalDropdown.defaultProps = {
  className: '',
  onChange: null,
  value: '',
  error: ''  
};

export default IntervalDropdown;
