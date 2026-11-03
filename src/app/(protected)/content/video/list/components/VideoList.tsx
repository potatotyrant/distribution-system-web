import Album, { ArtistInfo, TitleLanguage } from "@/types/album";
import CustomTable, {
  Column,
} from "@/components/basic/custom-table/CustomTable";
import { useEffect, useState } from "react";

import { Artist } from "@/types/artist";
import Link from "next/link";
import { User } from "@/types/user";
import Video from "@/types/video";
import moment from "moment";
import styled from "styled-components";
import theme from "@/styles/theme";
import { useAlbumStore } from "@/stores/use-album-store";
import { useRouter } from "next/navigation";
import { useVideoStore } from "@/stores/use-video-store";

const Container = styled.div``;

const RenderText = styled.div`
  ${theme.fonts.body1.medium};
  color: ${theme.colors.gray[800]};
`;

const RenderLinkText = styled.div`
  ${theme.fonts.body1.medium};
  color: ${theme.colors.blue[600]};
  text-decoration: none;
  cursor: pointer;
`;

export default function VideoList() {
  const { videos, fetchVideos, isLoading, searchParams } = useVideoStore();
  const router = useRouter();
  const [hasInitialLoad, setHasInitialLoad] = useState(false);
  const columns: Column<Video>[] = [
    {
      header: "영상 코드",
      accessor: "videoUniqueId",
      type: "string",
      width: 140,
      align: "center",
    },
    {
      header: "영상명",
      accessor: "titleList",
      type: "string",
      width: 103,
      align: "center",
      render: (value, row, index) => {
        const titleList = (value as TitleLanguage[] | null) ?? [];
        const videoId = row._id;

        // 우선순위에 따라 앨범명 선택
        let title = "";

        const koTitle = titleList.find((item) => item.ko)?.ko;
        if (koTitle) return <RenderLinkText>{koTitle}</RenderLinkText>;

        const enTitle = titleList.find((item) => item.en)?.en;
        if (enTitle) return <RenderLinkText>{enTitle}</RenderLinkText>;

        // 5. 첫 번째 값 사용
        if (titleList.length > 0) {
          const firstItem = titleList[0];
          const firstKey = Object.keys(firstItem)[0] as keyof TitleLanguage;
          title = firstItem[firstKey] || "";
        }

        return <RenderLinkText>{title}</RenderLinkText>;
      },
    },
    {
      header: "트랙명",
      accessor: "trackList",
      type: "string",
      width: 103,
      align: "center",
      render: (value, row, index) => {
        const trackList =
          (value as { trackId: string; title: string }[] | null) ?? [];
        return (
          <RenderText>
            {trackList.length > 0 ? trackList[0].title : ""}
          </RenderText>
        );
      },
    },
    {
      header: "아티스트",
      accessor: "releaseArtistList",
      type: "string",
      width: 120,
      align: "center",
      render: (value, row, index) => {
        const artistList = (value as ArtistInfo[] | null) ?? [];
        return (
          <RenderText>
            {artistList.length > 0 ? artistList[0].name : ""}
          </RenderText>
        );
      },
    },
    {
      header: "발매일",
      accessor: "utcReleasedAt",
      type: "string",
      width: 132,
      align: "center",
      render: (value, row, index) => {
        const releasedAt = value as Date;
        return (
          <RenderText>
            {moment(releasedAt).utcOffset(9).format("YYYY. MM. DD")}
          </RenderText>
        );
      },
    },
    {
      header: "서비스 일시",
      accessor: "utcServiceStartedAt",
      type: "string",
      width: 132,
      align: "center",
      render: (value, row, index) => {
        const serviceStartedAt = value as Date;
        return (
          <RenderText>
            {moment(serviceStartedAt).utcOffset(9).format("YYYY. MM. DD HH:mm")}
          </RenderText>
        );
      },
    },
    {
      header: "권리자",
      accessor: "userInfo",
      type: "string",
      width: 120,
      align: "center",
      render: (value, row, index) => {
        const userInfo = value as User;
        return <RenderText>{userInfo.displayName}</RenderText>;
      },
    },
    {
      header: "레이블(기획사)",
      accessor: "agencyCompanyName",
      type: "string",
      width: 120,
      align: "center",
    },
  ];

  // 초기 데이터 로드
  useEffect(() => {
    if (!hasInitialLoad) {
      setHasInitialLoad(true);
      fetchVideos();
    }
  }, [hasInitialLoad, fetchVideos]);

  const handleClickVideoItem = (record: Video) => {
    router.push(`/content/video/list/${record._id}`);
  };

  return (
    <Container>
      {/* 검색 결과가 없을 때 */}
      {searchParams && !isLoading && videos.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: theme.colors.gray[500],
            fontSize: "16px",
          }}
        >
          검색 결과가 없습니다.
        </div>
      )}

      {/* 일반 조회 결과가 없을 때 (초기 로드 후에만 표시) */}
      {!searchParams && hasInitialLoad && !isLoading && videos.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: theme.colors.gray[500],
            fontSize: "16px",
          }}
        >
          등록된 영상이 없습니다.
        </div>
      )}

      {/* 데이터가 있을 때만 테이블 표시 */}
      {videos.length > 0 && (
        <CustomTable
          columns={columns}
          data={videos}
          onClick={handleClickVideoItem}
        />
      )}
    </Container>
  );
}
