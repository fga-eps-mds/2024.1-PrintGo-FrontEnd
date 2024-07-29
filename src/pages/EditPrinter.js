import "../style/pages/editPrinter.css";
import React from "react";
import EditPrinterForm from "../components/forms/EditPrinterForm.js";
import Navbar from "../components/navbar/Navbar";
import { useParams } from "react-router-dom";

export default function EditPrinterPage() {
  const { printer } = useParams();
  return (
    <>
      <Navbar />
      <div id="editPrinter-container">
        <EditPrinterForm/>
      </div>
    </>
  );
}
