import { api } from '../lib/api/config';

//printer:
export async function getPrinters() {
    try {

        const response = await api.get('/printer');
        if (response.status !== 200) {
            return { type: 'error', data: response.data };
        }
        return { type: 'success', data: response.data.data };
    } catch (error) {
        return { type: 'error', error };
    }
}

export async function getPrinterById(id) {
    try {
        const response = await api.get(`/printer/${id}`);
        if (response.status !== 200) {
            return { type: 'error', data: response.data };
        }
        return { type: 'success', data: response.data };
    } catch (error) {
        return { type: 'error', error };
    }
}

export async function getLocalizacao() {
    try {

        const response = await api.get('/printer/location');
        if (response.status !== 201) {
            return { type: 'error', data: response.data };
        }
        return response.data;
    } catch (error) {
        return { type: 'error', error };
    }
}

export async function togglePrinter(id, status) {
    const data = {
        id,
        status
    }

    try {
        const response = await api.patch(`/printer/impressora/desativar/${id}`, data);
        if (response.status !== 200) {
            return { type: 'error', data: response.data };
        }
        return { type: 'success', data: response.data };
    } catch (error) {
        return { type: 'error', error };
    }
}
export const createImpressora = async (printer) => {
    try {
        const response = await api.post('/printer/', printer);
        if (response.status !== 201) {
            return { type: 'error', data: response.data };
        }
        return { type: 'success', data: response.data };
    } catch (error) {
        return { type: 'error', error };
    }
};

export const editImpressora = async (printer) => {
    try {
        const { id, ...rest } = printer;
        const response = await api.patch(`/printer/${id}`, rest);
        if (response.status !== 200) {
            return { type: 'error', data: response.data };
        }
        return { type: 'success', data: response.data };
    } catch (error) {
        return { type: 'error', error };
    }
};

export async function getPrintersByContract(contractNumber) {
    try {
        const encodedContractNumber = encodeURIComponent(contractNumber);
        const response = await api.get(`/printer/report/contract/${encodedContractNumber}`);
        if (response.status !== 200) {
            return { type: 'error', data: response.data };
        }
        return { type: 'success', data: response.data };
    } catch (error) {
        return { type: 'error', error };
    }
}

export async function generatePrinterPDF(printerId) {
    try {
        const response = await api.get(`/printer/report/${printerId}`, { responseType: 'blob' });
        if (response.status !== 200) {
            return { type: 'error', data: response.data };
        }

        const pdfBlob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(pdfBlob);
        const tempLink = document.createElement("a");
        tempLink.href = url;
        tempLink.setAttribute(
            "download",
            `printer-report-${printerId}-${new Date().toISOString()}.pdf`
        );

        document.body.appendChild(tempLink);
        tempLink.click();

        document.body.removeChild(tempLink);
        window.URL.revokeObjectURL(url);

        return { type: 'success' };
    } catch (error) {
        return { type: 'error', error };
    }
}
