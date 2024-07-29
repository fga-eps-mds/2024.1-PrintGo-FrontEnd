import React, { useEffect, useState } from "react";
import ItemBox from "../containers/ItemBox";
import { getPrinters } from "../../services/printerService";
import "../../style/components/listEquipment.css";

const ListEquipment = () => {
    const [printers, setPrinters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getPrinters();
            if (response.type === 'success') {
                setPrinters(response.data);
            } else {
                setError(response.error || response.data);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    const handleEditClick = (id) => {
        console.log(`Edit button clicked for equipment ID: ${id}`);
    };

    const handleToggleClick = (id) => {
        console.log(`Toggle button clicked for equipment ID: ${id}`);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading data: {error.message || 'Unknown error'}</p>;

    return (
        <div className="equipment-list">
            {printers.map((printer) => (
                <ItemBox
                    key={printer.id}
                    label={`Printer ${printer.id}`}
                    onEditClick={() => handleEditClick(printer.id)}
                    onToggleClick={() => handleToggleClick(printer.id)}
                />
            ))}
        </div>
    );
};

export default ListEquipment;
