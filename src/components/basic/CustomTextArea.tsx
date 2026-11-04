import styled from "styled-components";
import theme from "@/styles/theme";

const Container = styled.div<{ $expand?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: ${({ $expand }) => ($expand ? "100%" : "auto")};
`;

const LabelContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Label = styled.label<{ $disabled?: boolean }>`
  ${theme.fonts.body1.medium}
  color: ${({ $disabled }) =>
    $disabled ? theme.colors.gray[300] : theme.colors.gray[600]};
`;

const Required = styled.span<{ $disabled?: boolean }>`
  ${theme.fonts.body1.medium}
  color: ${({ $disabled }) =>
    $disabled ? theme.colors.red[300] : theme.colors.red[600]};
`;

const HelpText = styled.div<{ $isError?: boolean }>`
  ${theme.fonts.label2.regular}
  color: ${({ $isError }) =>
    $isError ? theme.colors.red[500] : theme.colors.gray[300]};
`;

const TextAreaContainer = styled.div<{
  $isError?: boolean;
  $locked?: boolean;
  $disabled?: boolean;
  $expand?: boolean;
  $height?: string;
}>`
  display: flex;
  width: ${({ $expand }) => ($expand ? "100%" : "320px")};
  height: ${({ $height }) => ($height ? $height : "auto")};
  min-height: ${({ $expand }) => ($expand ? "100%" : "160px")};
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

  &:focus-within {
    border-color: ${({ $isError }) =>
      $isError ? theme.colors.red[600] : theme.colors.purple[600]};
  }
`;

const TextArea = styled.textarea<{
  $disabled?: boolean;
  $locked?: boolean;
  $hideScrollbar?: boolean;
  $height?: string;
}>`
  ${theme.fonts.body1.regular}
  width: 100%;
  height: ${({ $height }) => ($height ? $height : "100%")};
  padding: 12px 14px;
  color: ${({ $locked, $disabled }) =>
    $disabled
      ? theme.colors.gray[100]
      : $locked
      ? theme.colors.gray[500]
      : theme.colors.gray[800]};
  font-feature-settings: "ss10" on;
  border: none;
  outline: none;
  background: transparent;
  resize: ${({ $height }) => ($height ? "none" : "vertical")};
  min-height: ${({ $height }) =>
    $height && $height !== "auto" ? $height : "160px"};
  overflow-y: auto;
  font-family: inherit;

  ${({ $hideScrollbar }) =>
    $hideScrollbar &&
    `
    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
  `}

  &::placeholder {
    color: #cacaca;
    font-feature-settings: "ss10" on;
    ${theme.fonts.body1.regular}
  }

  &,
  &:focus {
    ${theme.fonts.body1.regular}
  }
`;

interface TextAreaProps {
  label?: string;
  required?: boolean;
  locked?: boolean;
  helpText?: string;
  isError?: boolean;
  placeholder?: string;
  disabled?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  hideScrollbar?: boolean;
  expand?: boolean;
  height?: string;
}

const CustomTextArea = ({
  label,
  helpText,
  required,
  locked,
  isError,
  placeholder,
  disabled,
  value,
  onChange = () => {},
  hideScrollbar = false,
  expand = false,
  height = "auto",
  ...props
}: TextAreaProps) => {
  return (
    <Container $expand={expand}>
      <LabelContainer>
        {label && <Label $disabled={disabled}>{label}</Label>}
        {required && <Required $disabled={disabled}>*</Required>}
      </LabelContainer>
      <TextAreaContainer
        $isError={isError}
        $locked={locked}
        $disabled={disabled}
        $expand={expand}
        $height={height}
      >
        <TextArea
          {...props}
          placeholder={placeholder}
          disabled={locked || disabled}
          value={value}
          onChange={onChange}
          $disabled={disabled}
          $locked={locked}
          $hideScrollbar={hideScrollbar}
          $height={height}
        />
      </TextAreaContainer>
      {helpText && <HelpText $isError={isError}>{helpText}</HelpText>}
    </Container>
  );
};

export default CustomTextArea;
