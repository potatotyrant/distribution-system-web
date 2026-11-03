import { createJSONStorage, persist } from "zustand/middleware";

import { EditTrack } from "@/app/(protected)/content/album/new/components/TrackSection";
import Track from "@/types/track";
import { create } from "zustand";
import { deleteTrack } from "@/api/track/delete-track";
import { getTrack } from "@/api/track/get-track";
import { getTracks } from "@/api/track/get-tracks";
import { postTrack } from "@/api/track/post-track";
import { putTrack } from "@/api/track/put-track";
import { searchTracks } from "@/api/track/search-tracks";
import toast from "react-hot-toast";

interface TrackStore {
  tracks: Track[];
  edittingTracks: EditTrack[];
  isLoading: boolean;
  error: string | null;

  fetchTrack: (trackId: string) => Promise<Track | null>;
  fetchTracks: (albumId: string) => Promise<void>;
  createTrack: (track: Track) => Promise<void>;
  updateTrack: (track: Track) => Promise<void>;
  deleteTrack: (trackId: string) => Promise<void>;
  searchTracks: (
    searchKeyword: string,
    searchFields?: string,
  ) => Promise<Track[]>;
  resetTracks: () => void;
  setEdittingTracks: (
    tracks: EditTrack[] | ((prev: EditTrack[]) => EditTrack[]),
  ) => void;
  sortTracks: (tracksToSort: EditTrack[]) => EditTrack[];
  resetEdittingTracks: () => void;
  validateTrackForSettlement: (track: Track) => boolean;
}

