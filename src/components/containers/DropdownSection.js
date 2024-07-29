import React, { useState } from 'react';
import PropTypes from 'prop-types';

const DropdownSection = ({ title }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="dropdown-section">
            <div className="dropdown-header" onClick={toggleOpen}>
                {title}
                <span className={`arrow ${isOpen ? 'up' : 'down'}`}></span>
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