import { STORAGE_URL, getFullUrl } from "@/constants/api";
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

import Album from "@/types/album";
import CustomCheckbox from "@/components/basic/CustomCheckbox";
import CustomChip from "@/components/basic/CustomChip";
import { Dsp } from "@/types/dsp";
import Gap from "@/components/basic/Gap";
import Image from "next/image";
import Video from "@/types/video";
import styled from "styled-components";
import theme from "@/styles/theme";
import { useState } from "react";

const Container = styled.div``;

const ChipContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const Label = styled.div`
  ${theme.fonts.body2.medium}
  color: ${theme.colors.gray[600]};
`;

const HelpText = styled.div`
  ${theme.fonts.body2.medium}
  padding-top: 12px;
`;

export default function VideoContractedDspList({
  watch,
  register,
  setValue,
  required = false,
}: {
  watch: UseFormWatch<Video>;
  register: UseFormRegister<Video>;
  setValue: UseFormSetValue<Video>;
  required?: boolean;
}) {
  const [isSelectedAll, setIsSelectedAll] = useState(false);
  const contractedDspContractList =
    watch("userContractInfo.dspContractList") || [];
  const dspContractIdList = watch("dspContractIdList") || [];

  const handleChipClick = (dsp: Dsp) => {
    if (dspContractIdList.includes(dsp._id)) {
      // 이미 선택된 경우 제거
      setValue(
        "dspContractIdList",
        dspContractIdList.filter((id) => id !== dsp._id),
      );
    } else {
      // 선택되지 않은 경우 추가
      setValue("dspContractIdList", [...dspContractIdList, dsp._id]);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setIsSelectedAll(checked);
    if (checked) {
      // 모든 DSP 선택
      const allDspIds = contractedDspContractList
        .map((contract) => contract.dspInfo?._id)
        .filter((id): id is string => !!id);
      setValue("dspContractIdList", allDspIds);
    } else {
      // 모든 선택 해제
      setValue("dspContractIdList", []);
    }
  };

  return (
    <Container>
      <Label>
        {required ? "계약된 DSP 리스트" : "계약된 DSP 리스트"}:{" "}
        {dspContractIdList.length}개 선택됨
        {required && <span style={{ color: "#d0313a" }}> *</span>}
      </Label>
      {!contractedDspContractList || contractedDspContractList.length === 0 ? (
        <HelpText>
          계약 정보를 선택하면 해당 계약의 dsp 리스트가 표시됩니다.
        </HelpText>
      ) : (
        <>
          <Gap height={8} />
          <CustomCheckbox
            label="전체 선택"
            checked={isSelectedAll}
            onChange={handleSelectAll}
          />
          <Gap height={8} />
        </>
      )}
      <ChipContainer>
        {contractedDspContractList &&
          contractedDspContractList.length > 0 &&
          contractedDspContractList.map((dspContract, index) => {
            const dsp = dspContract.dspInfo;
            if (!dsp) {
              return null;
            }

            const isSelected = dspContractIdList?.includes(dsp._id);

            return (
              <CustomChip
                key={dsp._id + index}
                label={dsp.name || ""}
                icon={
                  <Image
                    src={getFullUrl(dsp.image128Path || "")}
                    alt={dsp.name || ""}
                    width={24}
                    height={24}
                  />
                }
                onClick={() => handleChipClick(dsp)}
                isSelected={isSelected}
              />
            );
          })}
      </ChipContainer>
    </Container>
  );
}
