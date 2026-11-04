import { ChangeEvent, useRef, useState } from "react";
import { DataCollectionName, FileType, urlList } from "@/types/upload";

import styled from "styled-components";
import theme from "@/styles/theme";
import toast from "react-hot-toast";
import { useUploadStore } from "@/stores/use-upload-store";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Button = styled.button`
  width: 200px;
  padding: 10px 20px;
  border-radius: 999px;
  background-color: #0a0a0a;
  color: #fafafa;
  border: 1px solid #3a3a3a;
  cursor: pointer;

  &:disabled {
    background-color: #3a3a3a;
    cursor: not-allowed;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileLabel = styled.label`
  width: 200px;
  padding: 10px 20px;
  border-radius: 2px;
  background-color: #fafafa;
  color: #1a1a1a;
  cursor: pointer;
  text-align: center;
  border: 1px dashed #cacaca;

  &:hover {
    background-color: #f6f6f6;
  }
`;

const SelectedFileName = styled.div`
  margin-top: 8px;
  font-size: 14px;
  color: #6a6a6a;
`;

const ErrorMessage = styled.div`
  color: ${theme.colors.red[500]};
  font-size: 14px;
  margin-top: 8px;
`;

const UploadSection = () => {
  const { isLoading, uploadToS3 } = useUploadStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const validateFile = (file: File): boolean => {
    // 파일 크기 제한 (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrorMessage("파일 크기는 5MB 이하여야 합니다.");
      return false;
    }

    // 이미지 파일 타입 검사
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

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      const success = await uploadToS3({
        file: selectedFile,
        fileType: FileType.IMAGES,
        dataCollectionName: DataCollectionName.DSPS,
      });

      if (success) {
        toast.success("파일 업로드가 완료되었습니다.");
        setUploadStatus("업로드 완료!");
      }
    } catch (err) {
      setErrorMessage("파일 업로드 중 오류가 발생했습니다.");
    }
  };

  return (
    <Container>
      <FileInput
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        id="fileInput"
      />
      <FileLabel htmlFor="fileInput">이미지 파일 선택</FileLabel>
      {selectedFile && (
        <SelectedFileName>선택된 파일: {selectedFile.name}</SelectedFileName>
      )}
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      <Button disabled={!selectedFile || isLoading} onClick={handleUpload}>
        {isLoading ? "업로드 중..." : "파일 업로드"}
      </Button>
      {uploadStatus && (
        <div style={{ color: "green", marginTop: "10px" }}>{uploadStatus}</div>
      )}
    </Container>
  );
};

export default UploadSection;
