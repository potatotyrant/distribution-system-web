import AlbumSearchTypeDropdown, {
  AlbumSearchType,
} from "./fragment/AlbumSearchType";

import ButtonOutlinedSecondary from "@/components/basic/buttons/ButtonOutlinedSecondary";
import CustomCalendar from "@/components/basic/CustomCalendar";
import Gap from "@/components/basic/Gap";
import SearchInput from "@/components/SearchInput";
import moment from "moment";
import styled from "styled-components";
import theme from "@/styles/theme";
import toast from "react-hot-toast";
import { useAlbumStore } from "@/stores/use-album-store";
import { useState } from "react";

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

export default function AlbumSearch() {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<AlbumSearchType>("all");
  const [searchValue, setSearchValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { searchAlbums, fetchAlbums, resetAlbums } = useAlbumStore();

  const handleSearch = async () => {
    setIsLoading(true);

    // 전체검색 시 특정 필드들로 한정
    const getAllSearchFields = () => {
      return [
        // "albumUniqueId", // 앨범코드
        "releaseArtistList.name", // 아티스트명
        "titleList.ko,titleList.en,titleList.ja,titleList.zh,titleList.zh-Hans,titleList.zh-Hant", // 앨범명
        "trackList.titleList.ko,trackList.titleList.en", // 트랙명
        "trackList.ISRC", // ISRC
        "UPC", // UPC
        "agencyCompanyName", // 기획사명
      ].join(",");
    };

    const __searchFields =
      selectedType === "all" ? getAllSearchFields() : selectedType;
    const __searchKeyword = searchValue;

    await searchAlbums(
      {
        __searchKeyword,
        __kstStartDate: startDate || undefined,
        __kstEndDate: endDate || undefined,
        __searchFields: __searchFields,
      },
      1,
      true,
    ); // 첫 페이지, 리셋

    setIsLoading(false);
  };

  const handleReset = async () => {
    setIsLoading(true);
    setStartDate(null);
    setEndDate(null);
    setSelectedType("all");
    setSearchValue("");

    // 검색 초기화 후 일반 조회로 돌아가기
    resetAlbums();
    await fetchAlbums(1, true);

    setIsLoading(false);
  };

  return (
    <Container>
      <DateLabel>발매일 검색</DateLabel>
      <Gap height={8} />
      <RowWrapper>
        <CustomCalendar
          size="normal"
          value={
            startDate && moment(startDate).isValid()
              ? moment(startDate).format("YYYYMMDD")
              : null
          }
          onChange={(date) => {
            if (date) {
              const m = moment(date, "YYYYMMDD");
              if (m.isValid()) {
                // 한국 시간(KST)으로 변환하여 YYYY-MM-DD 형식으로 저장
                const kstDate = m.format("YYYY-MM-DD");
                setStartDate(kstDate);
              } else {
                console.error("발매일 유효하지 않음:", date);
                setStartDate(null);
              }
            } else {
              setStartDate(null);
            }
          }}
        />
        <DateDash />
        <CustomCalendar
          size="normal"
          value={
            endDate && moment(endDate).isValid()
              ? moment(endDate).format("YYYYMMDD")
              : null
          }
          onChange={(date) => {
            if (date) {
              const m = moment(date, "YYYYMMDD");
              if (m.isValid()) {
                // 한국 시간(KST)으로 변환하여 YYYY-MM-DD 형식으로 저장
                const kstDate = m.format("YYYY-MM-DD");
                setEndDate(kstDate);
              } else {
                console.error("발매일 유효하지 않음:", date);
                setEndDate(null);
              }
            } else {
              setEndDate(null);
            }
          }}
        />
      </RowWrapper>
      <Gap height={12} />
      <RowWrapper>
        <AlbumSearchTypeDropdown
          selectedType={selectedType}
          setSelectedType={setSelectedType}
        />
        <SearchInput
          placeholder="아티스트명, 앨범명, 트랙명, UPC, ISRC, 레이블(기획사) 입력"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onClickSearch={handleSearch}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          isLoading={isLoading}
        />
        <ButtonOutlinedSecondary
          label="초기화"
          onClick={handleReset}
          disabled={isLoading}
        />
      </RowWrapper>
    </Container>
  );
}
