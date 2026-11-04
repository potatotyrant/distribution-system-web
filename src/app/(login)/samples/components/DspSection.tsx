import { ChangeEvent, useRef, useState } from "react";
import { DataCollectionName, FileType } from "@/types/upload";

import { getFullUrl } from "@/constants/api";
import styled from "styled-components";
import theme from "@/styles/theme";
import toast from "react-hot-toast";
import { useDspStore } from "@/stores/use-dsp-store";
import { useEffect } from "react";
import { useUploadStore } from "@/stores/use-upload-store";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const DspWrapper = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid ${theme.colors.gray[300]};
  border-radius: 4px;
  width: 200px;
`;

const FileInput = styled.input`
  display: none;
`;

const FileLabel = styled.label`
  width: 200px;
  padding: 10px 20px;
  border-radius: 2px;
  background-color: ${theme.colors.gray[100]};
  color: ${theme.colors.gray[600]};
  cursor: pointer;
  text-align: center;
  border: 2px dashed ${theme.colors.gray[300]};

  &:hover {
    background-color: ${theme.colors.gray[300]};
  }
`;

const Button = styled.button`
  width: 200px;
  padding: 10px 20px;
  border-radius: 2px;
  background-color: ${theme.colors.black};
  color: ${theme.colors.white};
  cursor: pointer;

  &:disabled {
    background-color: ${theme.colors.gray[300]};
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: ${theme.colors.red[500]};
  font-size: 14px;
  margin-top: 8px;
`;

const SelectedFileName = styled.div`
  margin-top: 8px;
  font-size: 14px;
  color: ${theme.colors.gray[300]};
`;

const DeleteButton = styled.button`
  width: 100%;
  padding: 8px;
  background-color: ${theme.colors.red[500]};
  color: white;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  ${theme.fonts.body2.regular};

  &:hover {
    background-color: ${theme.colors.red[600]};
  }
`;

const DeleteConfirmPopup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const DeleteConfirmContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 2px;
  width: 300px;
  text-align: center;
`;

const DeleteConfirmButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
`;

const ConfirmButton = styled.button`
  padding: 8px 16px;
  background-color: ${theme.colors.red[500]};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const CancelButton = styled.button`
  padding: 8px 16px;
  background-color: ${theme.colors.gray[300]};
  color: black;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const DspItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid ${theme.colors.gray[300]};
  padding: 8px 16px 8px 12px;
  border-radius: 100px;
  user-select: none;
  touch-action: none;
`;

const DspContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DspImage = styled.img`
  width: 28px;
  height: 28px;
  object-fit: cover;
  border-radius: 50%;
`;

const DspInfo = styled.div`
  display: flex;
  flex-direction: column;
  ${theme.fonts.body2.medium};
`;

const DspSection = () => {
  const {
    dsps,
    isLoading: isDspLoading,
    error,
    fetchDsps,
    createDsp,
    deleteDsp,
  } = useDspStore();
  const { isLoading: isUploadLoading, uploadToS3 } = useUploadStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dspName, setDspName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [dspToDelete, setDspToDelete] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchDsps();
  }, [fetchDsps]);

  const validateFile = (file: File): boolean => {
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrorMessage("파일 크기는 5MB 이하여야 합니다.");
      return false;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage("JPG, PNG, GIF 형식의 이미지만 업로드 가능합니다.");
      return false;
    }

    setErrorMessage("");
    return true;
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleCreateDsp = async () => {
    if (!selectedFile || !dspName) return;

    try {
      const uploadResult = await uploadToS3({
        file: selectedFile,
        fileType: FileType.IMAGES,
        dataCollectionName: DataCollectionName.DSPS,
      });

      if (uploadResult?.filePath) {
        await createDsp({
          name: dspName,
          imageOriginalPath: uploadResult.filePath,
        });

        // 성공 후 초기화
        setDspName("");
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        toast.success("DSP가 성공적으로 생성되었습니다.");
      }
    } catch (err) {
      setErrorMessage("DSP 생성 중 오류가 발생했습니다.");
    }
  };

  const handleConfirmDelete = async () => {
    if (dspToDelete) {
      await deleteDsp({ dspId: dspToDelete });
      setShowDeleteConfirm(false);
      setDspToDelete(null);
      toast.success("DSP가 성공적으로 삭제되었습니다.");
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setDspToDelete(null);
  };

  return (
    <Container>
      <Input
        type="text"
        placeholder="DSP 이름 입력"
        value={dspName}
        onChange={(e) => setDspName(e.target.value)}
      />
      <FileInput
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        id="dspFileInput"
      />
      <FileLabel htmlFor="dspFileInput">DSP 이미지 선택</FileLabel>
      {selectedFile && (
        <SelectedFileName>선택된 파일: {selectedFile.name}</SelectedFileName>
      )}
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      <Button
        disabled={!selectedFile || !dspName || isUploadLoading || isDspLoading}
        onClick={handleCreateDsp}
      >
        {isUploadLoading || isDspLoading ? "처리 중..." : "DSP 생성"}
      </Button>

      <DspWrapper>
        {dsps.map((dsp) => (
          <div
            key={dsp._id}
            style={{ display: "flex", flexDirection: "column", gap: 8 }}
          >
            <DspItem key={dsp._id}>
              <DspContent>
                <DspImage
                  src={getFullUrl(dsp.imageOriginalPath)}
                  alt={dsp.name}
                />
                <DspInfo>
                  <div>{dsp.name}</div>
                </DspInfo>
              </DspContent>
            </DspItem>
            <DeleteButton
              onClick={() => {
                setDspToDelete(dsp._id);
                setShowDeleteConfirm(true);
              }}
            >
              삭제
            </DeleteButton>
          </div>
        ))}
      </DspWrapper>
      {showDeleteConfirm && (
        <DeleteConfirmPopup>
          <DeleteConfirmContent>
            <h3>DSP 삭제 확인</h3>
            <p>정말로 이 DSP를 삭제하시겠습니까?</p>
            <DeleteConfirmButtons>
              <ConfirmButton onClick={handleConfirmDelete}>확인</ConfirmButton>
              <CancelButton onClick={handleCancelDelete}>취소</CancelButton>
            </DeleteConfirmButtons>
          </DeleteConfirmContent>
        </DeleteConfirmPopup>
      )}
    </Container>
  );
};

export default DspSection;
