import React from "react";
import styled from "styled-components/macro";

export default function App() {
  return <HelloDiv>Hello, world!</HelloDiv>;
}

const HelloDiv = styled.div`
  font-size: 32px;
  font-family: "Lemon Milk";
`;
