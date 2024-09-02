import "../style/pages/patternPrinter.css";
import React from "react";
import PrinterPatternForm from "../components/forms/PrinterPatternForm.js";
import Navbar from "../components/navbar/Navbar";

export default function PatternPrinter() {
  return (
    <>
      <Navbar />
      <div
        id="register-printer-pattern-container"
        data-testid="register-printer-pattern-container"
      >
        <PrinterPatternForm />
      </div>
    </>
  );
}
