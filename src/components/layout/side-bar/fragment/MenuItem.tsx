import Link from "next/link";
import styled from "styled-components";

const MenuGroupButton = styled.div`
  display: flex;
  height: 44px;
  padding: 0 8px;
  justify-content: flex-start;
  align-items: center;
  align-self: stretch;
  gap: 10px;
  cursor: pointer;
  font-family: var(--font-pretendard), Pretendard, sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: -0.01em;
  color: #fafafa;

  > :last-child {
    margin-left: auto;
    display: flex;
  }

  svg path {
    stroke: #cacaca;
  }
`;

const MenuGroup = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
`;

const MenuLabel = styled.div`
  font-family: var(--font-pretendard), Pretendard, sans-serif;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: -0.01em;
  color: #eaeaea;
  display: flex;
  height: 32px;
  padding: 0 8px;
  justify-content: flex-start;
  align-items: center;
  align-self: stretch;
`;

const MenuItem = styled.div<{ $isActive?: boolean }>`
  display: flex;
  flex-direction: row;
  height: 40px;
  padding: 0 12px;
  margin-left: 16px;
  justify-content: flex-start;
  align-items: center;
  align-self: stretch;
  gap: 8px;
  border-radius: 2px;
  text-align: left;
  transition: background-color 180ms ease, color 180ms ease;

  background-color: ${({ $isActive }) =>
    $isActive ? "#1a1a1a" : "transparent"};

  color: ${({ $isActive }) => ($isActive ? "#4fe699" : "#eaeaea")};

  &:hover {
    background-color: ${({ $isActive }) =>
      $isActive ? "#1a1a1a" : "#2a2a2a"};
  }

  ${({ $isActive }) =>
    $isActive
      ? `
    &::before {
      content: "";
      width: 6px;
      height: 6px;
      background: #4fe699;
      flex-shrink: 0;
    }
  `
      : ""}

  font-family: var(--font-pretendard), Pretendard, sans-serif;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.4;
  letter-spacing: -0.01em;
`;

const MenuItemLink = styled(Link)``;

export { MenuItemLink, MenuItem, MenuGroupButton, MenuGroup, MenuLabel };
