import { Controller, useForm } from "react-hook-form";

import AddNew from "@/components/AddNew";
import { Artist } from "@/types/artist";
import ArtistInput from "./fragment/ArtistInput";
import ButtonFilledPrimary from "@/components/basic/buttons/ButtonFilledPrimary";
import ButtonOutlinedSecondary from "@/components/basic/buttons/ButtonOutlinedSecondary";
import ButtonSpinner from "@/components/ButtonSpinner";
import CustomInput from "@/components/basic/CustomInput";
import CustomToggle from "@/components/basic/CustomToggle";
import type DspContract from "@/types/dsp-contract";
import DspContractInput from "../../../contract/dsp/list/components/fragment/DspContractInput";
import Gap from "@/components/basic/Gap";
import ReactModal from "react-modal";
import styled from "styled-components";
import theme from "@/styles/theme";
import { useArtistStore } from "@/stores/use-artist-store";
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const AddNewArtist = ({
  size = "medium",
}: {
  size?: "medium" | "small" | "large";
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { createArtist, isLoading } = useArtistStore();
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isValid, isDirty },
    watch,
  } = useForm<Artist>({
    defaultValues: {
      name: undefined,
      nameEn: undefined,
      artistUniqueId: undefined,
      countryCode: undefined,
      genderType: undefined,
      artistType: undefined,
      snsLinkList: [],
    },
    mode: "onChange",
    shouldFocusError: false,
  });

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  const onSubmit = async (data: Artist) => {
    await createArtist(data);
    handleClose();
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

  const isDisabled = () => {
    const artist = watch();
    if (!artist.name || artist.name === "") return true;
    if (!artist.countryCode || artist.countryCode === "") return true;
    if (!artist.genderType) return true;
    if (!artist.artistType) return true;
    if (!artist.countryCode) return true;
    return false;
  };

  return (
    <>
      <AddNewWrapper onClick={handleOpen}>
        <AddNew size={size} />
      </AddNewWrapper>

      <ReactModal
        isOpen={isOpen}
        onRequestClose={handleClose}
        style={customStyles}
        ariaHideApp={false}
      >
        <ModalHeader>
          아티스트 신규 등록
          <ButtonWrapper>
            <ButtonOutlinedSecondary label="취소" onClick={handleClose} />
            {isLoading ? (
              <ButtonSpinner />
            ) : (
              <ButtonFilledPrimary
                label="등록"
                onClick={handleSubmit(onSubmit)}
                disabled={isDisabled()}
              />
            )}
          </ButtonWrapper>
        </ModalHeader>
        <Gap height={48} />

        <Form onSubmit={handleSubmit(onSubmit)}>
          <ArtistInput
            watch={watch}
            register={register}
            control={control}
            isEdit={true}
          />
        </Form>
      </ReactModal>
    </>
  );
};

export default AddNewArtist;
