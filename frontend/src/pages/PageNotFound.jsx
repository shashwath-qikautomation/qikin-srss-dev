import { Container } from "@mui/material";
import React from "react";
import ErrorImage from "../assets/images/error.jpg";

function PageNotFound() {
  return (
    <Container>
      <div className="error-boundary">
        <h4>404-Page not found</h4>
        <p>Oops!!..We're having trouble finding that page</p>
        <img src={ErrorImage} alt="page not found" width={400}></img>
      </div>
    </Container>
  );
}

export default PageNotFound;
