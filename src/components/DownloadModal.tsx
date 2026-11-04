import ButtonOutlinedPrimary from "./basic/buttons/ButtonOutlinedPrimary";
import DownloadIcon from "./icons/DownloadIcon";
import Gap from "./basic/Gap";
import Modal from "react-modal";
import XIcon from "./icons/XIcon";
import styled from "styled-components";
import theme from "@/styles/theme";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 423px;
  /* position: relative; */
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const Content = styled.div`
  ${theme.fonts.heading2.medium};
  color: ${theme.colors.gray[800]};
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  gap: 12px;
`;

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "2px",
    padding: "16px 20px",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};

interface CustomModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onClickExcel: () => void;
  onClickCsv: () => void;
}

const DownloadModal = ({
  isOpen,
  onRequestClose,
  onClickExcel,
  onClickCsv,
}: CustomModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      ariaHideApp={false}
    >
      <Container>
        <CloseButton onClick={onRequestClose}>
          <XIcon />
        </CloseButton>
        <Content>다운로드 방식을 선택해주세요.</Content>
        <Gap height={32} />
        <ButtonContainer>
          <ButtonOutlinedPrimary
            label="Excel 다운로드"
            onClick={onClickExcel}
            leftIcon={<DownloadIcon />}
            expand
          />
          <ButtonOutlinedPrimary
            label="CSV 다운로드"
            onClick={onClickCsv}
            leftIcon={<DownloadIcon />}
            expand
          />
        </ButtonContainer>
      </Container>
    </Modal>
  );
};

export default DownloadModal;
