import { UseFormRegister, UseFormSetValue } from "react-hook-form";

import { Column } from "@/components/basic/custom-table/CustomTable";
import CustomChip from "@/components/basic/CustomChip";
import Gap from "@/components/basic/Gap";
import SearchDropdownInput from "@/components/SearchDropdownInput";
import TrashIcon from "@/components/icons/TrashIcon";
import { User } from "@/types/user";
import UserTypeBadge from "@/components/basic/custom-table/components/UserTypeBadge";
import Video from "@/types/video";
import styled from "styled-components";
import theme from "@/styles/theme";
import { useState } from "react";
import { useUserStore } from "@/stores/use-user-store";

const Container = styled.div`
  overflow-y: visible;
`;

const Title = styled.div`
  ${theme.fonts.heading2.medium}
  color: ${theme.colors.gray[800]};
`;

const SelectedUserContainer = styled.div`
  padding-top: 8px;
`;

export default function VideoLicensorSearch({
  value,
  onChange,
  readOnly = false,
  user,
  register,
  setValue,
  required = false,
}: {
  value: string;
  onChange: (value: string | null) => void;
  readOnly?: boolean;
  user?: User;
  register: UseFormRegister<Video>;
  setValue: UseFormSetValue<Video>;
  required?: boolean;
}) {
  const [selectedUser, setSelectedUser] = useState<User | null>(user || null);
  const { searchUsers } = useUserStore();

  const handleDelete = () => {
    setSelectedUser(null);
    onChange(null);
    setValue("userContractId", undefined);
    setValue("userContractInfo", undefined);
  };

  const onSelect = (selectedItem: User) => {
    setSelectedUser(selectedItem);
    setValue("userId", selectedItem._id);
    setValue("userInfo", selectedItem);
    setValue("dspContractIdList", []);
  };

  const handleSearch = async (searchKeyword: string) => {
    const res = await searchUsers(searchKeyword, "displayName");
    return res;
  };

  return (
    <Container>
      <Title>
        권리자명
        {required && <span style={{ color: "#d0313a" }}> *</span>}
      </Title>
      <Gap height={20} />
      {!readOnly && (
        <SearchDropdownInput
          title="권리자명 검색"
          placeholder="권리자명 검색"
          onClickSearch={handleSearch}
          onSelect={(selectedItem: User) => {
            onSelect(selectedItem);
          }}
          renderItem={(item) => `${item.displayName}`}
          size="small"
        />
      )}
      {selectedUser && (
        <SelectedUserContainer>
          <CustomChip
            label={selectedUser.displayName}
            onClick={handleDelete}
            deletable
          />
        </SelectedUserContainer>
      )}
    </Container>
  );
}
