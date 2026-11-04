import React from "react";
import styled from "styled-components";
import theme from "@/styles/theme";

interface ButtonIconNormalProps {
  icon: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  size?: "large" | "medium" | "small";
  expand?: boolean;
}

const ButtonWrapper = styled.button<{
  $disabled?: boolean;
  $size?: "large" | "medium" | "small";
  $expand?: boolean;
}>`
  border: none;
  background-color: ${theme.colors.white};
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props) =>
    props.$expand
      ? "100%"
      : props.$size === "medium"
      ? "32px"
      : props.$size === "small"
      ? "28px"
      : "40px"};
  height: ${(props) => {
    switch (props.$size) {
      case "medium":
        return "32px";
      case "small":
        return "28px";
      default:
        return "40px";
    }
  }};
  border-radius: 8px;

  &:hover {
    background-color: ${theme.colors.gray[25]};
  }

  &:active {
    background-color: ${theme.colors.gray[50]};
  }
`;

const IconWrapper = styled.span<{
  $disabled?: boolean;
  $size?: "large" | "medium" | "small";
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) =>
    props.$disabled ? theme.colors.gray[100] : theme.colors.gray[800]};

  svg {
    width: ${(props) => {
      switch (props.$size) {
        case "medium":
          return "18px";
        case "small":
          return "16px";
        default:
          return "24px";
      }
    }};
    height: ${(props) => {
      switch (props.$size) {
        case "medium":
          return "18px";
        case "small":
          return "16px";
        default:
          return "24px";
      }
    }};
    stroke: ${(props) =>
      props.$disabled ? theme.colors.gray[100] : theme.colors.gray[800]};
    path {
      stroke: ${(props) =>
        props.$disabled ? theme.colors.gray[100] : theme.colors.gray[800]};
    }
  }
`;

const ButtonIconNormal: React.FC<ButtonIconNormalProps> = ({
  icon,
  onClick,
  disabled = false,
  size = "large",
  expand = false,
}) => {
  return (
    <ButtonWrapper
      onClick={disabled ? undefined : onClick}
      $disabled={disabled}
      $size={size}
      $expand={expand}
    >
      <IconWrapper $disabled={disabled} $size={size}>
        {icon}
      </IconWrapper>
    </ButtonWrapper>
  );
};

export default ButtonIconNormal;
