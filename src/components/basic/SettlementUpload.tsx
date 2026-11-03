import CustomTable, {
  Column,
} from "@/components/basic/custom-table/CustomTable";
import { DataCollectionName, FileType } from "@/types/upload";
import { useEffect, useRef, useState } from "react";

import ButtonOutlinedPrimary from "./buttons/ButtonOutlinedPrimary";
import DownloadIcon from "@/components/icons/DownloadIcon";
import { FileInfo } from "@/types/file-info";
import TrashIcon from "@/components/icons/TrashIcon";
import UploadIcon from "@/components/icons/UploadIcon";
import { getFullUrl } from "@/constants/api";
import styled from "styled-components";
import theme from "@/styles/theme";
import toast from "react-hot-toast";
import { useUploadStore } from "@/stores/use-upload-store";

const Container = styled.div``;

// 드래그 앤 드롭 영역 스타일 추가
const DropZone = styled.div<{ $isDragging: boolean; $readOnly: boolean }>`
  width: 100%;
  height: 144px;
  border: 1.5px dashed
    ${({ $isDragging }) =>
      $isDragging ? theme.colors.purple[600] : theme.colors.gray[50]};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  transition: border-color 0.3s ease;
  background-color: ${({ $isDragging }) =>
    $isDragging ? theme.colors.purple[50] : theme.colors.white};
  gap: 8px;
  cursor: ${({ $readOnly }) => ($readOnly ? "default" : "pointer")};
`;

const DropZoneText = styled.p`
  ${theme.fonts.label1.medium}
  color: ${theme.colors.purple[600]};
  text-align: center;
`;

// Controller에서 사용할 props 타입 정의
interface CustomUploadProps {
  onChange: (files: FileInfo[]) => void;
  value: FileInfo[];
  fileType: FileType;
  dataCollectionName: DataCollectionName;
  headerText: string;
  readOnly?: boolean;
  onUploadComplete?: () => void;
}

const SettlementUpload = ({
  onChange,
  value,
  fileType,
  dataCollectionName,
  readOnly = false,
  onUploadComplete,
}: CustomUploadProps) => {
  // 파일 입력을 위한 ref와 상태 추가
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileInfo[]>(value || []);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { uploadToS3 } = useUploadStore();

  // 상태가 변경될 때 onChange 호출
  useEffect(() => {
    if (onChange && JSON.stringify(selectedFiles) !== JSON.stringify(value)) {
      onChange(selectedFiles);
    }
  }, [selectedFiles, onChange, value]);

  // 파일 확장자 검증 함수 추가
  const validateFileType = (file: File): boolean => {
    const allowedExtensions = [".xlsx", ".csv"];
    const fileName = file.name.toLowerCase();
    const fileExtension = fileName.substring(fileName.lastIndexOf("."));

    if (!allowedExtensions.includes(fileExtension)) {
      toast.error("xlsx 또는 csv 파일만 업로드 가능합니다.");
      return false;
    }
    return true;
  };

  // 파일 업로드 핸들러 수정
  const handleUpload = async (file: File) => {
    if (readOnly) return;

    // 파일 타입 검증 추가
    if (!validateFileType(file)) return false;

    try {
      setIsLoading(true);
      const success = await uploadToS3({
        file: file,
        fileType: fileType,
        dataCollectionName: dataCollectionName,
      });

      if (success) {
        // toast.success(`${file.name} 업로드가 완료되었습니다.`);
        // FileInfo 형식으로 변환
        const fileInfo: FileInfo = {
          name: success.name,
          filePath: success.filePath,
        };
        setSelectedFiles((prev) => [...prev, fileInfo]);

        // 업로드 완료 콜백 호출
        onUploadComplete?.();

        return true;
      }
      return false;
    } catch (err) {
      toast.error(`${file.name} 업로드 중 오류가 발생했습니다.`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 파일 선택 핸들러
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // 선택된 각 파일을 즉시 업로드
      for (let i = 0; i < files.length; i++) {
        await handleUpload(files[i]);
      }
      // 파일 선택 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // 버튼 클릭 핸들러
  const handleButtonClick = () => {
    if (readOnly) return;

    fileInputRef.current?.click();
  };

  // 드래그 앤 드롭 핸들러
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (readOnly) return;

    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (readOnly) return;

    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    if (readOnly) return;

    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      // 드롭된 각 파일을 즉시 업로드
      for (let i = 0; i < files.length; i++) {
        await handleUpload(files[i]);
      }
    }
  };

  // 파일 삭제 핸들러 수정
  const handleRemoveFile = (index: number) => {
    if (readOnly) return;

    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // 파일 다운로드 핸들러 추가
  const handleDownloadFile = (file: FileInfo) => {
    // 파일 다운로드 로직 구현
    window.open(getFullUrl(file.filePath), "_blank");
  };

  // 테이블 컬럼 정의
  const columns: Column<FileInfo & { index: number; size: string }>[] = [
    {
      header: "NO",
      accessor: "index",
      width: 60,
      align: "center",
      type: "string",
    },
    {
      header: "파일명",
      accessor: "name",
      width: 300,
      align: "left",
      type: "string",
    },
    {
      header: "파일크기",
      accessor: "size",
      width: 100,
      align: "right",
      type: "string",
    },
    {
      header: "다운로드",
      accessor: "filePath",
      width: 80,
      align: "center",
      type: "button",
      icon: <DownloadIcon />,
      onClick: (record) => handleDownloadFile(record),
    },
  ];

  // 삭제 버튼은 readOnly가 아닐 때만 추가
  if (!readOnly) {
    columns.push({
      header: "삭제",
      accessor: "name",
      width: 80,
      align: "center",
      type: "button",
      icon: <TrashIcon />,
      onClick: (record, rowIndex) => handleRemoveFile(rowIndex),
    });
  }

  // 테이블 데이터 준비
  const tableData = selectedFiles.map((file, index) => ({
    ...file,
    index: index + 1,
    size: "1MB", // 실제 파일 크기 정보가 없으므로 임시 값 사용
  }));

  return (
    <Container>
      <ButtonOutlinedPrimary
        label={isLoading ? "업로드 중" : "정산서 업로드"}
        leftIcon={<UploadIcon />}
        size="medium"
        onClick={handleButtonClick}
        disabled={isLoading}
      />

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        multiple
        accept=".xlsx,.csv"
      />
    </Container>
  );
};

export default SettlementUpload;