export const useTrackStore = create<TrackStore>()(
  persist(
    (set, get) => ({
      tracks: [],
      edittingTracks: [],
      isLoading: false,
      error: null,

      fetchTrack: async (trackId: string) => {
        set({ isLoading: true });
        try {
          const response = await getTrack({ trackId });

          if (!response || response.error || !response.data) {
            throw new Error(response.message);
          }

          const track = response.data.track;
          // 발매국가가 없는 경우 기본값으로 대한민국 설정
          return {
            ...track,
            releaseCountryCode: track.releaseCountryCode || "KR",
          };
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "트랙 조회 중 알 수 없는 오류가 발생했습니다.";

          toast.error(errorMessage);

          console.error(
            "[useTrackStore/fetchTrack] Fetch track failed.",
            error,
          );

          return null;
        } finally {
          set({ isLoading: false });
        }
      },
      fetchTracks: async (albumId: string) => {
        set({ isLoading: true });
        try {
          const response = await getTracks({ albumId });

          if (!response || response.error || !response.data) {
            throw new Error(response.message);
          }

          // 발매국가가 없는 경우 기본값으로 대한민국 설정
          const fetchedTracks = (response.data.trackList ?? []).map((track) => ({
            ...track,
            releaseCountryCode: track.releaseCountryCode || "KR",
          }));

          set({
            tracks: fetchedTracks,
            edittingTracks: get().sortTracks(fetchedTracks),
            error: null,
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "트랙 조회 중 알 수 없는 오류가 발생했습니다.";

          toast.error(errorMessage);

          console.error(
            "[useTrackStore/fetchTracks] Fetch tracks failed.",
            error,
          );

          set({ tracks: [], error: errorMessage });
        } finally {
          set({ isLoading: false });
        }
      },
      createTrack: async (track: Track) => {
        set({ isLoading: true });
        try {
          // 정산 필수값 검증
          if (!get().validateTrackForSettlement(track)) {
            throw new Error(
              "정산에 필요한 필수값이 누락되었습니다. (ISRC, userId, userContractId, albumId)",
            );
          }

          // 서버에서 자동 생성하므로 trackUniqueId 제거
          const { trackUniqueId, ...trackWithoutCode } = track;

          const response = await postTrack({ trackList: [trackWithoutCode] });

          if (!response || response.error || !response.data) {
            throw new Error(response.message);
          }

          if (response.data.trackList.length === 0) {
            throw new Error("트랙 생성 중 알 수 없는 오류가 발생했습니다.");
          }

          set((state) => ({
            tracks: [...state.tracks, response.data!.trackList[0]],
            error: null,
          }));

          // toast.success("트랙이 생성되었습니다."); // 개별 알림 제거
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "트랙 생성 중 알 수 없는 오류가 발생했습니다.";

          toast.error(errorMessage);

          console.error("[useTrackStore/postTrack] Post track failed.", error);
        } finally {
          set({ isLoading: false });
        }
      },
      updateTrack: async (track: Track) => {
        set({ isLoading: true });
        try {
          if (!track.albumId) {
            throw new Error("앨범 ID가 없습니다.");
          }

          // 정산 필수값 검증
          if (!get().validateTrackForSettlement(track)) {
            throw new Error(
              "정산에 필요한 필수값이 누락되었습니다. (ISRC, userId, userContractId, albumId)",
            );
          }

          // 서버에서 자동 생성하므로 trackUniqueId 제거 (수정 시에는 기존 값 유지 가능하지만 일관성을 위해 제거)
          const { trackUniqueId, ...trackWithoutCode } = track;

          const response = await putTrack({ track: trackWithoutCode as Track });

          if (!response || response.error || !response.data) {
            throw new Error(response.message);
          }

          const fetchResponse = await getTracks({
            albumId: track.albumId,
          });

          if (!fetchResponse || fetchResponse.error || !fetchResponse.data) {
            throw new Error(fetchResponse.message);
          }

          set((state) => ({
            tracks: fetchResponse.data!.trackList,
            error: null,
          }));

          // toast.success("트랙이 수정되었습니다."); // 개별 알림 제거
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "트랙 수정 중 알 수 없는 오류가 발생했습니다.";

          toast.error(errorMessage);

          console.error(
            "[useTrackStore/updateTrack] Update track failed.",
            error,
          );
        } finally {
          set({ isLoading: false });
        }
      },
      deleteTrack: async (trackId: string) => {
        set({ isLoading: true });
        try {
          const response = await deleteTrack({ trackId });

          if (!response || response.error || !response.data) {
            throw new Error(response.message);
          }

          set((state) => ({
            tracks: state.tracks.filter((track) => track._id !== trackId),
            error: null,
          }));

          toast.success("트랙이 삭제되었습니다.");
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "트랙 삭제 중 알 수 없는 오류가 발생했습니다.";

          toast.error(errorMessage);

          console.error(
            "[useTrackStore/deleteTrack] Delete track failed.",
            error,
          );
        } finally {
          set({ isLoading: false });
        }
      },
      searchTracks: async (searchKeyword: string, searchFields?: string) => {
        set({ isLoading: true });
        try {
          const __searchKeyword = searchKeyword;
          const __searchFields = searchFields;

          const response = await searchTracks({
            __searchKeyword,
            __searchFields,
          });

          if (!response || response.error || !response.data) {
            throw new Error(response.message);
          }

          set({
            error: null,
          });

          return response.data!.trackList;
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "트랙 검색 중 알 수 없는 오류가 발생했습니다.";

          toast.error(errorMessage);

          console.error(
            "[useTrackStore/searchTracks] Search tracks failed.",
            error,
          );
          set({ error: errorMessage });
          return [];
        } finally {
          set({ isLoading: false });
        }
      },
      resetTracks: () => {
        set({ tracks: [], edittingTracks: [] });
      },
      setEdittingTracks: (
        tracks: EditTrack[] | ((prev: EditTrack[]) => EditTrack[]),
      ) => {
        set((state) => ({
          edittingTracks:
            typeof tracks === "function"
              ? tracks(state.edittingTracks)
              : tracks,
        }));
      },
      sortTracks: (tracksToSort: EditTrack[]) => {
        return [...tracksToSort].sort((a, b) => {
          const aHasTrackNumber =
            a.trackNumber !== undefined && a.trackNumber !== null;
          const bHasTrackNumber =
            b.trackNumber !== undefined && b.trackNumber !== null;

          // 둘 다 트랙번호가 있거나 없는 경우
          if (aHasTrackNumber === bHasTrackNumber) {
            if (aHasTrackNumber && bHasTrackNumber) {
              // 트랙번호 오름차순 정렬
              return a.trackNumber! - b.trackNumber!;
            } else {
              // 둘 다 없으면 생성일(createdAt) 기준 오름차순 정렬
              const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
              const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
              return aDate - bDate;
            }
          }
          // 트랙번호가 있는 항목을 앞으로
          return aHasTrackNumber ? -1 : 1;
        });
      },
      resetEdittingTracks: () => {
        set({ edittingTracks: [] });
      },
      validateTrackForSettlement: (track: Track) => {
        // 정산에 필요한 필수값 검증: ISRC, userId, userContractId, albumId
        return !!(
          track.ISRC &&
          track.userId &&
          track.userContractId &&
          track.albumId
        );
      },
    }),
    {
      name: "track-store",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
