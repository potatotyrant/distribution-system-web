import { Controller, useForm } from "react-hook-form";

import AddNew from "@/components/AddNew";
import ButtonFilledPrimary from "@/components/basic/buttons/ButtonFilledPrimary";
import ButtonOutlinedSecondary from "@/components/basic/buttons/ButtonOutlinedSecondary";
import CustomToggle from "@/components/basic/CustomToggle";
import type DspContract from "@/types/dsp-contract";
import DspContractInput from "./fragment/DspContractInput";
import Gap from "@/components/basic/Gap";
import ReactModal from "react-modal";
import styled from "styled-components";
import theme from "@/styles/theme";
import { useDspContractStore } from "@/stores/use-dsp-contract-store";
import { useState } from "react";

const AddNewWrapper = styled.div`
  cursor: pointer;
`;

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

const VisibleWrapper = styled.div`
  display: flex;
  gap: 24px;
`;

const RowWrapper = styled.div`
  display: flex;
  gap: 120px;
`;

const VisibleLabel = styled.div`
  ${theme.fonts.title2.medium}
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const AddNewDspContract = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { createDspContract } = useDspContractStore();
  const defaultFormValues: Partial<DspContract> = {
    dspContractName: "",
    dspContractUniqueId: "",
    regionType: "domestic" as const,
    countryCode: "",
    isTimeReleaseEnabled: true,
    contactPersonList: [
      {
        name: null,
        responsibility: null,
        email: null,
        phone: null,
      },
    ],
    fileList: [],
    contractItemList: [],
    contractRate: undefined,
    isContractEnabled: true,
    dspId: "",
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isValid, isDirty },
    watch,
  } = useForm<DspContract>({
    defaultValues: defaultFormValues,
    mode: "onChange",
    shouldFocusError: false,
  });

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    reset(defaultFormValues);
  };

  const onSubmit = async (data: DspContract) => {
    await createDspContract(data);
    reset(defaultFormValues);
    handleClose();
  };

  const isSubmitDisabled = () => {
    // 계약명 체크
    if (!watch("dspContractName") || watch("dspContractName").trim() === "") {
      return true;
    }

    // DSP 선택 체크
    if (!watch("dspId")) {
      return true;
    }

    // DPID 체크
    if (
      !watch("dspContractUniqueId") ||
      watch("dspContractUniqueId").trim() === ""
    ) {
      return true;
    }

    // 계약 요율 체크
    if (watch("contractRate") === undefined || watch("contractRate") === null) {
      return true;
    }

    return false;
  };

  const customStyles = {
    content: {
      top: "77px",
      left: "188px",
      right: "188px",
      bottom: "77px",
      transform: "none",
      margin: "0 auto",
      width: "auto",
      maxWidth: "1065px",
      padding: "56px 64px",
      borderRadius: "2px",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 1000,
    },
  };

  return (
    <>
      <AddNewWrapper onClick={handleOpen}>
        <AddNew />
      </AddNewWrapper>

      <ReactModal
        isOpen={isOpen}
        onRequestClose={handleClose}
        style={customStyles}
        ariaHideApp={false}
      >
        <ModalHeader>
          DSP 계약 등록
          <ButtonWrapper>
            <ButtonOutlinedSecondary label="취소" onClick={handleClose} />
            <ButtonFilledPrimary
              label="등록"
              onClick={() => onSubmit(watch())}
              disabled={isSubmitDisabled()}
            />
          </ButtonWrapper>
        </ModalHeader>
        <Gap height={48} />

        <VisibleWrapper>
          <VisibleLabel>계약 정보</VisibleLabel>
          <Controller
            name="isContractEnabled"
            control={control}
            render={({ field }) => (
              <CustomToggle
                checked={field.value}
                onChange={field.onChange}
                label=""
              />
            )}
          />
        </VisibleWrapper>
        <DspContractInput
          watch={watch}
          register={register}
          control={control}
          isEdit={true}
        />
      </ReactModal>
    </>
  );
};

export default AddNewDspContract;
