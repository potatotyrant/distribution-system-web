import styled from "styled-components";
import theme from "@/styles/theme";

const Container = styled.div<{ $hasLabel?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $hasLabel }) => ($hasLabel ? "8px" : "0")};
`;

const LabelContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Label = styled.label<{ $disabled?: boolean; $size?: "small" | "normal" }>`
  ${({ $size }) =>
    $size === "small" ? theme.fonts.body2.medium : theme.fonts.body1.medium}
  color: ${({ $disabled }) =>
    $disabled ? theme.colors.gray[300] : theme.colors.gray[600]};
`;

const Required = styled.span<{
  $disabled?: boolean;
  $size?: "small" | "normal";
}>`
  ${({ $size }) =>
    $size === "small" ? theme.fonts.body2.medium : theme.fonts.body1.medium}
  color: ${({ $disabled }) =>
    $disabled ? theme.colors.red[300] : theme.colors.red[600]};
`;

const HelpText = styled.div<{ $isError?: boolean }>`
  ${theme.fonts.label2.regular}
  color: ${({ $isError }) =>
    $isError ? theme.colors.red[500] : theme.colors.gray[300]};
`;

const InputContainer = styled.div<{
  $isError?: boolean;
  $width?: number;
  $locked?: boolean;
  $disabled?: boolean;
  $size?: "small" | "normal";
}>`
  display: flex;
  height: ${({ $size }) => ($size === "small" ? "42px" : "48px")};
  width: ${({ $width }) => $width}px;
  padding: 4px 8px 4px ${({ $size }) => ($size === "small" ? "12px" : "14px")};
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  border-radius: 8px;
  border: 1px solid
    ${({ $isError, $disabled }) =>
      $isError
        ? theme.colors.red[600]
        : $disabled
        ? theme.colors.gray[25]
        : theme.colors.gray[50]};
  background: ${({ $locked }) =>
    $locked ? theme.colors.gray[25] : theme.colors.white};
  box-sizing: border-box;
  overflow: hidden;

  &:focus-within {
    border-color: ${({ $isError }) =>
      $isError ? theme.colors.red[600] : theme.colors.purple[600]};
  }
`;

const Input = styled.input<{
  $disabled?: boolean;
  $locked?: boolean;
  $size?: "small" | "normal";
}>`
  ${({ $size }) =>
    $size === "small" ? theme.fonts.body2.regular : theme.fonts.body1.regular}
  flex: 1;
  min-width: 0;
  color: ${({ $locked, $disabled }) =>
    $disabled
      ? theme.colors.gray[100]
      : $locked
      ? theme.colors.gray[500]
      : theme.colors.gray[800]};
  font-feature-settings: "ss10" on;
  text-overflow: ellipsis;
  border: none;
  outline: none;
  background: transparent;

  &::placeholder {
    overflow: hidden;
    color: #cacaca;
    font-feature-settings: "ss10" on;
    text-overflow: ellipsis;

    ${({ $size }) =>
      $size === "small" ? theme.fonts.body2.regular : theme.fonts.body1.regular}
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const IconContainer = styled.div<{ $size?: "small" | "normal" }>`
  display: flex;
  width: ${({ $size }) => ($size === "small" ? "32px" : "40px")};
  height: ${({ $size }) => ($size === "small" ? "32px" : "40px")};
  padding: 8px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  cursor: pointer;

  svg {
    width: ${({ $size }) => ($size === "small" ? "18px" : "24px")};
    height: ${({ $size }) => ($size === "small" ? "18px" : "24px")};
  }
`;

interface InputProps {
  label?: string;
  required?: boolean;
  blueRequired?: boolean;
  locked?: boolean;
  helpText?: string;
  isError?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
  width?: number;
  disabled?: boolean;
  size?: "small" | "normal";
  type?: string;
  readOnly?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onWheel?: (e: React.WheelEvent<HTMLInputElement>) => void;
  onIconClick?: () => void;
  defaultValue?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClick?: () => void;
}

const CustomInput = ({
  label,
  helpText,
  required,
  blueRequired,
  locked,
  isError,
  placeholder,
  icon,
  width = 320,
  disabled,
  size = "normal",
  type = "text",
  onChange,
  readOnly,
  onIconClick,
  onKeyDown,
  onClick,
  ...props
}: InputProps) => {
  return (
    <Container $hasLabel={!!label}>
      {label && (
        <LabelContainer>
          <Label $disabled={disabled} $size={size}>
            {label}
          </Label>
          {required && <Required $disabled={disabled}>*</Required>}
          {blueRequired && (
            <span style={{ color: "blue", marginLeft: "4px" }}>*</span>
          )}
        </LabelContainer>
      )}

      <InputContainer
        $isError={isError}
        $width={width}
        $locked={locked}
        $disabled={disabled}
        $size={size}
      >
        <Input
          {...props}
          type={type}
          placeholder={placeholder}
          disabled={locked || disabled}
          onChange={onChange}
          $disabled={disabled}
          $locked={locked}
          $size={size}
          readOnly={readOnly}
          onKeyDown={onKeyDown}
          onClick={onClick}
        />
        {icon && (
          <IconContainer $size={size} onClick={onIconClick}>
            {icon}
          </IconContainer>
        )}
      </InputContainer>
      {helpText && <HelpText $isError={isError}>{helpText}</HelpText>}
    </Container>
  );
};

export default CustomInput;
