import CustomTable, {
  Column,
} from "@/components/basic/custom-table/CustomTable";
import { useEffect, useState } from "react";

import { Artist } from "@/types/artist";
import { ArtistInfo } from "@/types/album";
import ArtistSearchModal from "@/components/ArtistSearchModal";
import ButtonFilledPrimary from "@/components/basic/buttons/ButtonFilledPrimary";
import ButtonOutlinedPrimary from "@/components/basic/buttons/ButtonOutlinedPrimary";
import CustomInput from "@/components/basic/CustomInput";
import Gap from "@/components/basic/Gap";
import SearchDropdownInput from "@/components/SearchDropdownInput";
import SearchIcon from "@/components/icons/SearchIcon";
import SearchInput from "@/components/SearchInput";
import TrashIcon from "@/components/icons/TrashIcon";
import styled from "styled-components";
import theme from "@/styles/theme";
import { useArtistStore } from "@/stores/use-artist-store";

const Container = styled.div``;

const Label = styled.div`
  ${theme.fonts.body2.medium}
  color: ${theme.colors.gray[600]};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const SearchButton = styled.div`
  width: 320px;
  height: 42px;
  border-radius: 2px;
  padding-left: 12px;
  padding-right: 8px;
  border: 1px solid ${theme.colors.gray[50]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;

const SearchButtonText = styled.span`
  ${theme.fonts.body2.regular}
  color: ${theme.colors.gray[300]};
`;

export default function ReleaseArtistSearch({
  value,
  onChange,
  readOnly = false,
  placeholder,
  label,
  modalHeader,
  required = false,
}: {
  value: ArtistInfo[] | null;
  onChange: (value: ArtistInfo[] | null) => void;
  readOnly?: boolean;
  placeholder?: string;
  label?: string;
  modalHeader?: string;
  required?: boolean;
}) {
  const { fetchArtist } = useArtistStore();
  const [registeredArtistList, setRegisteredArtistList] = useState<Artist[]>(
    [],
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchArtistList = async () => {
      if (value && value.length > 0) {
        const _artistList = value.map((artist) => {
          return fetchArtist(artist.artistId);
        });

        const artists = await Promise.all(_artistList);

        if (artists.length > 0) {
          setRegisteredArtistList(artists.filter((artist) => artist !== null));
        }
      } else {
        setRegisteredArtistList([]);
      }
    };

    fetchArtistList();
  }, [value, fetchArtist]);

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
      width: 200,
      align: "center",
    },
    {
      header: "영문명",
      accessor: "nameEn",
      type: "string",
      width: 200,
      align: "center",
    },
    {
      header: "국가",
      accessor: "countryCode",
      type: "string",
      width: 160,
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
      type: "button",
      width: 50,
      icon: <TrashIcon />,
      onClick: (record, rowIndex) => {
        onChange(
          value
            ? value.filter((artist) => artist.artistId !== record._id)
            : null,
        );
        setRegisteredArtistList(
          registeredArtistList.filter((artist) => artist._id !== record._id),
        );
      },
    },
  ];

  const handleRegisterArtist = (artist: Artist) => {
    const artistInfo: ArtistInfo = {
      artistId: artist._id,
      name: artist.name,
      nameEn: artist.nameEn || "",
      roleList: [
        {
          mainRole: "release",
          subRole: "release",
        },
      ],
    };

    onChange(value ? [...value, artistInfo] : [artistInfo]);
    setRegisteredArtistList([...registeredArtistList, artist]);
  };

  return (
    <Container>
      <Label>
        {label}
        {required && <span style={{ color: "red" }}>*</span>}
      </Label>
      <Gap height={8} />
      {!readOnly && (
        <>
          <SearchButton onClick={() => setIsModalOpen(true)}>
            <SearchButtonText>{placeholder || " "}</SearchButtonText>
            <SearchIcon width={18} height={18} />
          </SearchButton>
          <ArtistSearchModal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            header={modalHeader}
            onChange={onChange}
            value={value}
            onRegister={handleRegisterArtist}
            required={required}
          />
        </>
      )}
      <Gap height={20} />
      <CustomTable
        columns={columns}
        data={registeredArtistList}
        size="small"
        readOnly={readOnly}
      />
    </Container>
  );
}
