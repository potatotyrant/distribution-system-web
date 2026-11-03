"use client";

import React from "react";
import styled from "styled-components";
import { STATUS_COLORS } from "@/constants/status-colors";

const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 2px;
  border: 1px solid #eaeaea;
  background: #ffffff;
`;

const StatusIndicator = styled.div<{ color: string }>`
  width: 6px;
  height: 6px;
  background-color: ${({ color }) => color};
  flex-shrink: 0;
`;

const StatusText = styled.span`
  color: #1a1a1a;
  font-family: var(--font-pretendard), Pretendard, sans-serif;
  font-weight: 400;
  font-size: 11px;
  line-height: 1.4;
  letter-spacing: -0.01em;
  text-transform: none;
`;

interface StatusDisplayProps {
  status: string;
  text: string;
  color: string;
  isLoading?: boolean;
}

export default function StatusDisplay({ 
  status, 
  text, 
  color, 
  isLoading = false 
}: StatusDisplayProps) {
  return (
    <StatusContainer>
      <StatusIndicator color={color} />
      <StatusText>{text}</StatusText>
      {isLoading && <span>로딩 중...</span>}
    </StatusContainer>
  );
}