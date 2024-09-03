import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Dashboard from "../../pages/Dashboard";
import { getFiltroOpcoes, getDashboardData } from "../../services/dasboardService";
import { MemoryRouter } from "react-router-dom";
import { toast } from "react-toastify";

jest.mock("../../services/dasboardService");
jest.mock("react-toastify");

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe("Dashboard", () => {
  beforeEach(() => {
    getFiltroOpcoes.mockResolvedValue({
      type: "success",
      data: {
        periodos: ["2024-08", "2024-09"],
        cidades: ["City 1", "City 2"],
        regionais: ["Regional 1", "Regional 2"],
        unidades: ["Unidade 1", "Unidade 2"]
      }
    });

    getDashboardData.mockResolvedValue({
      type: "success",
      data: {
        impressoras: [
          {
            numSerie: "XYZ123",
            modeloId: "Modelo 1",
            localizacao: "City 1;Regional 1;Unidade 1",
            dataContador: "2024-08-15T10:00:00Z",
            contadorAtualPB: 100,
            contadorAtualCor: 50
          }
        ],
        colorModelIds: ["Modelo 1"],
        pbModelIds: ["Modelo 2"]
      }
    });

    toast.error = jest.fn();
    toast.success = jest.fn();
  });

  test("renders the page correctly", async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Impressões totais")).toBeInTheDocument();
    expect(screen.getByText("Impressoras coloridas")).toBeInTheDocument();
    expect(screen.getByText("Impressoras Monocromáticas")).toBeInTheDocument();
    expect(screen.getByText("Distribuição de impressões por Tipo")).toBeInTheDocument();
    expect(screen.getByText("Número de impressões por localidade")).toBeInTheDocument();
    expect(screen.getByText("Número de equipamentos por localidade")).toBeInTheDocument();
  });



});
