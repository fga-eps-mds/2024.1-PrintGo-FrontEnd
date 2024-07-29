import React from "react";
import ItemBox from "../containers/ItemBox";
import "../../style/components/listEquipment.css"

// Mock equipment list
const mockEquipmentList = [
    { id: 1, label: "Printer A" },
    { id: 2, label: "Printer B" },
    { id: 3, label: "Printer C" },
    { id: 4, label: "Printer D" },
];

const ListEquipment = () => {
    const handleEditClick = (id) => {
        console.log(`Edit button clicked for equipment ID: ${id}`);
    };

    const handleToggleClick = (id) => {
        console.log(`Toggle button clicked for equipment ID: ${id}`);
    };

    return (
        <div className="equipment-list">
            {mockEquipmentList.map((equipment) => (
                <ItemBox
                    key={equipment.id}
                    label={equipment.label}
                    onEditClick={() => handleEditClick(equipment.id)}
                    onToggleClick={() => handleToggleClick(equipment.id)}
                />
            ))}
        </div>
    );
};

export default ListEquipment;
