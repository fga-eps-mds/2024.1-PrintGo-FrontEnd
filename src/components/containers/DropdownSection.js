import React, { useState } from 'react';
import PropTypes from 'prop-types';
import "../../style/components/FilterContainer.css"

const DropdownSection = ({ title }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="dropdown-section">
            <div className="dropdown-header" onClick={toggleOpen}>
                {title}
                <img 
                    src={process.env.PUBLIC_URL + '/seta-direita 1.png'} 
                    className={`arrow ${isOpen ? 'up' : 'down'}`} 
                    alt="seta"
                />
            </div>
            {isOpen && (
                <div className="dropdown-content">
                <label><input type="checkbox" /> Valor 1</label>
                <label><input type="checkbox" /> Valor 2</label>
                <label><input type="checkbox" /> Valor 3</label>
                </div>
            )}
        </div>
    );
};

DropdownSection.propTypes = {
    title: PropTypes.string.isRequired,
};

export default DropdownSection;