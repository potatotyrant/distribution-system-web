import React from "react";
import styled from "styled-components";
import theme from "@/styles/theme";

interface ButtonTextPrimaryProps {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  size?: "medium" | "small";
  expand?: boolean;
}

const ButtonWrapper = styled.button<{
  $disabled?: boolean;
  $size?: "medium" | "small";
  $expand?: boolean;
}>`
  padding: ${(props) => {
    switch (props.$size) {
      case "small":
        return "7px 14px";
      default:
        return "9px 20px";
    }
  }};
  border: none;
  border-radius: 8px;
  background-color: transparent;
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: ${(props) => (props.$expand ? "100%" : "fit-content")};
  height: fit-content;
  color: ${(props) =>
    props.$disabled ? theme.colors.gray[100] : theme.colors.purple[600]};
  ${theme.fonts.body1.semibold}

  &:hover {
    color: ${(props) =>
      props.$disabled ? theme.colors.gray[100] : theme.colors.purple[700]};
  }

  &:active {
    color: ${(props) =>
      props.$disabled ? theme.colors.gray[100] : theme.colors.purple[800]};
  }
`;

const IconWrapper = styled.span<{
  $disabled?: boolean;
  $size?: "medium" | "small";
}>`
  display: flex;
  align-items: center;
  color: ${(props) =>
    props.$disabled ? theme.colors.gray[100] : theme.colors.purple[600]};
  svg {
    width: ${(props) => {
      switch (props.$size) {
        case "small":
          return "16px";
        default:
          return "18px";
      }
    }};
    height: ${(props) => {
      switch (props.$size) {
        case "small":
          return "16px";
        default:
          return "18px";
      }
    }};
    stroke: ${(props) =>
      props.$disabled ? theme.colors.gray[100] : theme.colors.purple[600]};
    path {
      stroke: ${(props) =>
        props.$disabled ? theme.colors.gray[100] : theme.colors.purple[600]};
    }
  }

  button:hover & {
    color: ${(props) =>
      props.$disabled ? theme.colors.gray[100] : theme.colors.purple[700]};
    svg {
      stroke: ${(props) =>
        props.$disabled ? theme.colors.gray[100] : theme.colors.purple[700]};
      path {
        stroke: ${(props) =>
          props.$disabled ? theme.colors.gray[100] : theme.colors.purple[700]};
      }
    }
  }

  button:active & {
    color: ${(props) =>
      props.$disabled ? theme.colors.gray[100] : theme.colors.purple[800]};
    svg {
      stroke: ${(props) =>
        props.$disabled ? theme.colors.gray[100] : theme.colors.purple[800]};
      path {
        stroke: ${(props) =>
          props.$disabled ? theme.colors.gray[100] : theme.colors.purple[800]};
      }
    }
  }
`;

const LabelWrapper = styled.span<{ $size?: "medium" | "small" }>`
  ${(props) => {
    switch (props.$size) {
      case "small":
        return theme.fonts.label2.semibold;
      default:
        return theme.fonts.body2.semibold;
    }
  }}
`;

const ButtonTextPrimary: React.FC<ButtonTextPrimaryProps> = ({
  leftIcon,
  rightIcon,
  label,
  onClick,
  disabled = false,
  size = "medium",
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

export default ButtonTextPrimary;
