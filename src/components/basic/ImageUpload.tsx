import CustomTable, {
  Column,
} from "@/components/basic/custom-table/CustomTable";
import { DataCollectionName, FileType } from "@/types/upload";
import { useEffect, useRef, useState } from "react";

import ButtonOutlinedSecondary from "@/components/basic/buttons/ButtonOutlinedSecondary";
import DownloadIcon from "@/components/icons/DownloadIcon";
import { FileInfo } from "@/types/file-info";
import Gap from "@/components/basic/Gap";
import { ImageInfo } from "@/types/album";
import TrashIcon from "@/components/icons/TrashIcon";
import UploadIcon from "@/components/icons/UploadIcon";
import { getFullUrl } from "@/constants/api";
import styled from "styled-components";
import theme from "@/styles/theme";
import toast from "react-hot-toast";
import { useUploadStore } from "@/stores/use-upload-store";

const Container = styled.div<{ $width: string }>`
  width: ${({ $width }) => $width};
`;

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
interface ImageUploadProps {
  onChange: (files: ImageInfo[]) => void;
  value: ImageInfo[];
  fileType: FileType;
  dataCollectionName: DataCollectionName;
  headerText: string;
  readOnly?: boolean;
  width?: string;
  required?: boolean;
}

const ImageUpload = ({
  onChange,
  value,
  fileType,
  dataCollectionName,
  headerText = "계약서",
  readOnly = false,
  width = "100%",
  required = false,
}: ImageUploadProps) => {
  // 파일 입력을 위한 ref와 상태 추가
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<ImageInfo[]>(value || []);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { uploadToS3 } = useUploadStore();

  // value가 외부에서 변경될 때만 selectedFiles 업데이트
  useEffect(() => {
    if (value && JSON.stringify(selectedFiles) !== JSON.stringify(value)) {
      setSelectedFiles(value);
    }
  }, [value]);

  // 파일 업로드 핸들러 추가
  const handleUpload = async (file: File) => {
    if (readOnly) return;

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
        const fileInfo: ImageInfo = {
          name: success.name,
          imageOriginalPath: success.filePath,
        };
        const updatedFiles = [...selectedFiles, fileInfo];
        setSelectedFiles(updatedFiles);
        onChange(updatedFiles); // 여기서 직접 onChange 호출
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

    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    onChange(updatedFiles); // 여기서 직접 onChange 호출
  };

  // 파일 다운로드 핸들러 추가
  const handleDownloadFile = (file: FileInfo) => {
    // 파일 다운로드 로직 구현
    window.open(getFullUrl(file.filePath), "_blank");
  };

  return (
    <Container $width={width}>
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
        accept={fileType === FileType.IMAGES ? "image/*" : undefined}
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
              : fileType === FileType.IMAGES
              ? "이미지를 끌어놓아 주세요."
              : "파일을 끌어놓아 주세요."}
          </DropZoneText>
        </DropZone>
      )}
      {/* 선택된 이미지 목록을 이미지로 표시 */}
      {selectedFiles.length > 0 && (
        <ImageGrid>
          {selectedFiles.map((file, index) => (
            <ImageItem key={index}>
              <ImageContainer>
                <StyledImage
                  src={getFullUrl(file.imageOriginalPath)}
                  alt={file.name}
                />
                <ImageActions>
                  {/* <IconButton onClick={() => handleDownloadFile(file)}>
                    <DownloadIcon color={theme.colors.white} />
                  </IconButton> */}
                  {!readOnly && (
                    <IconButton onClick={() => handleRemoveFile(index)}>
                      <TrashIcon color={theme.colors.white} />
                    </IconButton>
                  )}
                </ImageActions>
              </ImageContainer>
              <ImageName>{file.name}</ImageName>
            </ImageItem>
          ))}
        </ImageGrid>
      )}
    </Container>
  );
};

const ImageGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 16px;
`;

const ImageItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 64px;
  height: 64px;
  border-radius: 4px;
  overflow: hidden;

  &:hover {
    .image-actions {
      opacity: 1;
    }
  }
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ImageActions = styled.div.attrs({ className: "image-actions" })`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
`;

const IconButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ImageName = styled.p`
  ${theme.fonts.caption1.medium}
  color: ${theme.colors.gray[800]};
  width: 64px;
  text-align: center;
  word-break: break-word;
`;

export default ImageUpload;
