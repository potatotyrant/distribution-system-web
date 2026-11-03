import AmazonMusic from "./icons/streaming/AmazonMusic";
import AppleMusic from "./icons/streaming/AppleMusic";
import Bugs from "./icons/streaming/Bugs";
import CustomChip from "./basic/CustomChip";
import Flo from "./icons/streaming/Flo";
import Genie from "./icons/streaming/Genie";
import JOOX from "./icons/streaming/JOOX";
import KKBOX from "./icons/streaming/KKBOX";
import Melon from "./icons/streaming/Melon";
import Spotify from "./icons/streaming/Spotify";
import Vibe from "./icons/streaming/Vibe";
import YoutubeMusic from "./icons/streaming/YoutubeMusic";
import styled from "styled-components";
import { useState } from "react";

const Container = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;

  /* Chip gap was 4px. English names were mono; force Pretendard. */
  > div {
    gap: 12px;
    font-family: var(--font-pretendard), Pretendard, sans-serif;
    font-weight: 400;
    font-size: 14px;
    letter-spacing: -0.01em;
    line-height: 1.4;
    text-transform: none;
  }
`;

// DSP 타입 정의
export type DspType =
  | "ALL"
  | "Melon"
  | "Youtube Music"
  | "Spotify"
  | "Apple Music"
  | "Genie"
  | "Bugs"
  | "Flo"
  | "Vibe";

interface DspFilterChipProps {
  selectedDsps: DspType[];
  onFilterChange?: (selectedDsps: DspType[]) => void;
}

const DspFilterChip = ({
  onFilterChange,
  selectedDsps,
}: DspFilterChipProps) => {
  const handleChipClick = (dsp: DspType) => {
    let newSelectedDsps: DspType[];

    if (dsp === "ALL") {
      // ALL을 클릭하면 다른 모든 선택 해제하고 ALL만 선택
      newSelectedDsps = ["ALL"];
    } else {
      // ALL이 선택되어 있었다면 제거
      const withoutAll = selectedDsps.filter((item) => item !== "ALL");

      if (selectedDsps.includes(dsp)) {
        // 이미 선택된 DSP를 클릭하면 선택 해제
        newSelectedDsps = withoutAll.filter((item) => item !== dsp);
        // 모든 선택이 해제되면 ALL 자동 선택
        if (newSelectedDsps.length === 0) {
          newSelectedDsps = ["ALL"];
        }
      } else {
        // 새로운 DSP 선택 추가
        newSelectedDsps = [...withoutAll, dsp];
      }
    }

    onFilterChange?.(newSelectedDsps);
  };

  return (
    <Container>
      <CustomChip
        label="ALL"
        isSelected={selectedDsps.includes("ALL")}
        onClick={() => handleChipClick("ALL")}
      />
      <CustomChip
        label="Melon"
        icon={<Melon />}
        isSelected={selectedDsps.includes("Melon")}
        onClick={() => handleChipClick("Melon")}
      />
      <CustomChip
        label="Youtube Music"
        icon={<YoutubeMusic />}
        isSelected={selectedDsps.includes("Youtube Music")}
        onClick={() => handleChipClick("Youtube Music")}
      />
      <CustomChip
        label="Spotify"
        icon={<Spotify />}
        isSelected={selectedDsps.includes("Spotify")}
        onClick={() => handleChipClick("Spotify")}
      />
      <CustomChip
        label="Apple Music"
        icon={<AppleMusic />}
        isSelected={selectedDsps.includes("Apple Music")}
        onClick={() => handleChipClick("Apple Music")}
      />
      <CustomChip
        label="Genie"
        icon={<Genie />}
        isSelected={selectedDsps.includes("Genie")}
        onClick={() => handleChipClick("Genie")}
      />
      <CustomChip
        label="Bugs"
        icon={<Bugs />}
        isSelected={selectedDsps.includes("Bugs")}
        onClick={() => handleChipClick("Bugs")}
      />
      <CustomChip
        label="Flo"
        icon={<Flo />}
        isSelected={selectedDsps.includes("Flo")}
        onClick={() => handleChipClick("Flo")}
      />
      <CustomChip
        label="Vibe"
        icon={<Vibe />}
        isSelected={selectedDsps.includes("Vibe")}
        onClick={() => handleChipClick("Vibe")}
      />
    </Container>
  );
};

export default DspFilterChip;
