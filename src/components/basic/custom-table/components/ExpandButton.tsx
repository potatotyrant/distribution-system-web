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
  width: 28px;
  height: 28px;
  padding: 5px;
  border-radius: 50%;
  border: 1px solid
    ${({ $isExpanded }) =>
      $isExpanded ? theme.colors.purple[600] : theme.colors.gray[50]};
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;

  svg {
    transform: ${({ $isExpanded }) =>
      $isExpanded ? "rotate(180deg)" : "rotate(0)"};
    transition: transform 0.2s ease;
  }
`;

const ExpandButton = ({ isExpanded, onClick }: ExpandButtonProps) => {
  return (
    <Button $isExpanded={isExpanded} onClick={onClick}>
      <ArrowDownIcon
        width={13.5}
        height={13.5}
        color={isExpanded ? theme.colors.purple[600] : theme.colors.gray[500]}
      />
    </Button>
  );
};

export default ExpandButton;
