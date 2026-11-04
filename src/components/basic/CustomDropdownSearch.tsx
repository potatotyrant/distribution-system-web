import { useEffect, useRef, useState } from "react";

import ArrowDownIcon from "../icons/ArrowDownIcon";
import CheckIcon from "../icons/CheckIcon";
import CustomChip from "./CustomChip";
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

const DropdownContainer = styled.div<{
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

const SearchInput = styled.input<{
  $size?: "small" | "normal";
  $disabled?: boolean;
}>`
  ${({ $size }) =>
    $size === "small" ? theme.fonts.body2.medium : theme.fonts.body1.medium}
  color: ${({ $disabled }) =>
    $disabled ? theme.colors.gray[100] : theme.colors.gray[800]};
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  width: 100%;

  &::placeholder {
    color: #cacaca;
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
    width: ${({ $size }) => ($size === "small" ? "13.5px" : "18px")};
    height: ${({ $size }) => ($size === "small" ? "13.5px" : "18px")};
  }
`;

const ListContainer = styled.div`
  position: relative;
  width: 100%;
`;

const List = styled.ul`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 0;
  background: ${theme.colors.white};
  z-index: 1;
  border-radius: 8px;
  border: 1px solid ${theme.colors.gray[50]};
  overflow: hidden;
  max-height: 300px;
  overflow-y: auto;
`;

const ListItem = styled.li<{ $size?: "small" | "normal" }>`
  padding: ${({ $size }) => ($size === "small" ? "8px 14px" : "12px 14px")};
  ${({ $size }) =>
    $size === "small" ? theme.fonts.body2.medium : theme.fonts.body1.medium}
  color: ${theme.colors.gray[800]};
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  &:not(:last-child)::after {
    content: "";
    position: absolute;
    left: 14px;
    right: 14px;
    bottom: 0;
    height: 1px;
    background-color: ${theme.colors.gray[50]};
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

const CustomDropdownSearch = ({
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
  const [searchText, setSearchText] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClick = () => {
    if (!disabled && !readOnly) {
      setIsOpen(!isOpen);
      if (!isOpen && inputRef.current) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleSelect = (item: { key: string; value: string }) => {
    if (readOnly || disabled) return;

    if (multiple) {
      const newSelectedKeys = selectedKeys.includes(item.key)
        ? selectedKeys.filter((k) => k !== item.key)
        : [...selectedKeys, item.key];
      onMultiSelectKeys?.(newSelectedKeys);
      setSearchText("");
      setIsOpen(false);
    } else {
      onSelectKey?.(item.key);
      setSearchText("");
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

  // 선택된 항목의 값을 표시하기 위한 함수
  const getDisplayText = () => {
    if (multiple) {
      return "";
    } else {
      const selectedItem = items.find((item) => item.key === selectedKey);
      return selectedItem ? selectedItem.value : "";
    }
  };

  // 검색어에 따라 필터링된 항목 목록
  const filteredItems = items.filter((item) =>
    item.value.toLowerCase().includes(searchText.toLowerCase()),
  );

  // 컴포넌트가 마운트될 때 선택된 값으로 검색 텍스트 초기화
  useEffect(() => {
    if (!multiple && selectedKey) {
      const selectedItem = items.find((item) => item.key === selectedKey);
      if (selectedItem) {
        setSearchText(selectedItem.value);
      }
    }
  }, [selectedKey, items, multiple]);

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
          style={{
            cursor: readOnly ? "default" : disabled ? "default" : "pointer",
          }}
        >
          <SearchInput
            ref={inputRef}
            value={searchText}
            onChange={handleInputChange}
            placeholder={placeholder}
            disabled={disabled || readOnly}
            $size={size}
            $disabled={disabled}
            onClick={(e) => e.stopPropagation()}
          />
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

        {isOpen && !disabled && !readOnly && (
          <List>
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <ListItem
                  key={index}
                  onClick={() => handleSelect(item)}
                  $size={size}
                >
                  {multiple && (
                    <CheckboxContainer
                      $selected={isItemSelected(item)}
                      $size={size}
                    >
                      <CheckIcon
                        color={"white"}
                        width={size === "small" ? 12 : 16}
                        height={size === "small" ? 12 : 16}
                      />
                    </CheckboxContainer>
                  )}
                  {item.value}
                </ListItem>
              ))
            ) : (
              <ListItem $size={size}>검색 결과가 없습니다</ListItem>
            )}
          </List>
        )}
      </ListContainer>

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

export default CustomDropdownSearch;
