import CustomTable, {
  Column,
} from "@/components/basic/custom-table/CustomTable";
import {
  getArtistRoleCategory1List,
  getArtistRoleCategory2List,
} from "@/constants/artist-role";
import { useEffect, useState } from "react";

import { Artist } from "@/types/artist";
import { ArtistInfo } from "@/types/album";
import ArtistSearchModal from "@/components/ArtistSearchModal";
import ButtonFilledPrimary from "@/components/basic/buttons/ButtonFilledPrimary";
import ButtonOutlinedPrimary from "@/components/basic/buttons/ButtonOutlinedPrimary";
import CustomDropdown from "@/components/basic/CustomDropdown";
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

export default function ParticipateArtistSearch({
  value,
  onChange,
  readOnly = false,
  placeholder,
  label,
  modalHeader,
}: {
  value: ArtistInfo[] | null;
  onChange: (value: ArtistInfo[] | null) => void;
  readOnly?: boolean;
  placeholder?: string;
  label?: string;
  modalHeader?: string;
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
      width: 120,
      align: "center",
    },
    {
      header: "영문명",
      accessor: "nameEn",
      type: "string",
      width: 120,
      align: "center",
    },
    {
      header: "국가",
      accessor: "countryCode",
      type: "string",
      width: 120,
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
      width: 100,
      align: "center",
      render: (value, record) => {
        return record.artistType;
      },
    },
    {
      header: "역할 구분1",
      accessor: "_id",
      type: "component",
      width: 132,
      align: "center",
      render: (_value, record) => {
        if (!value) return "";

        const artistInfo = value.find(
          (artist) => artist.artistId === record._id,
        );

        const roleCategory1List = getArtistRoleCategory1List();
        const roleCategory1Items = roleCategory1List.map((category) => ({
          key: category,
          value: category,
        }));

        return (
          <CustomDropdown
            selectedKey={artistInfo?.roleList?.[0]?.mainRole || ""}
            onSelectKey={(selectedRole) => {
              if (value) {
                const newValue = value.map((artist) =>
                  artist.artistId === record._id
                    ? {
                        ...artist,
                        roleList: [
                          {
                            mainRole: selectedRole,
                            subRole: "",
                          },
                        ],
                      }
                    : artist,
                );
                onChange(newValue);
              }
            }}
            items={roleCategory1Items}
            size="small"
            width={108}
            readOnly={readOnly}
          />
        );
      },
    },
    {
      header: "역할 구분2",
      accessor: "_id",
      type: "component",
      width: 132,
      align: "center",
      render: (_value, record) => {
        if (!value) return "";

        const artistInfo = value.find(
          (artist) => artist.artistId === record._id,
        );

        const isCategory1Selected = !!artistInfo?.roleList?.[0]?.mainRole;
        const roleCategory2List = isCategory1Selected
          ? getArtistRoleCategory2List(artistInfo.roleList[0].mainRole)
          : [];

        const roleCategory2Items = roleCategory2List.map((category) => ({
          key: category,
          value: category,
        }));

        return (
          <CustomDropdown
            selectedKey={artistInfo?.roleList?.[0]?.subRole || ""}
            onSelectKey={(selectedRole) => {
              if (value) {
                const newValue = value.map((artist) =>
                  artist.artistId === record._id
                    ? {
                        ...artist,
                        roleList: [
                          {
                            mainRole: artist.roleList?.[0]?.mainRole || "",
                            subRole: selectedRole,
                          },
                        ],
                      }
                    : artist,
                );
                onChange(newValue);
              }
            }}
            items={roleCategory2Items}
            size="small"
            width={108}
            readOnly={readOnly}
            disabled={!isCategory1Selected}
          />
        );
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
          mainRole: "participate",
          subRole: "participate",
        },
      ],
    };

    onChange(value ? [...value, artistInfo] : [artistInfo]);
    setRegisteredArtistList([...registeredArtistList, artist]);
  };

  return (
    <Container>
      <Label>{label}</Label>
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
