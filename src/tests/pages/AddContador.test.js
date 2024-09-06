import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import AddContador from "../../pages/AddContador";
import { getPadrao } from "../../services/patternService";
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

    getPadrao.mockResolvedValue({
      data: { marca: "Marca 1", modelo: "Modelo 1", colorido: true },
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
    expect(screen.getByTestId("cidade-contador")).toBeInTheDocument();
    expect(screen.getByTestId("regional-contador")).toBeInTheDocument();
    expect(screen.getByTestId("unidade-contador")).toBeInTheDocument();
    expect(screen.getByTestId("equipamento")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Contador Preto e Branco")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Contador Colorido")).toBeInTheDocument();
    expect(
      screen.getByTestId("date-container-Data do Contador")
    ).toBeInTheDocument();
    expect(screen.getByText("Registrar")).toBeInTheDocument();
    expect(screen.getByText("Cancelar")).toBeInTheDocument();
  });

  test("updates equipment list based on selected city", async () => {
    render(
      <MemoryRouter>
        <AddContador />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId("cidade-contador"), {
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

    fireEvent.change(screen.getByTestId("date-container-Data do Contador"), {
      target: { value: "2024-08-15" },
    });

    fireEvent.click(screen.getByText("Registrar"));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Contador registrado com sucesso!"
      );
    });
  });

  test("updates localizacao, workstation, and subworkstation correctly", async () => {
    render(
      <MemoryRouter>
        <AddContador />
      </MemoryRouter>
    );
  
    await waitFor(() => {
      fireEvent.change(screen.getByTestId("cidade-contador"), { target: { value: "City 1" } });
      expect(screen.getByText("XYZ123")).toBeInTheDocument();
    });
  
    await waitFor(() => {
      expect(screen.getByTestId("cidade-contador")).toHaveValue("City 1");
    });
  
    await waitFor(() => {
      fireEvent.change(screen.getByTestId("regional-contador"), { target: { value: "WS 1" } });
      expect(screen.getByText("XYZ123")).toBeInTheDocument();
    });
  
    await waitFor(() => {
      expect(screen.getByTestId("regional-contador")).toHaveValue("WS 1");
    });
  
    await waitFor(() => {
      fireEvent.change(screen.getByTestId("unidade-contador"), { target: { value: "SW 1" } });
      expect(screen.getByText("XYZ123")).toBeInTheDocument();
    });
  
    await waitFor(() => {
      expect(screen.getByTestId("unidade-contador")).toHaveValue("SW 1"); // Verifique o valor esperado
    });
  });

  test("sucess when form submitted correctly", async () => {
    render(
      <MemoryRouter>
        <AddContador />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("XYZ123")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId("equipamento"), {
      target: { value: "XYZ123" },
    });

    fireEvent.change(screen.getByLabelText("Contador Preto e Branco"), {
      target: { value: "100" },
    });

    fireEvent.change(screen.getByLabelText("Contador Colorido"), {
      target: { value: "50" },
    });

    fireEvent.change(screen.getByTestId("date-container-Data do Contador"), {
      target: { value: "2024-08-15" },
    });

    fireEvent.click(screen.getByText("Registrar"));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Contador registrado com sucesso!"
      );
    });
  });

  test("displays error when addContadores service returns an error", async () => {
    addContadores.mockResolvedValueOnce({
      type: "error",
      data: "Erro na requisição",
    });

    render(
      <MemoryRouter>
        <AddContador />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("XYZ123")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId("equipamento"), {
      target: { value: "XYZ123" },
    });

    fireEvent.change(screen.getByLabelText("Contador Preto e Branco"), {
      target: { value: "100" },
    });

    fireEvent.change(screen.getByTestId("date-container-Data do Contador"), {
      target: { value: "2024-08-15" },
    });

    fireEvent.click(screen.getByText("Registrar"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Erro ao registrar contador: Erro na requisição"
      );
    });
  });

  test("displays error when getPrinters returns an error status code", async () => {
    getPrinters.mockResolvedValueOnce({ type: "error" });

    render(
      <MemoryRouter>
        <AddContador />
      </MemoryRouter>
    );

    await waitFor(() => {
      fireEvent.change(screen.getByTestId("equipamento"), {
        target: { value: "XYZ123" },
      });
      expect(toast.error).toHaveBeenCalledWith("Erro ao buscar impressoras!");
    });
  });

  test("displays error when getLocalizacao returns an error status code", async () => {
    getLocalizacao.mockResolvedValueOnce({ type: "error" });

    render(
      <MemoryRouter>
        <AddContador />
      </MemoryRouter>
    );

    await waitFor(() => {
      fireEvent.change(screen.getByTestId("equipamento"), {
        target: { value: "XYZ123" },
      });
      expect(toast.error).toHaveBeenCalledWith("Erro ao buscar localizações!");
    });
  });
});
