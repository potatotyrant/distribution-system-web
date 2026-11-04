import SettlementSearchTypeDropdown, {
  SettlementSearchType,
} from "./fragment/SettlementSearchType";
import { useEffect, useState } from "react";

import CustomMonthCalendar from "@/components/basic/CustomMonthCalendar";
import Gap from "@/components/basic/Gap";
import { GetSettlementSummariesRequest } from "@/api/settlement/get-settlement-summaries";
import SearchInput from "@/components/SearchInput";
import styled from "styled-components";
import theme from "@/styles/theme";
import toast from "react-hot-toast";
import { useSettlementStore } from "@/stores/use-settlement-store";

const Container = styled.div``;

const RowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  align-items: center;
`;

const DateLabel = styled.div`
  ${theme.fonts.body1.medium};
  color: ${theme.colors.gray[600]};
`;

const DateDash = styled.div`
  height: 1.5px;
  width: 16px;
  background-color: ${theme.colors.gray[500]};
  border-radius: 2px;
`;

export default function SettlementSearch() {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<SettlementSearchType>("all");
  const [searchValue, setSearchValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { fetchSettlementSummaries, reset } = useSettlementStore();

  // 컴포넌트 마운트 시 검색 폼 초기화
  useEffect(() => {
    setStartDate(null);
    setEndDate(null);
    setSelectedType("all");
    setSearchValue("");
    reset(); // store 데이터도 초기화
  }, [reset]);

  const handleSearch = async () => {
    setIsLoading(true);

    // 전체검색 시 특정 필드들로 한정
    const getAllSearchFields = () => {
      return [
        "albumTitle", // 앨범명
        "trackTitle", // 트랙명
        "artistList.name", // 아티스트명
        "userDisplayName,agencyCompanyName", // 권리자명(이름/기획사)
      ].join(",");
    };

    const __searchFields =
      selectedType === "all" ? getAllSearchFields() : selectedType;
    const __searchKeyword = searchValue;

    const params: GetSettlementSummariesRequest = {
      __searchFields,
      __searchKeyword,
      __skip: 0,
      __limit: 10000,
      __sortOption: "settlementMonthASC",
    };

    // 기간이 입력되었을 때만 기간 파라미터 추가
    if (startDate && endDate) {
      params.__kstSettlementStartMonth = startDate;
      params.__kstSettlementEndMonth = endDate;
    }

    await fetchSettlementSummaries(params);
    setIsLoading(false);
  };

  return (
    <Container>
      <DateLabel>기간 검색</DateLabel>
      <Gap height={8} />
      <RowWrapper>
        <CustomMonthCalendar
          value={startDate}
          onChange={(date) => setStartDate(date)}
          size="normal"
        />
        <DateDash />
        <CustomMonthCalendar
          value={endDate}
          onChange={(date) => setEndDate(date)}
          size="normal"
        />
      </RowWrapper>
      <Gap height={12} />
      <RowWrapper>
        <SettlementSearchTypeDropdown
          selectedType={selectedType}
          setSelectedType={setSelectedType}
        />
        <SearchInput
          placeholder="앨범명, 트랙명, 아티스트명, 권리자명"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onClickSearch={handleSearch}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          isLoading={isLoading}
        />
      </RowWrapper>
    </Container>
  );
}
