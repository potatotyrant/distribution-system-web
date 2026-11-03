import Album, {
  AlbumTransferHistory,
  ArtistInfo,
  TitleLanguage,
} from "@/types/album";
import CustomTable, {
  Column,
} from "@/components/basic/custom-table/CustomTable";
import { useCallback, useEffect, useRef, useState } from "react";

import { User } from "@/types/user";
import moment from "moment";
import styled from "styled-components";
import theme from "@/styles/theme";
import { useAlbumStore } from "@/stores/use-album-store";
import { useRouter } from "next/navigation";
import { useTrackStore } from "@/stores/use-track-store";

const Container = styled.div``;

const RenderText = styled.div`
  ${theme.fonts.body1.medium};
  color: ${theme.colors.gray[800]};
`;

const RenderLinkText = styled.div`
  ${theme.fonts.body1.medium};
  text-decoration: none;
  cursor: pointer;
`;

export default function AlbumList() {
  const {
    albums,
    fetchAlbums,
    searchAlbums,
    isLoading,
    hasMore,
    currentPage,
    searchParams,
  } = useAlbumStore();
  const { resetTracks } = useTrackStore();
  const router = useRouter();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);
  const columns: Column<Album>[] = [
    {
      header: "번호",
      accessor: "_id" as keyof Album,
      type: "string",
      width: 80,
      align: "center",
      render: (value, row, index) => {
        return <RenderText>{(index ?? 0) + 1}</RenderText>;
      },
    },
    // {
    //   header: "앨범 코드",
    //   accessor: "albumUniqueId",
    //   type: "string",
    //   width: 140,
    //   align: "center",
    // },
    {
      header: "앨범명",
      accessor: "titleList",
      type: "string",
      width: 103,
      align: "center",
      render: (value, row, index) => {
        const titleList = (value as TitleLanguage[] | null) ?? [];

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
        return <RenderText>{userInfo?.displayName}</RenderText>;
      },
    },
    {
      header: "레이블(기획사)",
      accessor: "agencyCompanyName",
      type: "string",
      width: 120,
      align: "center",
    },
    {
      header: "DDEX 전송",
      accessor: "albumTransferHistoryList",
      type: "string",
      width: 180,
      align: "center",
      render: (value, row, index) => {
        const historyList = value as AlbumTransferHistory[] | undefined;

        if (!historyList || historyList.length === 0) {
          return <RenderText>-</RenderText>;
        }

        // 최신 전송 이력 가져오기 (createdAt 기준 정렬)
        const latestHistory = [...historyList].sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        })[0];

        // 상태 한글 변환
        const stateText =
          latestHistory.state === "PENDING"
            ? "대기중"
            : latestHistory.state === "COMPLETED"
            ? "완료"
            : latestHistory.state === "FAILED"
            ? "실패"
            : latestHistory.state;

        // 날짜 포맷팅
        const formattedDate = moment(latestHistory.startedAt)
          .utcOffset(9)
          .format("YYYY. MM. DD HH:mm");

        return (
          <RenderText>
            {stateText}
            <br />
            {formattedDate}
          </RenderText>
        );
      },
    },
  ];

  // 무한 스크롤을 위한 추가 데이터 로드 함수
  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) {
      return;
    }

    const nextPage = currentPage + 1;

    if (searchParams) {
      // 검색 중인 경우
      await searchAlbums(searchParams, nextPage, false);
    } else {
      // 일반 조회인 경우
      await fetchAlbums(nextPage, false);
    }
  }, [
    isLoading,
    hasMore,
    currentPage,
    searchParams,
    fetchAlbums,
    searchAlbums,
  ]);

  // Intersection Observer 설정
  useEffect(() => {
    // 기존 observer 정리
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    // hasMore가 false이면 observer 생성하지 않음
    if (!hasMore) {
      return;
    }

    // DOM 렌더링 후 observer 생성
    const timeoutId = setTimeout(() => {
      if (!loadMoreRef.current) {
        return;
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (
            entries[0].isIntersecting &&
            hasMore &&
            !isLoading &&
            (searchParams ? albums.length >= 1000 : albums.length >= 100)
          ) {
            loadMore();
          }
        },
        {
          threshold: 0.1,
          rootMargin: "50px",
        },
      );

      observerRef.current.observe(loadMoreRef.current);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [hasMore, isLoading, loadMore, albums.length, searchParams]);

  // 초기 데이터 로드
  useEffect(() => {
    // 컴포넌트 마운트 시에만 초기 로드
    if (!hasInitialLoad && !searchParams) {
      setHasInitialLoad(true);
      fetchAlbums(1, true);
    }
  }, [hasInitialLoad, searchParams, fetchAlbums]);

  const handleClickAlbumItem = (record: Album) => {
    resetTracks();
    router.push(`/content/album/list/${record._id}`);
  };

  return (
    <Container>
      {/* 검색 결과가 없을 때 */}
      {searchParams && !isLoading && albums.length === 0 && (
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
      {!searchParams && hasInitialLoad && !isLoading && albums.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: theme.colors.gray[500],
            fontSize: "16px",
          }}
        >
          등록된 앨범이 없습니다.
        </div>
      )}

      {/* 데이터가 있을 때만 테이블 표시 */}
      {albums.length > 0 && (
        <>
          <CustomTable
            columns={columns}
            data={albums}
            onClick={handleClickAlbumItem}
          />

          {/* 무한 스크롤 트리거 */}
          {hasMore &&
            (searchParams ? albums.length >= 1000 : albums.length >= 100) && (
              <div
                ref={loadMoreRef}
                style={{ height: "20px", margin: "20px 0" }}
              >
                {isLoading && (
                  <div style={{ textAlign: "center", padding: "20px" }}>
                    로딩 중...
                  </div>
                )}
              </div>
            )}

          {/* 더 이상 로드할 데이터가 없을 때 */}
          {!hasMore && albums.length > 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                color: theme.colors.gray[500],
              }}
            >
              모든 앨범을 불러왔습니다.
            </div>
          )}
        </>
      )}
    </Container>
  );
}
