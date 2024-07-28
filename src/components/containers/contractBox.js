import React, { useState } from "react";
import PropTypes from "prop-types";
import "../../style/components/contractBox.css";
import { FaToggleOn, FaToggleOff, FaPencil, FaMagnifyingGlass } from "react-icons/fa6";
import Button from "../Button";

const ContractBox = ({ numero, gestor, ativo, onReadClick, onEditClick, onToggleClick }) => {
    const [isToggled, setIsToggled] = useState(ativo);

    const handleToggleClick = () => {
        setIsToggled(prevState => !prevState);
        if (onToggleClick) {
            onToggleClick();
        }
    };

    const overlapGroupStyle = {
      backgroundColor: isToggled ? "#ffffff" : "#d9d9d9"
    };

    return (
        <div className="box">
            <div className="overlap-group" style={overlapGroupStyle}>
                <div className="text-wrapper">
                    <div className="numero">{numero}</div>
                    <div className="gestor">{gestor}</div>                    
                </div>
                <div className="actions">
                <div className="read">
                        <Button
                            className="read"
                            type="icon"
                            size="small"
                            text={<FaMagnifyingGlass fontSize={'30px'} color="#0D3D6D"/>}
                            onClick={onReadClick}
                        />
                    </div>
                    <div className="edit">
                        <Button
                            className="edit"
                            type="icon"
                            size="small"
                            text={<FaPencil fontSize={'30px'} color="#0D3D6D"/>}
                            onClick={onEditClick}
                        />
                    </div>
                    <div className="toggle">
                        <Button
                            type="icon"
                            size="small"
                            text={isToggled ? <FaToggleOn fontSize={'40px'} color="#0D3D6D"/> : <FaToggleOff fontSize={'40px'} color="#0D3D6D"/>}
                            onClick={handleToggleClick}
                        />
                </div>
                </div>
            </div>
        </div>
    );
};

ContractBox.propTypes = {
    numero: PropTypes.string,
    gestor: PropTypes.string,
    ativo: PropTypes.bool,
    onReadClick: PropTypes.func,
    onEditClick: PropTypes.func,
    onToggleClick: PropTypes.func,
};

ContractBox.defaultProps = {
    numero: "Default Numero",
    gestor: "Default Gestor",
    onReadClick: () => console.log('Read button clicked'),
    onEditClick: () => console.log('Edit button clicked'),
    onToggleClick: () => console.log('Toggle button clicked'),
};

export default ContractBox;
