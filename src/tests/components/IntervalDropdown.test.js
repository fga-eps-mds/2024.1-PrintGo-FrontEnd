import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import IntervalDropdown from "../../components/containers/IntervalDropdown";

describe("IntervalDropdown", () => {
  const handleChange = jest.fn();

  test("renders the component with default props", () => {
    render(<IntervalDropdown onChange={handleChange} />);
    const selectElement = screen.getByRole("combobox");
    expect(selectElement).toBeInTheDocument();
    expect(selectElement).toHaveValue("");
  });

  test("should call onChange when a new option is selected", () => {
    const handleChange = jest.fn();
    render(<IntervalDropdown onChange={handleChange} value="" />);

    const selectElement = screen.getByRole("combobox");
    fireEvent.change(selectElement, { target: { value: "00:10" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test("renders the component with a value", () => {
    render(<IntervalDropdown onChange={handleChange} value="00:15" />);
    const selectElement = screen.getByRole("combobox");
    expect(selectElement).toHaveValue("00:15");
  });

  test("should not throw an error when onChange is null", () => {
    render(<IntervalDropdown onChange={null} value="" />);

    const selectElement = screen.getByRole("combobox");

    // Simula uma mudança de valor no dropdown
    fireEvent.change(selectElement, { target: { value: "00:10" } });

    // Verifica que o componente não quebrou, mas não verifica a mudança do valor
    expect(selectElement).toBeInTheDocument();
  });

  test("calls onChange when an option is selected", () => {
    let value = "";
    const handleChange = jest.fn((event) => (value = event.target.value));

    const { rerender } = render(
      <IntervalDropdown value={value} onChange={handleChange} />
    );

    const selectElement = screen.getByRole("combobox");
    fireEvent.change(selectElement, { target: { value: "01:00" } });

    expect(handleChange).toHaveBeenCalledTimes(1);

    rerender(<IntervalDropdown value={value} onChange={handleChange} />);
    expect(selectElement).toHaveValue("01:00");
  });

  test("applies the error class when there is an error", () => {
    render(
      <IntervalDropdown
        onChange={handleChange}
        error="error"
        className="dropdown"
      />
    );
    const selectElement = screen.getByRole("combobox");
    expect(selectElement).toHaveClass("dropdown input-error");
  });

  test("renders all options", () => {
    render(<IntervalDropdown onChange={handleChange} />);
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(17); // 16 opções incluindo a opção vazia "Escolha"
  });

  test("applies the correct value to the select element", () => {
    render(
      <IntervalDropdown
        value="11:00"
        onChange={() => {
          handleChange;
        }}
      />
    );
    const selectElement = screen.getByRole("combobox");
    expect(selectElement.value).toBe("11:00");
  });

  test("calls onChange if it is provided", () => {
    const handleChange = jest.fn();
    render(<IntervalDropdown onChange={handleChange} value="" />);
  
    const selectElement = screen.getByRole("combobox");
    fireEvent.change(selectElement, { target: { value: "00:10" } });
  
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(expect.any(Object));
  });
  
  test("does not throw an error if onChange is not provided", () => {
    render(<IntervalDropdown value="" />);
  
    const selectElement = screen.getByRole("combobox");
    fireEvent.change(selectElement, { target: { value: "00:10" } });
  
    expect(selectElement).toBeInTheDocument();
  });
});
