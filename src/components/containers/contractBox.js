import React, { useState } from "react";
import PropTypes from "prop-types";
import "../../style/components/contractBox.css";
import { FaToggleOn, FaToggleOff, FaPencil, FaMagnifyingGlass } from "react-icons/fa6";
import Button from "../Button";

const ContractBox = ({ label, gestor, onReadClick, onEditClick, onToggleClick }) => {
    const [isToggled, setIsToggled] = useState(true);

    const handleToggleClick = () => {
        setIsToggled(prevState => !prevState);
        if (onToggleClick) {
            onToggleClick();
        }
    };

    return (
        <div className="box">
            <div className="overlap-group">
                <div className="text-wrapper">
                    <div className="numero">{label}</div>
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
    label: PropTypes.string,
    gestor: PropTypes.string,
    onReadClick: PropTypes.func,
    onEditClick: PropTypes.func,
    onToggleClick: PropTypes.func,
};

ContractBox.defaultProps = {
    label: "Default Label",
    gestor: "Default Gestor",
    onReadClick: () => console.log('Read button clicked'),
    onEditClick: () => console.log('Edit button clicked'),
    onToggleClick: () => console.log('Toggle button clicked'),
};

export default ContractBox;
