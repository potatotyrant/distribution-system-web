import React, { useEffect, useRef, useState } from "react";

import ArrowDownIcon from "../icons/ArrowDownIcon";
import CheckIcon from "../icons/CheckIcon";
import CustomChip from "./CustomChip";
import { createPortal } from "react-dom";
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

const DropdownContainer = styled.button<{
  $selected?: boolean;
  $disabled?: boolean;
  $size?: "small" | "normal";
  $width?: number;
}>`
  display: flex;
  height: ${({ $size }) => ($size === "small" ? "42px" : "48px")};
  width: ${({ $width }) => $width}px;
  padding: 4px 8px 4px 14px;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  border: 1px solid
    ${({ $disabled }) =>
      $disabled ? theme.colors.gray[25] : theme.colors.gray[50]};
  background: ${theme.colors.white};
  cursor: ${({ $disabled }) => ($disabled ? "default" : "pointer")};

  &:hover:not(:disabled) {
    border-color: ${theme.colors.gray[100]};
  }

  &:active:not(:disabled) {
    border-color: ${theme.colors.purple[600]};
  }
`;

const Content = styled.span<{
  $selected?: boolean;
  $disabled?: boolean;
  $size?: "small" | "normal";
}>`
  ${({ $size }) =>
    $size === "small" ? theme.fonts.body2.medium : theme.fonts.body1.medium}
  color: ${({ $selected, $disabled }) =>
    $disabled
      ? theme.colors.gray[100]
      : $selected
      ? theme.colors.gray[800]
      : theme.colors.gray[300]};
  flex: 1;
  text-align: left;
`;

const IconContainer = styled.div<{ $size?: "small" | "normal" }>`
  display: flex;
  width: ${({ $size }) => ($size === "small" ? "32px" : "40px")};
  height: ${({ $size }) => ($size === "small" ? "32px" : "40px")};
  padding: 8px;
  justify-content: center;
  align-items: center;

  svg {
    width: ${({ $size }) => ($size === "small" ? "18px" : "24px")};
    height: ${({ $size }) => ($size === "small" ? "18px" : "24px")};
  }
`;

const ListContainer = styled.div`
  position: relative;
  width: 100%;
`;

const List = styled.ul`
  background: ${theme.colors.white};
  border-radius: 8px;
  border: 1px solid ${theme.colors.gray[50]};
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 300px;
  overflow-y: auto;
`;

const ListItem = styled.li<{ $size?: "small" | "normal" }>`
  padding: ${({ $size }) => ($size === "small" ? "8px 14px" : "12px 14px")};
  ${({ $size }) =>
    $size === "small" ? theme.fonts.body2.medium : theme.fonts.body1.medium}
  color: ${theme.colors.gray[800]};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  &:not(:last-child)::after {
    content: "";
    position: relative;
    display: block;
    height: 1px;
    background-color: ${theme.colors.gray[50]};
    margin: 0 14px;
  }

  &:hover {
    background: ${theme.colors.gray[25]};
  }
`;

const CheckboxContainer = styled.div<{
  $selected: boolean;
  $size?: "small" | "normal";
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $size }) => ($size === "small" ? "16px" : "20px")};
  height: ${({ $size }) => ($size === "small" ? "16px" : "20px")};
  padding: 2px;
  border-radius: 4px;
  background-color: ${({ $selected }) =>
    $selected ? theme.colors.purple[600] : theme.colors.gray[50]};
  margin-right: 8px;
