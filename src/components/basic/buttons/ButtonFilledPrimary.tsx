import React from "react";
import styled from "styled-components";
import theme from "@/styles/theme";

interface ButtonFilledPrimaryProps {
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
        return "8px 18px";
      case "small":
        return "6px 14px";
      default:
        return "12px 24px";
    }
  }};
  border: 1px solid ${(props) => (props.$disabled ? "#eaeaea" : "#2a2a2a")};
  border-radius: 8px;
  background-color: ${(props) => (props.$disabled ? "#f6f6f6" : "#0a0a0a")};
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${(props) => (props.$size === "large" ? "10px" : "4px")};
  width: ${(props) => (props.$expand ? "100%" : "fit-content")};
  height: fit-content;
  color: ${(props) => (props.$disabled ? "#cacaca" : "#fafafa")};
  ${theme.fonts.body1.medium}
  font-weight: 500;
  transition: background-color 180ms ease, border-color 180ms ease;

  &:hover {
    background-color: ${(props) => (props.$disabled ? "#f6f6f6" : "#1a1a1a")};
  }

  &:active {
    background-color: ${(props) => (props.$disabled ? "#f6f6f6" : "#2a2a2a")};
  }
`;

const IconWrapper = styled.span<{
  $disabled?: boolean;
  $size?: "large" | "medium" | "small";
}>`
  display: flex;
  align-items: center;
  color: ${(props) =>
    props.$disabled ? theme.colors.gray[100] : theme.colors.white};
  /* background-color: yellow; */
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
      props.$disabled ? theme.colors.gray[100] : theme.colors.white};
    path {
      stroke: ${(props) =>
        props.$disabled ? theme.colors.gray[100] : theme.colors.white};
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

const ButtonFilledPrimary: React.FC<ButtonFilledPrimaryProps> = ({
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

export default ButtonFilledPrimary;
