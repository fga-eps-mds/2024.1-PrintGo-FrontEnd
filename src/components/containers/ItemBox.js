import React, { useState } from "react";
import PropTypes from "prop-types";
import "../../style/components/itemBox.css";
import { FaToggleOn, FaToggleOff, FaPencil } from "react-icons/fa6";
import Button from "../Button";

const ItemBox = ({ label, onEditClick, onToggleClick }) => {
  const [isToggled, setIsToggled] = useState(true);

  const handleToggleClick = () => {
    setIsToggled((prevState) => !prevState);
    if (onToggleClick) {
      onToggleClick();
    }
  };

  return (
    <div className="item-box">
      <div className="overlap-group">
        <div className="text-wrapper">{label}</div>
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
};

ItemBox.defaultProps = {
  label: "Default Label",
  onEditClick: () => console.log("Edit button clicked"),
  onToggleClick: () => console.log("Toggle button clicked"),
};

export default ItemBox;
