import CustomTable, {
  Column,
} from "@/components/basic/custom-table/CustomTable";

import AddNewArtist from "@/app/(protected)/content/artist/components/AddNewArtist";
import { Artist } from "@/types/artist";
import { ArtistInfo } from "@/types/album";
import ButtonFilledPrimary from "./basic/buttons/ButtonFilledPrimary";
import ButtonOutlinedSecondary from "./basic/buttons/ButtonOutlinedSecondary";
import { ClipLoader } from "react-spinners";
import Gap from "./basic/Gap";
import Modal from "react-modal";
import SearchInput from "./SearchInput";
import XIcon from "./icons/XIcon";
import styled from "styled-components";
import theme from "@/styles/theme";
import toast from "react-hot-toast";
import { useArtistStore } from "@/stores/use-artist-store";
import { useState } from "react";

const Container = styled.div`
  display: flex;
  flex-direction: column;

  width: 1066px;
  height: 640px;
  padding: 56px 64px;
`;

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Header = styled.div`
  ${theme.fonts.title1.medium};
  color: ${theme.colors.gray[800]};
`;

const CloseButton = styled(XIcon)`
  cursor: pointer;
`;

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TableContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  min-height: 0;
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
    padding: "0px",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};

interface ArtistSearchModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onChange: (value: ArtistInfo[]) => void;
  header?: string;
  placeholder?: string;
  value: ArtistInfo[] | null;
  onRegister?: (artist: Artist) => void;
  required?: boolean;
}

const ArtistSearchModal = ({
  isOpen,
  onRequestClose,
  header,
  placeholder,
  onChange,
  value,
  onRegister,
  required,
}: ArtistSearchModalProps) => {
  const [searchValue, setSearchValue] = useState("");
  const { artists, searchArtists, isLoading } = useArtistStore();

  const handleSearch = async () => {
    if (!searchValue.trim()) return;

    try {
      await searchArtists(searchValue, "name,artistUniqueId");
    } catch (error) {
      toast.error("아티스트 검색 중 오류가 발생했습니다.");
    } finally {
    }
  };

  const handleCloseModal = () => {
    onRequestClose();
    setSearchValue("");
  };

  const columns: Column<Artist>[] = [
    {
      header: "아티스트 코드",
      accessor: "artistUniqueId",
      type: "string",
      width: 140,
      align: "center",
    },
    {
      header: "아티스트명",
      accessor: "name",
      type: "string",
      width: 180,
      align: "center",
    },
    {
      header: "영문명",
      accessor: "nameEn",
      type: "string",
      width: 180,
      align: "center",
    },
    {
      header: "국가",
      accessor: "countryCode",
      type: "string",
      width: 100,
      align: "center",
      render: (value, record) => {
        return record.countryCode;
      },
    },
    {
      header: "성별",
      accessor: "genderType",
      type: "string",
      width: 120,
      align: "center",
      render: (value, record) => {
        return record.genderType;
      },
    },
    {
      header: "유형",
      accessor: "artistType",
      type: "string",
      width: 120,
      align: "center",
      render: (value, record) => {
        return record.artistType;
      },
    },
    {
      header: "",
      accessor: "action" as keyof Artist,
      type: "component",
      align: "center",
      width: 110,
      render: (_value, record) => {
        const isAlreadySelected = value?.some(
          (artist) => artist.artistId === record._id,
        );

        return (
          <ButtonOutlinedSecondary
            size="small"
            label={isAlreadySelected ? "등록됨" : "등록"}
            onClick={() => {
              if (isAlreadySelected) {
                toast.error("이미 등록된 아티스트입니다.");
                return;
              }

              onRegister?.(record);
              toast.success("아티스트가 등록되었습니다.");
            }}
            disabled={isAlreadySelected}
          />
        );
      },
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
      style={customStyles}
      ariaHideApp={false}
    >
      <Container>
        <HeaderWrapper>
          <Header>
            {header}
            {required && <span style={{ color: "red" }}>*</span>}
          </Header>
          <CloseButton onClick={handleCloseModal} />
        </HeaderWrapper>

        <Gap height={42} />
        <SearchWrapper>
          <SearchInput
            placeholder={placeholder || "검색"}
            size="small"
            isLoading={isLoading}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onClickSearch={handleSearch}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <AddNewArtist />
        </SearchWrapper>
        <Gap height={32} />
        <TableContainer>
          <CustomTable columns={columns} data={artists} />
        </TableContainer>
      </Container>
    </Modal>
  );
};

export default ArtistSearchModal;
