import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import AddContador from "../../pages/AddContador";
import { getPadroes } from "../../services/patternService";
import {
  getPrinters,
  addContadores,
  getLocalizacao,
} from "../../services/printerService";
import { MemoryRouter } from "react-router-dom";
import { toast } from "react-toastify";

jest.mock("../../services/printerService");
jest.mock("../../services/patternService");
jest.mock("react-toastify");

describe("AddContador", () => {
  beforeEach(() => {
    getLocalizacao.mockResolvedValue({
      data: [
        {
          id: "1",
          name: "City 1",
          workstations: [
            {
              id: "1",
              name: "WS 1",
              child_workstations: [{ id: "1", name: "SW 1" }],
            },
          ],
        },
      ],
    });

    getPadroes.mockResolvedValue({
      data: [{ marca: "Marca 1", modelo: "Modelo 1", colorido: true }],
    });

    getPrinters.mockResolvedValue({
      type: "success",
      data: [
        {
          id: "1",
          numSerie: "XYZ123",
          modeloId: "Modelo 1",
          localizacao: "City 1;WS 1;SW 1",
        },
      ],
    });

    addContadores.mockResolvedValue({ type: "success" });
    toast.error = jest.fn();
    toast.success = jest.fn();
  });

  test("renders the page correctly", () => {
    render(
      <MemoryRouter>
        <AddContador />
      </MemoryRouter>
    );

    expect(screen.getByText("Registro de Contadores")).toBeInTheDocument();
    expect(screen.getByTestId("cidade")).toBeInTheDocument();
    expect(screen.getByTestId("regional")).toBeInTheDocument();
    expect(screen.getByTestId("unidade")).toBeInTheDocument();
    expect(screen.getByTestId("equipamento")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Contador Preto e Branco")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Contador Colorido")).toBeInTheDocument();
    expect(screen.getByLabelText("Data do Contador")).toBeInTheDocument();
    expect(screen.getByText("Registrar")).toBeInTheDocument();
    expect(screen.getByText("Cancelar")).toBeInTheDocument();
  });

  test("updates equipment list based on selected city", async () => {
    render(
      <MemoryRouter>
        <AddContador />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId("cidade"), {
      target: { value: "City 1" },
    });

    await waitFor(() => {
      expect(screen.getByText("XYZ123")).toBeInTheDocument();
    });
  });
  test("validates form fields before submitting", async () => {
    render(
      <MemoryRouter>
        <AddContador />
      </MemoryRouter>
    );
  
    fireEvent.click(screen.getByText("Registrar"));
  
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Por favor, selecione um equipamento."
      );
    });
  
    await waitFor(() => {
      expect(screen.getByText("XYZ123")).toBeInTheDocument();
    });
  
    fireEvent.change(screen.getByTestId("equipamento"), {
      target: { value: "XYZ123" }, 
    });
  
    fireEvent.click(screen.getByText("Registrar"));
  
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Por favor, insira uma quantidade válida de impressões em Preto e Branco."
      );
    });
  
    fireEvent.change(screen.getByLabelText("Contador Preto e Branco"), {
      target: { value: "100" },
    });
  
    fireEvent.click(screen.getByText("Registrar"));
  
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Por favor, insira uma data válida."
      );
    });
  
    fireEvent.change(screen.getByLabelText("Data do Contador"), {
      target: { value: "2024-08-15" },
    });
  
    fireEvent.click(screen.getByText("Registrar"));
  
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Contador registrado com sucesso!");
    });
  });
  
  
  
  
});
