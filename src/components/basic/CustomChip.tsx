import XIcon from "../icons/XIcon";
import styled from "styled-components";
import theme from "@/styles/theme";

interface CustomChipProps {
  label: string;
  icon?: React.ReactNode;
  deletable?: boolean;
  onClick?: () => void;
  isSelected?: boolean;
}

const IconWrapper = styled.div`
  display: flex;
  align-items: center;

  svg {
    width: 24px;
    height: 24px;
  }
`;

const DeleteIconWrapper = styled.div`
  display: flex;
  align-items: center;

  svg {
    width: 18px;
    height: 18px;
  }
`;

const ChipContainer = styled.div<{
  $deletable?: boolean;
  $isSelected?: boolean;
}>`
  display: flex;
  padding: ${({ $deletable }) => ($deletable ? "8px 12px" : "8px 16px")};
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-family: var(--font-pretendard), Pretendard, sans-serif;
  font-weight: 400;
  font-size: 14px;
  letter-spacing: -0.01em;
  line-height: 1.4;
  text-transform: none;
  color: ${theme.colors.gray[800]};
  border: 1px solid
    ${({ $isSelected }) =>
      $isSelected ? theme.colors.purple[600] : theme.colors.gray[50]};
  border-radius: 2px;
  width: fit-content;
  min-width: min-content;
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
  user-select: none;
  background-color: ${({ $isSelected }) =>
    $isSelected ? theme.colors.gray[25] : "transparent"};
  &:hover {
    border-color: ${theme.colors.purple[600]};
  }
  &:active {
    background-color: ${theme.colors.purple[600]};
    color: ${theme.colors.white};
    border-color: ${theme.colors.purple[600]};
  }
`;

const CustomChip = ({
  label,
  icon,
  onClick,
  deletable,
  isSelected,
}: CustomChipProps) => {
  return (
    <ChipContainer
      $deletable={deletable}
      $isSelected={isSelected}
      onClick={onClick}
    >
      {icon && <IconWrapper>{icon}</IconWrapper>}
      {label}
      {deletable && (
        <DeleteIconWrapper>
          <XIcon />
        </DeleteIconWrapper>
      )}
    </ChipContainer>
  );
};

export default CustomChip;
