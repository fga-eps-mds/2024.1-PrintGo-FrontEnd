import React, { useState } from "react";
import PropTypes from "prop-types";
import "../../style/components/itemBox.css";
import { FaToggleOn, FaToggleOff, FaPencil } from "react-icons/fa6";
import Button from "../Button";

const ItemBox = ({ label, onEditClick, onToggleClick, onSerialClick, printer }) => {
  const [isToggled, setIsToggled] = useState(printer.ativo);

  const handleToggleClick = async () => {
    setIsToggled((prevState) => !prevState);
    if (onToggleClick) {
      onToggleClick();
    }
  };

  const overlapGroupStyle = {
    backgroundColor: isToggled ? "#ffffff" : "#d9d9d9",
  };

  return (
    <div className="item-box">
      <div className="overlap-group" style={overlapGroupStyle}>
        {/* Deixa o número de série clicável */}
        <div className="text-wrapper">
          <span onClick={onSerialClick} style={{ cursor: "pointer" }}>
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
  onToggleClick: PropTypes.func,
  onSerialClick: PropTypes.func,
  printer: PropTypes.object,
};

ItemBox.defaultProps = {
  label: "Default Label",
  onEditClick: () => console.log("Edit button clicked"),
  onToggleClick: () => console.log("Toggle button clicked"),
  onSerialClick: () => console.log("Serial number clicked"),
  printer: {},
};

export default ItemBox;
