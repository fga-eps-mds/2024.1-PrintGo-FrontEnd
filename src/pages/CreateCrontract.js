import "../style/pages/createUser.css";
import React from "react";
import Navbar from "../components/navbar/Navbar";
import ContractForm from "../components/forms/ContractForm"

export default function CreateUserPage() {
  return (
    <>
      <Navbar />
      <div id="create-contract-container">
        <ContractForm/>
      </div>
    </>
  );
}
