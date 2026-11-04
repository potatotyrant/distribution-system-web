import { useEffect, useState } from "react";

import ButtonFilledPrimary from "@/components/basic/buttons/ButtonFilledPrimary";
import ButtonOutlinedSecondary from "@/components/basic/buttons/ButtonOutlinedSecondary";
import ButtonSpinner from "@/components/ButtonSpinner";
import CustomTextArea from "@/components/basic/CustomTextArea";
import { EditTrack } from "../TrackSection";
import Gap from "@/components/basic/Gap";
import ReactModal from "react-modal";
import styled from "styled-components";
import theme from "@/styles/theme";
import { useTrackStore } from "@/stores/use-track-store";

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${theme.fonts.title1.medium}
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 16px;
`;

interface LyricsAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: EditTrack | null;
}

export default function LyricsAddModal({
  isOpen,
  onClose,
  track,
}: LyricsAddModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [lyrics, setLyrics] = useState("");

  useEffect(() => {
    if (isOpen && track && track.lyrics) {
      setLyrics(track.lyrics);
    } else if (isOpen) {
      setLyrics("");
    }
  }, [isOpen, track]);

  const customStyles = {
    content: {
      top: "77px",
      left: "158px",
      right: "158px",
      bottom: "77px",
      transform: "none",
      margin: "0 auto",
      width: "auto",
      maxWidth: "1000px",
      padding: "56px 64px",
      borderRadius: "2px",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 1000,
    },
  };

  const handleSubmit = async () => {
    if (!track) return;

    setIsLoading(true);
    try {
      // await updateTrack({
      //   ...track,
      //   lyrics: lyrics,
      // });
      track.lyrics = lyrics;
      onClose();
    } catch (error) {
      console.error("가사 저장 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!track) return null;

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      ariaHideApp={false}
    >
      <ModalHeader>
        {track && Array.isArray(track.titleList) && track.titleList.length > 0
          ? `${track.titleList[0].ko} - 가사 등록`
          : "가사 등록"}
        <ButtonWrapper>
          <ButtonOutlinedSecondary label="취소" onClick={onClose} />
          {isLoading ? (
            <ButtonSpinner />
          ) : (
            <ButtonFilledPrimary label="등록" onClick={handleSubmit} />
          )}
        </ButtonWrapper>
      </ModalHeader>
      <Gap height={48} />
      <CustomTextArea
        value={lyrics}
        onChange={(e) => setLyrics(e.target.value)}
        placeholder="가사를 입력해주세요."
        expand={true}
        height="580px"
      />
    </ReactModal>
  );
}
