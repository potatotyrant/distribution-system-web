import ArrowDownIcon from "@/components/icons/ArrowDownIcon";
import styled from "styled-components";
import theme from "@/styles/theme";

interface ExpandButtonProps {
  isExpanded: boolean;
  onClick: () => void;
}

const Button = styled.button<{ $isExpanded: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 16.8px;
  height: 16.8px;
  min-width: 16.8px;
  min-height: 16.8px;
  padding: 0;
  border-radius: 50%;
  border: 1px solid
    ${({ $isExpanded }) =>
      $isExpanded ? theme.colors.purple[600] : theme.colors.gray[50]};
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;

  svg {
    width: 10.2px;
    height: 10.2px;
    flex-shrink: 0;
    transform: ${({ $isExpanded }) =>
      $isExpanded ? "rotate(180deg)" : "rotate(0)"};
    transition: transform 0.2s ease;
  }
`;

const ExpandButton = ({ isExpanded, onClick }: ExpandButtonProps) => {
  return (
    <Button $isExpanded={isExpanded} onClick={onClick}>
      <ArrowDownIcon
        width={10.2}
        height={10.2}
        color={isExpanded ? theme.colors.purple[600] : theme.colors.gray[500]}
      />
    </Button>
  );
};

export default ExpandButton;
