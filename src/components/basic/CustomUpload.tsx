import CustomTable, {
  Column,
} from "@/components/basic/custom-table/CustomTable";
import { DataCollectionName, FileType } from "@/types/upload";
import { useEffect, useRef, useState } from "react";

import ButtonOutlinedSecondary from "@/components/basic/buttons/ButtonOutlinedSecondary";
import DownloadIcon from "@/components/icons/DownloadIcon";
import { FileInfo } from "@/types/file-info";
import Gap from "@/components/basic/Gap";
import TrashIcon from "@/components/icons/TrashIcon";
import UploadIcon from "@/components/icons/UploadIcon";
import { getFullUrl } from "@/constants/api";
import styled from "styled-components";
import theme from "@/styles/theme";
import toast from "react-hot-toast";
import { useUploadStore } from "@/stores/use-upload-store";

const Container = styled.div``;

const Header = styled.div`
  ${theme.fonts.body2.medium}
  color: ${theme.colors.gray[600]};
  display: flex;
  align-items: center;
  gap: 4px;
`;

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
  required?: boolean;
}

const CustomUpload = ({
  onChange,
  value,
  fileType,
  dataCollectionName,
  headerText = "계약서",
  readOnly = false,
  required = false,
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

  // 파일 업로드 핸들러 추가
  const handleUpload = async (file: File) => {
    if (readOnly) return;

    // USER_CONTRACTS인 경우 PDF 파일만 허용
    if (dataCollectionName === DataCollectionName.USER_CONTRACTS) {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      if (fileExtension !== "pdf") {
        toast.error("계약서는 PDF 파일만 업로드 가능합니다.");
        return false;
      }
    }

    try {
      setIsLoading(true);
      const success = await uploadToS3({
        file: file,
        fileType: fileType,
        dataCollectionName: dataCollectionName,
      });

      if (success) {
        toast.success(`${file.name} 업로드가 완료되었습니다.`);
        // FileInfo 형식으로 변환
        const fileInfo: FileInfo = {
          name: success.name,
          filePath: success.filePath,
        };
        setSelectedFiles((prev) => [...prev, fileInfo]);
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
      // USER_CONTRACTS인 경우 PDF 파일만 필터링
      let filesToUpload = Array.from(files);

      if (dataCollectionName === DataCollectionName.USER_CONTRACTS) {
        const nonPdfFiles = filesToUpload.filter((file) => {
          const fileExtension = file.name.split(".").pop()?.toLowerCase();
          return fileExtension !== "pdf";
        });

        if (nonPdfFiles.length > 0) {
          toast.error("계약서는 PDF 파일만 업로드 가능합니다.");
          filesToUpload = filesToUpload.filter((file) => {
            const fileExtension = file.name.split(".").pop()?.toLowerCase();
            return fileExtension === "pdf";
          });
        }
      }

      // 선택된 각 파일을 즉시 업로드
      for (let i = 0; i < filesToUpload.length; i++) {
        await handleUpload(filesToUpload[i]);
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
      // USER_CONTRACTS인 경우 PDF 파일만 필터링
      let filesToUpload = Array.from(files);

      if (dataCollectionName === DataCollectionName.USER_CONTRACTS) {
        const nonPdfFiles = filesToUpload.filter((file) => {
          const fileExtension = file.name.split(".").pop()?.toLowerCase();
          return fileExtension !== "pdf";
        });

        if (nonPdfFiles.length > 0) {
          toast.error("계약서는 PDF 파일만 업로드 가능합니다.");
          filesToUpload = filesToUpload.filter((file) => {
            const fileExtension = file.name.split(".").pop()?.toLowerCase();
            return fileExtension === "pdf";
          });
        }
      }

      // 드롭된 각 파일을 즉시 업로드
      for (let i = 0; i < filesToUpload.length; i++) {
        await handleUpload(filesToUpload[i]);
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
      <Header>
        {headerText}
        {required && <span style={{ color: "red" }}>*</span>}
      </Header>
      <Gap height={16} />
      {!readOnly && (
        <ButtonOutlinedSecondary
          label={isLoading ? "업로드 중" : "파일 업로드"}
          leftIcon={<UploadIcon />}
          size="medium"
          onClick={handleButtonClick}
          disabled={isLoading}
        />
      )}
      {/* 숨겨진 파일 입력 요소 - multiple 속성 추가 */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        multiple
        accept={
          dataCollectionName === DataCollectionName.USER_CONTRACTS
            ? ".pdf"
            : undefined
        }
      />

      {/* 드래그 앤 드롭 영역 추가 */}
      {!readOnly && (
        <DropZone
          $isDragging={isDragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          $readOnly={readOnly}
        >
          <UploadIcon color={theme.colors.purple[600]} />
          <DropZoneText>
            {isLoading
              ? "업로드 중..."
              : dataCollectionName === DataCollectionName.USER_CONTRACTS
              ? "PDF 파일을 끌어놓아 주세요."
              : fileType === FileType.IMAGES
              ? "이미지를 끌어놓아 주세요."
              : "파일을 끌어놓아 주세요."}
          </DropZoneText>
        </DropZone>
      )}
      {/* 선택된 파일 목록을 CustomTable로 표시 */}
      {selectedFiles.length > 0 && (
        <CustomTable columns={columns} data={tableData} size="small" />
      )}
    </Container>
  );
};

export default CustomUpload;