`;

const ChipsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

interface CustomDropdownProps {
  label?: string;
  required?: boolean;
  selectedKey?: string;
  selectedKeys?: string[];
  placeholder?: string;
  width?: number;
  disabled?: boolean;
  size?: "small" | "normal";
  onSelectKey?: (key: string) => void;
  onMultiSelectKeys?: (keys: string[]) => void;
  items: { key: string; value: string }[];
  multiple?: boolean;
  readOnly?: boolean;
}

const CustomDropdown = ({
  label,
  required,
  selectedKey,
  selectedKeys = [],
  placeholder = "",
  width = 180,
  disabled,
  size = "normal",
  onSelectKey,
  onMultiSelectKeys,
  items,
  multiple = false,
  readOnly = false,
}: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !(portalRef.current && portalRef.current.contains(event.target as Node))
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClick = () => {
    if (!disabled && !readOnly) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (item: { key: string; value: string }) => {
    if (readOnly || disabled) return;

    if (multiple) {
      const newSelectedKeys = selectedKeys.includes(item.key)
        ? selectedKeys.filter((k) => k !== item.key)
        : [...selectedKeys, item.key];
      onMultiSelectKeys?.(newSelectedKeys);
    } else {
      onSelectKey?.(item.key);
      setIsOpen(false);
    }
  };

  const handleChipDelete = (key: string) => {
    if (readOnly || disabled) return;

    const newSelectedKeys = selectedKeys.filter((k) => k !== key);
    onMultiSelectKeys?.(newSelectedKeys);
  };

  const isItemSelected = (item: { key: string; value: string }) => {
    if (multiple) {
      return selectedKeys.includes(item.key);
    } else {
      return selectedKey === item.key;
    }
  };

  const getDisplayText = () => {
    if (multiple) {
      return placeholder;
    } else {
      const selectedItem = items.find((item) => item.key === selectedKey);
      return selectedItem ? selectedItem.value : placeholder;
    }
  };

  const renderDropdownList = () => {
    if (!dropdownRef.current) return null;
    const rect = dropdownRef.current.getBoundingClientRect();
    return createPortal(
      <div
        ref={portalRef}
        style={{
          position: "absolute",
          top: rect.bottom + window.scrollY + 8,
          left: rect.left + window.scrollX,
          width: rect.width,
          zIndex: 9999,
          pointerEvents: "auto",
        }}
      >
        <List>
          {items.map((item, index) => (
            <ListItem
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(item);
              }}
              $size={size}
            >
              {multiple && (
                <CheckboxContainer
                  $selected={isItemSelected(item)}
                  $size={size}
                >
                  <CheckIcon
                    color="white"
                    width={size === "small" ? 12 : 16}
                    height={size === "small" ? 12 : 16}
                  />
                </CheckboxContainer>
              )}
              {item.value}
            </ListItem>
          ))}
        </List>
      </div>,
      document.body,
    );
  };

  return (
    <Container $hasLabel={!!label}>
      <LabelContainer>
        {label && (
          <Label $disabled={disabled} $size={size}>
            {label}
          </Label>
        )}
        {required && (
          <Required $disabled={disabled} $size={size}>
            *
          </Required>
        )}
      </LabelContainer>
      <ListContainer ref={dropdownRef}>
        <DropdownContainer
          $selected={!!selectedKey || (multiple && selectedKeys.length > 0)}
          $disabled={disabled}
          $size={size}
          $width={width}
          onClick={handleClick}
          disabled={disabled}
          style={{
            cursor: readOnly ? "default" : disabled ? "default" : "pointer",
          }}
        >
          <Content
            $selected={!!selectedKey || (multiple && selectedKeys.length > 0)}
            $disabled={disabled}
            $size={size}
          >
            {getDisplayText()}
          </Content>
          {!readOnly && (
            <IconContainer $size={size}>
              <ArrowDownIcon
                color={
                  disabled ? theme.colors.gray[300] : theme.colors.gray[500]
                }
              />
            </IconContainer>
          )}
        </DropdownContainer>
      </ListContainer>
      {isOpen && !disabled && !readOnly && renderDropdownList()}
      {multiple && selectedKeys.length > 0 && (
        <ChipsContainer>
          {items
            .filter((item) => selectedKeys.includes(item.key))
            .map((item, index) => (
              <CustomChip
                key={index}
                label={item.value}
                deletable
                onClick={() => handleChipDelete(item.key)}
              />
            ))}
        </ChipsContainer>
      )}
    </Container>
  );
};

export default CustomDropdown;
