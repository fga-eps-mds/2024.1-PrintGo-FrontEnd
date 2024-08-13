import React, { useState } from "react";
import PropTypes from "prop-types";
import "../../style/components/itemBox.css";
import { FaToggleOn, FaToggleOff, FaPencil } from "react-icons/fa6";
import Button from "../Button";
import { editImpressora } from "../../services/printerService";

const ItemBox = ({ label, onEditClick, onSerialClick, printer }) => {
  const [isToggled, setIsToggled] = useState(printer.ativo);

  const handleToggleClick = async () => {
    let data = {
      ...printer,
      ativo: !printer.ativo,
      dataRetirada: new Date(),
    };
    const response = await editImpressora(data);
    if (response.type === "success") setIsToggled(data.ativo);
  };

  return (
    <div className="item-box">
      <div className="overlap-group">
        {/* Deixa o número de série clicável */}
        <div className="text-wrapper">
          <span
            onClick={onSerialClick} 
            style={{ cursor: "pointer" }} 
          >
            {label}
          </span>
        </div>
        <div className="edit">
          <Button
            className="edit"
            type="icon"
            size="small"
            text={<FaPencil fontSize={"35px"} color="#003366" />}
            onClick={onEditClick}
          />
        </div>
        <div className="toggle">
          <Button
            type="icon"
            size="small"
            text={
              isToggled ? (
                <FaToggleOn fontSize={"40px"} color="#003366" />
              ) : (
                <FaToggleOff fontSize={"40px"} color="#003366" />
              )
            }
            onClick={handleToggleClick}
          />
        </div>
      </div>
    </div>
  );
};

ItemBox.propTypes = {
  label: PropTypes.string,
  onEditClick: PropTypes.func,
  onSerialClick: PropTypes.func, 
  printer: PropTypes.object,
};

ItemBox.defaultProps = {
  label: "Default Label",
  onEditClick: () => console.log("Edit button clicked"),
  onSerialClick: () => console.log("Serial number clicked"), 
  printer: {},
};

export default ItemBox;
