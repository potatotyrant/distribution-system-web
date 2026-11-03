import React, { useState } from "react";

import CustomDropdown from "../CustomDropdown";
import CustomInput from "../CustomInput";
import ExpandButton from "./components/ExpandButton";
import styled from "styled-components";
import theme from "@/styles/theme";

export interface Column<T> {
  header: string;
  accessor: keyof T;
  width?: number;
  align?: "left" | "center" | "right";
  type: "string" | "input" | "dropdown" | "component" | "button";
  render?: (
    value: T[keyof T] | null,
    record: T,
    rowIndex?: number,
  ) => React.ReactNode;
  renderHeader?: () => React.ReactNode;
  dropdownOptions?: { key: string; value: string }[];
  icon?: React.ReactNode;
  onClick?: (record: T, rowIndex: number) => void;
}

interface CustomTableProps<T> {
  columns: Column<T>[];
  data: T[];
  size?: "small" | "normal";
  expandable?: {
    expandedRowRender: (record: T, index?: number) => React.ReactNode;
    // expandColumn?: number; // 추후 버튼 위치 정할 때 사용, 구현되어있지 않음. 지금은 맨 뒤에 위치
    expandColumnWidth?: number;
  };
  onChange?: (value: T[]) => void;
  disabled?: boolean;
  readOnly?: boolean;
  onClick?: (record: T) => void;
}

const TableContainer = styled.div`
  width: 100%;
  border: 1px solid ${theme.colors.gray[50]};
  border-radius: 2px;
  overflow: visible;
  background: ${theme.colors.white};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${theme.colors.white};
  table-layout: fixed;
`;

const TableHeader = styled.thead`
  background: ${theme.colors.white};
  border-bottom: 1px solid ${theme.colors.gray[50]};
`;

const HeaderCell = styled.th<{
  $width?: number;
  $align?: "left" | "center" | "right";
  $size?: "small" | "normal";
}>`
  font-family: var(--font-pretendard), Pretendard, sans-serif;
  font-weight: 500;
  letter-spacing: -0.01em;
  text-transform: none;
  font-size: 10px;
  line-height: 1.4;
  color: ${theme.colors.gray[400]};
  padding: ${({ $size }) => ($size === "small" ? "12px" : "16px")} 24px;
  text-align: ${({ $align }) => $align || "center"};
  width: ${({ $width }) => ($width ? `${$width}px` : "auto")};
  min-width: ${({ $width }) => ($width ? `${$width}px` : "auto")};
  max-width: ${({ $width }) => ($width ? `${$width}px` : "auto")};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr<{ $isExpanded?: boolean; $clickable?: boolean }>`
  border-bottom: 1px solid ${theme.colors.gray[50]};
  background: ${({ $isExpanded }) =>
    $isExpanded ? theme.colors.gray[25] : theme.colors.white};
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};

  &:hover {
    background: ${({ $isExpanded }) =>
      $isExpanded ? theme.colors.gray[25] : theme.colors.gray[25]};
  }
`;

const TableCell = styled.td<{
  $align?: "left" | "center" | "right";
  $size?: "small" | "normal";
  $width?: number;
}>`
  ${({ $size }) =>
    $size === "small" ? theme.fonts.body2.medium : theme.fonts.body1.medium}
  color: ${theme.colors.gray[800]};
  padding: ${({ $size }) => ($size === "small" ? "6px 12px" : "22px 20px")};
  text-align: ${({ $align }) => $align || "left"};
  width: ${({ $width }) => ($width ? `${$width}px` : "auto")};
  min-width: ${({ $width }) => ($width ? `${$width}px` : "auto")};
  max-width: ${({ $width }) => ($width ? `${$width}px` : "auto")};
  overflow: visible;
`;

const ExpandedContent = styled.tr`
  background: ${theme.colors.white};
`;

const ExpandedCell = styled.td``;

const Button = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const Text = styled.div<{ $size?: "small" | "normal" }>`
  ${({ $size }) =>
    $size === "small" ? theme.fonts.body2.medium : theme.fonts.body1.medium};
  color: ${theme.colors.gray[800]};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%;
