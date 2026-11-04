import { Controller, useForm } from "react-hook-form";

import AddNew from "@/components/AddNew";
import Announcement from "@/types/announcement";
import AnnouncementInput from "./fragments/AnnouncementInput";
import ButtonFilledPrimary from "@/components/basic/buttons/ButtonFilledPrimary";
import ButtonOutlinedSecondary from "@/components/basic/buttons/ButtonOutlinedSecondary";
import ButtonSpinner from "@/components/ButtonSpinner";
import CustomToggle from "@/components/basic/CustomToggle";
import Gap from "@/components/basic/Gap";
import ReactModal from "react-modal";
import styled from "styled-components";
import theme from "@/styles/theme";
import { useAnnouncementStore } from "@/stores/use-announcement-store";
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

const RowWrapper = styled.div`
  display: flex;
  gap: 120px;
`;

const AddNewAnnouncement = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { createAnnouncement } = useAnnouncementStore();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isValid, isDirty },
    watch,
  } = useForm<Announcement>({
    defaultValues: {},
    mode: "onChange",
    shouldFocusError: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  const onSubmit = async (data: Announcement) => {
    setIsLoading(true);
    await createAnnouncement(data);
    handleClose();
    setIsLoading(false);
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

  const isDisabledConfirmButton = () => {
    const title = watch("title");
    const text = watch("text");
    const type = watch("type");
    const recipientResponsibility = watch("recipientResponsibility");
    if (
      !title ||
      !text ||
      text.length === 0 ||
      text === "<p><br></p>" ||
      !type ||
      !recipientResponsibility
    ) {
      return true;
    }
    return false;
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
          공지사항 작성
          <ButtonWrapper>
            <ButtonOutlinedSecondary
              label="취소"
              onClick={handleClose}
              disabled={isLoading}
            />
            {isLoading ? (
              <ButtonSpinner />
            ) : (
              <ButtonFilledPrimary
                label="등록"
                onClick={handleSubmit(onSubmit)}
                disabled={isDisabledConfirmButton()}
              />
            )}
          </ButtonWrapper>
        </ModalHeader>
        <Gap height={48} />
        <AnnouncementInput watch={watch} setValue={setValue} />
      </ReactModal>
    </>
  );
};

export default AddNewAnnouncement;
