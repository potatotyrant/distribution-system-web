import CustomTable, {
  Column,
} from "@/components/basic/custom-table/CustomTable";

import ArrowDownIcon from "@/components/icons/ArrowDownIcon";
import ArrowUpIcon from "@/components/icons/ArrowUpIcon";
import { AuthLevel } from "@/types/user";
import { SettlementSummary } from "@/types/settlement-summary";
import moment from "moment";
import styled from "styled-components";
import theme from "@/styles/theme";
import { useAuthStore } from "@/stores/use-auth-store";
import { useSettlementStore } from "@/stores/use-settlement-store";
import { useState } from "react";

const Container = styled.div``;

const DetailButton = styled.button<{ $isExpanded: boolean }>`
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

  &:hover {
    background-color: ${({ $isExpanded }) =>
      $isExpanded ? theme.colors.purple[50] : theme.colors.gray[50]};
  }
`;

const ArrowIcon = styled.span`
  font-size: 12px;
  color: #6a6a6a;
`;

const ExpandedContent = styled.div`
  padding: 20px;
  background-color: #fafafa;
  border-top: 1px solid #eaeaea;
`;

const ExpandedTitle = styled.h4`
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
`;

const ServiceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ServiceItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: white;
  border: 1px solid #eaeaea;
  border-radius: 2px;
`;

const ServiceName = styled.span`
  font-weight: 600;
  color: #1a1a1a;
  min-width: 120px;
`;

const ServiceAmounts = styled.div`
  display: flex;
  gap: 24px;
`;

const AmountItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AmountLabel = styled.span`
  font-size: 14px;
  color: #6a6a6a;
`;

const AmountValue = styled.span`
  font-weight: 600;
  color: #1a1a1a;
`;

const ExpandedRow = styled.div`
  background-color: #fafafa;
  border-top: 1px solid #eaeaea;
`;

export default function SettlementList() {
  const { settlementSummaries } = useSettlementStore();
  const user = useAuthStore((state) => state.user);

  const columns: Column<SettlementSummary>[] = [
    {
      header: "권리자명",
      accessor: "userDisplayName",
      type: "string",
      align: "center",
    },
    {
      header: "기간",
      accessor: "settlementStartMonth",
      type: "string",
      align: "center",
      render: (value, record) => {
        const startMonth = record.settlementStartMonth;
        const endMonth = record.settlementEndMonth;
        const startYear = Math.floor(startMonth / 100);
        const startMonthNum = startMonth % 100;
        const endYear = Math.floor(endMonth / 100);
        const endMonthNum = endMonth % 100;
        return `${startYear}.${startMonthNum
          .toString()
          .padStart(2, "0")} ~ ${endYear}.${endMonthNum
          .toString()
          .padStart(2, "0")}`;
      },
    },
    {
      header: "서비스 매출",
      accessor: "settlementFee",
      type: "string",
      align: "center",
      render: (value) => {
        const _value = value as number | null;
        return (_value ?? 0).toLocaleString();
      },
    },
    {
      header: "정산금",
      accessor: "userSettlementFee",
      type: "string",
      align: "center",
      render: (value) => {
        const _value = value as number | null;
        return (_value ?? 0).toLocaleString();
      },
    },
  ];

  const renderExpandedContent = (summary: SettlementSummary) => {
    const isAdmin = user?.authLevel === AuthLevel.ADMIN;

    return (
      <ExpandedContent>
        <ExpandedTitle>플랫폼별 상세 내역</ExpandedTitle>
        <ServiceList>
          {(summary.serviceList ?? []).map((service, index) => (
            <ServiceItem key={index}>
              <ServiceName>{service.service}</ServiceName>
              <ServiceAmounts>
                <AmountItem>
                  <AmountLabel>판매금액:</AmountLabel>
                  <AmountValue>
                    {(service.settlementFee ?? 0).toLocaleString()}
                  </AmountValue>
                </AmountItem>
                {isAdmin && (
                  <AmountItem>
                    <AmountLabel>유통수수료:</AmountLabel>
                    <AmountValue>
                      {(service.distributionFee ?? 0).toLocaleString()}
                    </AmountValue>
                  </AmountItem>
                )}
                <AmountItem>
                  <AmountLabel>정산금:</AmountLabel>
                  <AmountValue>
                    {(service.userSettlementFee ?? 0).toLocaleString()}
                  </AmountValue>
                </AmountItem>
              </ServiceAmounts>
            </ServiceItem>
          ))}
        </ServiceList>
      </ExpandedContent>
    );
  };

  return (
    <Container>
      <CustomTable
        columns={columns}
        data={settlementSummaries}
        expandable={{
          expandedRowRender: renderExpandedContent,
          expandColumnWidth: 50,
        }}
      />
    </Container>
  );
}
