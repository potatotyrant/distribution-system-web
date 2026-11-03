"use client";

import { AuthLevel } from "@/types/user";
import CommunitySection from "./CommunitySection";
import ContentSection from "./ContentSection";
import ContractSection from "./ContractSection";
import ServiceSection from "./ServiceSection";
import { layout, wordmarkMarginBottom } from "@/styles/layout-metrics";
import styled from "styled-components";
import { useAuthStore } from "@/stores/use-auth-store";

const SidebarContainer = styled.nav`
  display: flex;
  flex-direction: column;
  width: 320px;
  background-color: #0a0a0a;
  color: #fafafa;
  padding: ${layout.sidebarPaddingTop}px 24px 48px;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
  border-right: 1px solid #2a2a2a;
  gap: ${layout.sidebarGap}px;

  &::-webkit-scrollbar-track {
    background: #0a0a0a;
  }
  &::-webkit-scrollbar-thumb {
    background: #2a2a2a;
  }

  @media (max-width: 768px) {
    width: 100%;
    min-width: auto;
    border-right: none;
    border-bottom: 1px solid #2a2a2a;
    position: relative;
    height: auto;
  }
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  padding: ${layout.wordmarkPaddingTop}px 0 ${layout.wordmarkPaddingBottom}px;
  margin-bottom: ${wordmarkMarginBottom}px;
`;

const BrandMark = styled.div`
  font-family: "Recital", serif;
  font-weight: 400;
  font-size: ${layout.wordmarkFontSize}px;
  line-height: ${layout.wordmarkLineHeight};
  letter-spacing: -0.02em;
  color: #fafafa;
  white-space: nowrap;
`;

const TradeMark = styled.span`
  font-family: var(--font-pretendard), Pretendard, sans-serif;
  font-weight: 400;
  font-size: inherit;
  line-height: inherit;
  color: inherit;
`;

export default function Sidebar() {
  const user = useAuthStore((state) => state.user);
  if (!user) return null;

  return (
    <SidebarContainer>
      <Brand>
        <BrandMark>
          Audioguys for Artists<TradeMark>™</TradeMark>
        </BrandMark>
      </Brand>
      {user.authLevel === AuthLevel.ADMIN && <ContractSection />}
      {user.authLevel === AuthLevel.ADMIN && (
        <ContentSection authLevel={user.authLevel} />
      )}
      <ServiceSection authLevel={user.authLevel} />
      <CommunitySection />
    </SidebarContainer>
  );
}
