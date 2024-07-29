import React from 'react';
import DropdownSection from './DropdownSection';
import "../../style/components/FilterContainer";

const FilterContainer = () => {
    return (
        <div className="app">
            <header className="app-header">
                <h1>Equipamentos disponíveis</h1>
            </header>
            <main>
                <DropdownSection title="Equipamento" />
                <DropdownSection title="Modelo" />
                <DropdownSection title="Número de série" />
                <DropdownSection title="Localização" />
            </main>
        </div>
    );
};

export default FilterContainer;
