"use client";

import styled from "styled-components";

const LayoutContainer = styled.div`
  display: flex;
  flex: 1;
  min-height: 100%;
  background-color: #fafafa;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export default LayoutContainer;
