import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Dashboard from "../../pages/Dashboard";
import { getFiltroOpcoes, getDashboardData } from "../../services/dasboardService";
import { MemoryRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { formatDate } from "../../pages/Dashboard";

jest.mock("../../services/dasboardService");
jest.mock("react-toastify");

beforeAll(() => {
  global.ResizeObserver = class {
    observe() { }
    unobserve() { }
    disconnect() { }
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

  test("updates data based on selected filters", async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByTestId("cidade"), {
      target: { value: "City 1" },
    });

    fireEvent.change(screen.getByTestId("regional"), {
      target: { value: "Regional 1" },
    });

    fireEvent.change(screen.getByTestId("unidade"), {
      target: { value: "Unidade 1" },
    });


    await waitFor(() => {
      expect(screen.getByText("150")).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("0")).toBeInTheDocument();
    });
  });
  test("handles error gracefully when getFiltroOpcoes fails", async () => {

    getFiltroOpcoes.mockRejectedValueOnce(new Error("Erro ao buscar opções de filtros"));

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText("Impressões totais")).toBeInTheDocument();
      expect(screen.queryByText("Impressoras coloridas")).toBeInTheDocument();
      expect(screen.queryByText("Impressoras Monocromáticas")).toBeInTheDocument();
    });
  });
  test("handles error gracefully when getDashboardData fails", async () => {
    getDashboardData.mockRejectedValueOnce(new Error("Erro ao buscar dados do dashboard"));

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText("Impressões totais")).toBeInTheDocument();
      expect(screen.queryByText("Impressoras coloridas")).toBeInTheDocument();
      expect(screen.queryByText("Impressoras Monocromáticas")).toBeInTheDocument();
    });

  });

  test("generates PDF correctly for different filter scenarios", async () => {
    // Cenário 1: ambos os filtros estão vazios
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
  
    // Cenário: Nenhum filtro aplicado (ambos vazios)
    await waitFor(() => {
      expect(screen.getByText("150")).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("0")).toBeInTheDocument();
    });
  
    let pdfButton = screen.getByText("Gerar PDF");
    fireEvent.click(pdfButton);
  
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("PDF gerado com sucesso!");
    });
  
    // Cenário 2: Apenas o filtro de início está preenchido
    fireEvent.change(screen.getByTestId("inicio"), {
      target: { value: "2024-08-01" },
    });
  
    fireEvent.click(pdfButton);
  
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("PDF gerado com sucesso!");
    });
  
    // Cenário 3: Apenas o filtro de fim está preenchido
    fireEvent.change(screen.getByTestId("inicio"), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByTestId("fim"), {
      target: { value: "2024-09-01" },
    });
  
    fireEvent.click(pdfButton);
  
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("PDF gerado com sucesso!");
    });
  
    // Cenário 4: Ambos os filtros estão preenchidos
    fireEvent.change(screen.getByTestId("inicio"), {
      target: { value: "2024-08-01" },
    });
    fireEvent.change(screen.getByTestId("fim"), {
      target: { value: "2024-09-01" },
    });
  
    fireEvent.click(pdfButton);
  
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("PDF gerado com sucesso!");
    });
  });

  test("formats date correctly using formatDate function", () => {
    expect(formatDate("2024-08-15")).toBe("15/08/2024");
    expect(formatDate("")).toBe("");
    expect(formatDate("2022-01-01")).toBe("01/01/2022");
  });

 /* test("calls renderCustomizedLabel function", async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
  
    // Espera o gráfico de Pizza ser renderizado
    await waitFor(() => {
      const pieChartElements = screen.getAllByRole('img'); // Verifica se elementos SVG foram renderizados
      expect(pieChartElements.length).toBeGreaterThan(0); // Verifica se pelo menos um SVG foi encontrado
    });
  });*/
})