`;

const RenderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTable = <T extends Record<string, any>>({
  columns,
  data,
  size = "normal",
  expandable,
  onChange,
  disabled = false,
  readOnly = false,
  onClick,
}: CustomTableProps<T>) => {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  // columns나 data가 undefined이거나 배열이 아닌 경우를 처리
  const safeColumns = Array.isArray(columns) ? columns : [];
  const safeData = Array.isArray(data) ? data : [];

  const toggleRow = (rowIndex: number) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(rowIndex)) {
      newExpandedRows.delete(rowIndex);
    } else {
      newExpandedRows.add(rowIndex);
    }
    setExpandedRows(newExpandedRows);
  };

  const handleInputChange = (
    rowIndex: number,
    accessor: keyof T,
    value: string,
  ) => {
    if (!onChange) return;

    const newData = [...data];
    newData[rowIndex] = {
      ...newData[rowIndex],
      [accessor]: value,
    };

    onChange(newData);
  };

  const handleDropdownChange = (
    rowIndex: number,
    accessor: keyof T,
    selectedKey: string,
  ) => {
    if (!onChange) return;

    const newData = [...data];
    newData[rowIndex] = {
      ...newData[rowIndex],
      [accessor]: selectedKey,
    };

    onChange(newData);
  };

  const renderCellContent = (column: Column<T>, row: T, rowIndex: number) => {
    // row가 null이거나 undefined인 경우 처리
    if (!row) return null;

    // value가 null이거나 undefined인 경우를 안전하게 처리
    const value = row[column.accessor] ?? null;

    if (column.render) {
      return (
        <RenderContainer>{column.render(value, row, rowIndex)}</RenderContainer>
      );
    }

    switch (column.type) {
      case "input":
        return (
          <CustomInput
            value={(value as string) || ""}
            onChange={(e) =>
              handleInputChange(rowIndex, column.accessor, e.target.value)
            }
            size={size}
            width={(column.width || 150) - 24}
            disabled={disabled}
            readOnly={readOnly}
          />
        );
      case "dropdown":
        return (
          <CustomDropdown
            selectedKey={value as string}
            onSelectKey={(selectedKey) =>
              handleDropdownChange(
                rowIndex,
                column.accessor,
                selectedKey as string,
              )
            }
            items={column.dropdownOptions || []}
            size={size}
            width={(column.width || 150) - 24}
            disabled={disabled}
            placeholder="선택"
            readOnly={readOnly}
          />
        );
      case "button":
        if (readOnly || disabled) return;
        return (
          <Button
            onClick={() => column.onClick?.(row, rowIndex)}
            disabled={disabled}
          >
            {column.icon}
          </Button>
        );
      default:
        return <Text $size={size}>{value}</Text>;
    }
  };

  return (
    <TableContainer>
      <Table>
        <TableHeader>
          <tr>
            {safeColumns.map((column, index) => (
              <HeaderCell
                key={index}
                $width={column.width}
                $align={column.align}
                $size={size}
              >
                {column.renderHeader ? column.renderHeader() : column.header}
              </HeaderCell>
            ))}
            {expandable && (
              <HeaderCell $width={expandable.expandColumnWidth ?? 40} />
            )}
          </tr>
        </TableHeader>
        <TableBody>
          {safeData.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              <TableRow
                $isExpanded={expandedRows.has(rowIndex)}
                $clickable={!!onClick}
                onClick={() => onClick?.(row)}
              >
                {safeColumns.map((column, colIndex) => (
                  <TableCell
                    key={colIndex}
                    $align={column.align}
                    $size={size}
                    $width={column.width}
                  >
                    {renderCellContent(column, row, rowIndex)}
                  </TableCell>
                ))}
                {expandable && (
                  <TableCell
                    $size={size}
                    style={{
                      width: expandable.expandColumnWidth ?? 40,
                      padding: "0 8px",
                    }}
                  >
                    <ExpandButton
                      isExpanded={expandedRows.has(rowIndex)}
                      onClick={() => toggleRow(rowIndex)}
                    />
                  </TableCell>
                )}
              </TableRow>
              {expandable && expandedRows.has(rowIndex) && (
                <ExpandedContent>
                  <ExpandedCell colSpan={safeColumns.length + 1}>
                    {expandable.expandedRowRender(row, rowIndex)}
                  </ExpandedCell>
                </ExpandedContent>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomTable;
