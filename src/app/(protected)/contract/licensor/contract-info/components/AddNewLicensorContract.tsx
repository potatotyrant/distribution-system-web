import { AuthLevel, User } from "@/types/user";
import { Controller, useForm } from "react-hook-form";

import AddNew from "@/components/AddNew";
import ButtonFilledPrimary from "@/components/basic/buttons/ButtonFilledPrimary";
import ButtonOutlinedSecondary from "@/components/basic/buttons/ButtonOutlinedSecondary";
import ButtonSpinner from "@/components/ButtonSpinner";
import CustomToggle from "@/components/basic/CustomToggle";
import Gap from "@/components/basic/Gap";
import LicensorContractInput from "./fragment/LicensorContractInput";
import LicensorInput from "../../list/components/fragment/LicnsorInput";
import ReactModal from "react-modal";
import UserContract from "@/types/user-contract";
import styled from "styled-components";
import theme from "@/styles/theme";
import { useState } from "react";
import { useUserContractStore } from "@/stores/use-user-contract-store";
import { useUserStore } from "@/stores/use-user-store";

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

const AddNewLicensorContract = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { createUserContract, isLoading } = useUserContractStore();
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isValid, isDirty },
    watch,
  } = useForm<UserContract>({
    defaultValues: {
      userContractName: undefined,
      userContractUniqueId: undefined,
      userId: undefined,
      userContractType: "GENERAL",
      userContractBusinessType: "INDIVIDUAL",
      isContractAutoRenewEnabled: false,
      isContractEnabled: true,
      kstContractStartDateInt: undefined,
      kstContractEndDateInt: undefined,
      contractRate: undefined,
      dspContractList: [],
      fileList: [],
      userInfo: {
        _id: undefined,
        account: undefined,
        displayName: undefined,
      },
    },
    mode: "onChange",
    shouldFocusError: false,
  });

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  const onSubmit = async (data: UserContract) => {
    await createUserContract(data);
    handleClose();
  };

  const isSubmitDisabled = () => {
    // 계약명 체크
    if (!watch("userContractName") || watch("userContractName").trim() === "") {
      return true;
    }

    // 계약 코드 체크
    if (
      !watch("userContractUniqueId") ||
      watch("userContractUniqueId").trim() === ""
    ) {
      return true;
    }

    // 권리자 선택 체크
    if (!watch("userId")) {
      return true;
    }

    // 계약 시작일 체크
    if (!watch("kstContractStartDateInt")) {
      return true;
    }

    // 계약 종료일 체크
    if (!watch("kstContractEndDateInt")) {
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
          권리자 계약 등록
          <ButtonWrapper>
            <ButtonOutlinedSecondary label="취소" onClick={handleClose} />
            {isLoading ? (
              <ButtonSpinner />
            ) : (
              <ButtonFilledPrimary
                label="등록"
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitDisabled()}
              />
            )}
          </ButtonWrapper>
        </ModalHeader>
        <Gap height={48} />

        <VisibleWrapper>
          <VisibleLabel>권리자 계약 정보</VisibleLabel>
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
        <LicensorContractInput
          watch={watch}
          register={register}
          control={control}
          isEdit={true}
        />
      </ReactModal>
    </>
  );
};

export default AddNewLicensorContract;
