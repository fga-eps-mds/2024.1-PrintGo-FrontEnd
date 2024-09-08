import "../style/pages/editPrinter.css";
import React from "react";
import EditPrinterForm from "../components/forms/EditPrinterForm.js";
import Navbar from "../components/navbar/Navbar";

export default function EditPrinterPage() {
  return (
    <>
      <Navbar />
      <div>
        <EditPrinterForm/>
      </div>
    </>
  );
}
