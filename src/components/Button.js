import React from 'react';
import PropTypes from 'prop-types';
import '../style/components/button.css';

const Button = ({ type, size, text, onClick }) => {
    const typeClasses = {
        success: 'button-success',
        error: 'button-error',
        info: 'button-info',
        warning: 'button-warning',
        icon: 'button-icon'
    };

    const sizeClasses = {
        small: 'button-small',
        medium: 'button-medium',
        large: 'button-large',
    };

    const buttonClass = `button ${typeClasses[type] || 'button-info'} ${sizeClasses[size] || 'button-medium'}`;

    return (
        <button className={buttonClass} onClick={onClick}>
            {text}
        </button>
    );
};

Button.propTypes = {
    type: PropTypes.oneOf(['success', 'error', 'info', 'warning', 'icon']),
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

Button.defaultProps = {
    type: 'info',
    size: 'medium',
};

export default Button;
