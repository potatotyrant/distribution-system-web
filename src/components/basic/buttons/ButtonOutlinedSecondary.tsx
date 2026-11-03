import React from "react";
import styled from "styled-components";
import theme from "@/styles/theme";

interface ButtonOutlinedSecondaryProps {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  label: string;
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
  padding: ${(props) => {
    switch (props.$size) {
      case "medium":
        return "9px 20px";
      case "small":
        return "7px 14px";
      default:
        return "12px 28px";
    }
  }};
  border: 1px solid ${theme.colors.gray[50]};
  border-radius: 8px;
  background-color: ${theme.colors.white};
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${(props) => (props.$size === "large" ? "6px" : "4px")};
  width: ${(props) => (props.$expand ? "100%" : "fit-content")};
  height: fit-content;
  color: ${(props) =>
    props.$disabled ? theme.colors.gray[100] : theme.colors.purple[600]};
  ${theme.fonts.body1.semibold}

  &:hover {
    background-color: ${(props) =>
      props.$disabled ? theme.colors.white : theme.colors.gray[25]};
  }

  &:active {
    background-color: ${(props) =>
      props.$disabled ? theme.colors.white : theme.colors.gray[50]};
  }
`;

const IconWrapper = styled.span<{
  $disabled?: boolean;
  $size?: "large" | "medium" | "small";
}>`
  display: flex;
  align-items: center;
  color: ${(props) =>
    props.$disabled ? theme.colors.gray[100] : theme.colors.purple[600]};
  svg {
    width: ${(props) => {
      switch (props.$size) {
        case "medium":
          return "18px";
        case "small":
          return "16px";
        default:
          return "20px";
      }
    }};
    height: ${(props) => {
      switch (props.$size) {
        case "medium":
          return "18px";
        case "small":
          return "16px";
        default:
          return "20px";
      }
    }};
    stroke: ${(props) =>
      props.$disabled ? theme.colors.gray[100] : theme.colors.purple[600]};
    path {
      stroke: ${(props) =>
        props.$disabled ? theme.colors.gray[100] : theme.colors.purple[600]};
    }
  }
`;

const LabelWrapper = styled.span<{ $size?: "large" | "medium" | "small" }>`
  ${(props) => {
    switch (props.$size) {
      case "medium":
        return theme.fonts.body2.semibold;
      case "small":
        return theme.fonts.label2.semibold;
      default:
        return theme.fonts.body1.semibold;
    }
  }}
`;

const ButtonOutlinedSecondary: React.FC<ButtonOutlinedSecondaryProps> = ({
  leftIcon,
  rightIcon,
  label,
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
      {leftIcon && (
        <IconWrapper $disabled={disabled} $size={size}>
          {leftIcon}
        </IconWrapper>
      )}
      <LabelWrapper $size={size}>{label}</LabelWrapper>
      {rightIcon && (
        <IconWrapper $disabled={disabled} $size={size}>
          {rightIcon}
        </IconWrapper>
      )}
    </ButtonWrapper>
  );
};

export default ButtonOutlinedSecondary;
