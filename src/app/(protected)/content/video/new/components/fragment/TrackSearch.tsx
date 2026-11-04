import { ArtistInfo, TitleLanguage } from "@/types/album";
import CustomTable, {
  Column,
} from "@/components/basic/custom-table/CustomTable";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import Video, { TrackInfo } from "@/types/video";
import { useEffect, useState } from "react";

import Gap from "@/components/basic/Gap";
import SearchIcon from "@/components/icons/SearchIcon";
import Track from "@/types/track";
import TrackSearchModal from "@/components/TrackSearchModal";
import TrashIcon from "@/components/icons/TrashIcon";
import moment from "moment";
import styled from "styled-components";
import theme from "@/styles/theme";
import { useTrackStore } from "@/stores/use-track-store";

const Container = styled.div``;

const Label = styled.div`
  ${theme.fonts.body2.medium}
  color: ${theme.colors.gray[600]};
`;

const SearchButton = styled.div`
  width: 320px;
  height: 42px;
  border-radius: 2px;
  padding-left: 12px;
  padding-right: 8px;
  border: 1px solid ${theme.colors.gray[50]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;

const SearchButtonText = styled.span`
  ${theme.fonts.body2.regular}
  color: ${theme.colors.gray[300]};
`;

export default function TrackSearch({
  value,
  onChange,
  readOnly = false,
  placeholder,
  label,
  modalHeader,
  setValue,
  watch,
}: {
  value: string[] | null;
  onChange: (value: string[] | null) => void;
  readOnly?: boolean;
  placeholder?: string;
  label?: string;
  modalHeader?: string;
  setValue: UseFormSetValue<Video>;
  watch: UseFormWatch<Video>;
}) {
  const { fetchTrack } = useTrackStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // watch("trackList")를 TrackInfo[]로 명시적 캐스팅
  const trackList: TrackInfo[] = (watch("trackList") as TrackInfo[]) || [];

  // watch를 사용하여 trackIdList 가져오기 (string 배열)
  const trackIdList: string[] = watch("trackIdList") || [];

  // trackIdList에 있는 ID와 trackList에 없는 트랙을 가져와서 추가하는 로직
  useEffect(() => {
    const fetchMissingTracks = async () => {
      if (!trackIdList || trackIdList.length === 0) {
        setValue("trackList", []);
        return;
      }

      // 현재 trackList에 없는 트랙 ID 찾기
      const missingTrackIds = trackIdList.filter(
        (trackId) => !trackList.some((track) => track?.trackId === trackId),
      );

      if (missingTrackIds.length === 0) return;

      // 누락된 트랙 가져오기
      const fetchedTracks = await Promise.all(
        missingTrackIds.map(async (trackId) => await fetchTrack(trackId)),
      );

      // null이나 undefined가 아닌 값만 필터링
      const validTracks: TrackInfo[] = fetchedTracks
        .filter(
          (track): track is Track => track !== null && track !== undefined,
        )
        .map((track) => track as TrackInfo);

      // 기존 trackList에 validTracks를 합치기 전에, 기존 항목에 trackId가 없다면 _id로 채워줌
      const normalizedExisting = trackList.map((t) =>
        t.trackId ? t : { ...t, trackId: t.trackId || "" },
      );

      // validTracks도 마찬가지로 trackId가 없다면 _id로 채워줍니다.
      const normalizedNew = validTracks.map((t) =>
        t.trackId ? t : { ...t, trackId: t.trackId || "" },
      );

      // 최종 업데이트: 기존 trackList와 새 트랙 합치기
      setValue("trackList", [...normalizedExisting, ...normalizedNew]);
    };

    fetchMissingTracks();
  }, [JSON.stringify(trackIdList), fetchTrack, setValue]);
  // trackIdList를 안정적으로 비교하기 위해 JSON.stringify 사용

  const columns: Column<Track>[] = [
    // {
    //   header: "트랙 코드",
    //   accessor: "trackUniqueId",
    //   type: "string",
    //   width: 140,
    //   align: "center",
    // },
    {
      header: "트랙명",
      accessor: "titleList",
      type: "string",
      width: 337,
      align: "center",
      render: (value, record) => {
        const _value = value as TitleLanguage[];
        return _value?.[0]?.ko || "";
      },
    },
    {
      header: "아티스트명",
      accessor: "releaseArtistList",
      type: "string",
      width: 160,
      align: "center",
      render: (value, record) => {
        const _value = value as ArtistInfo[];
        return _value?.[0]?.name || "";
      },
    },
    {
      header: "발매일",
      accessor: "utcReleasedAt",
      type: "string",
      width: 120,
      align: "center",
      render: (value, record) => {
        const _value = value as Date;
        return _value ? moment(_value).format("YYYY-MM-DD") : "";
      },
    },
    {
      header: "",
      accessor: "action" as keyof Track,
      type: "button",
      width: 50,
      icon: <TrashIcon />,
      onClick: (record, rowIndex) => {
        const newTrackIdList = value
          ? value.filter((trackId) => trackId !== record._id)
          : null;
        onChange(newTrackIdList);
        setValue("trackIdList", newTrackIdList || []);
      },
    },
  ];

  const handleRegisterTrack = (track: Track) => {
    const newTrackIdList = value
      ? [...value, track._id || ""]
      : [track._id || ""];
    onChange(newTrackIdList);
    setValue("trackIdList", newTrackIdList);
  };

  return (
    <Container>
      <Label>{label}</Label>
      <Gap height={8} />
      {!readOnly && (
        <>
          <SearchButton onClick={() => setIsModalOpen(true)}>
            <SearchButtonText>{placeholder || " "}</SearchButtonText>
            <SearchIcon width={18} height={18} />
          </SearchButton>
          <TrackSearchModal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            header={modalHeader}
            onChange={onChange}
            value={value}
            onRegister={handleRegisterTrack}
          />
        </>
      )}
      <Gap height={20} />
      <CustomTable
        columns={columns}
        data={trackList as Track[]}
        size="small"
        readOnly={readOnly}
      />
    </Container>
  );
}
