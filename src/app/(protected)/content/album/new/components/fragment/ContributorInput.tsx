import { Contributor, ContributorRole } from "@/types/track";
import CustomTable, {
  Column,
} from "@/components/basic/custom-table/CustomTable";
import {
  getArtistRoleCategory1List,
  getArtistRoleCategory2List,
} from "@/constants/artist-role";

import ButtonOutlinedSecondary from "@/components/basic/buttons/ButtonOutlinedSecondary";
import CustomDropdown from "@/components/basic/CustomDropdown";
import CustomInput from "@/components/basic/CustomInput";
import Gap from "@/components/basic/Gap";
import PlusIcon from "@/components/icons/PlusIcon";
import TrashIcon from "@/components/icons/TrashIcon";
import styled from "styled-components";

const Container = styled.div``;

const Label = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #1a1a1a;
`;

// 기여자 유형1 옵션 (참여 아티스트와 동일)
const contributorType1Options = () => {
  const category1List = getArtistRoleCategory1List();
  return category1List.map((category) => ({ key: category, value: category }));
};

// 기여자 유형2 옵션 (참여 아티스트와 동일)
const getContributorType2Options = (selectedType1: string) => {
  const category2List = getArtistRoleCategory2List(selectedType1);
  return category2List.map((category) => ({ key: category, value: category }));
};

export default function ContributorInput({
  value,
  onChange,
  readOnly = false,
  required = false,
}: {
  value: Contributor[] | null;
  onChange: (value: Contributor[] | null) => void;
  readOnly?: boolean;
  required?: boolean;
}) {
  const contributors = value || [];
  console.log(
    "ContributorInput 렌더링 - value:",
    value,
    "contributors:",
    contributors,
  );

  const columns: Column<Contributor>[] = [
    {
      header: "한국명",
      accessor: "name",
      align: "center",
      type: "string",
      width: 200,
      render: (_value, record, index) => {
        if (index === undefined) return null;
        return (
          <CustomInput
            value={record.name}
            onChange={(e) => {
              const updatedContributors = [...contributors];
              updatedContributors[index] = { ...record, name: e.target.value };
              onChange(updatedContributors);
            }}
            size="small"
            width={200 - 24}
            readOnly={readOnly}
          />
        );
      },
    },
    {
      header: "영문명",
      accessor: "nameEn",
      align: "center",
      type: "string",
      width: 200,
      render: (_value, record, index) => {
        if (index === undefined) return null;
        return (
          <CustomInput
            value={record.nameEn}
            onChange={(e) => {
              const updatedContributors = [...contributors];
              updatedContributors[index] = {
                ...record,
                nameEn: e.target.value,
              };
              onChange(updatedContributors);
            }}
            size="small"
            width={200 - 24}
            readOnly={readOnly}
          />
        );
      },
    },
    {
      header: "유형1",
      accessor: "roleList",
      align: "center",
      type: "string",
      width: 170,
      render: (_value, record, index) => {
        if (index === undefined) return null;
        // roleList의 첫 번째 역할의 mainRole을 표시
        const firstRole = record.roleList?.[0];
        return (
          <CustomDropdown
            placeholder="유형1 선택"
            items={contributorType1Options()}
            selectedKey={firstRole?.mainRole || ""}
            onSelectKey={(newType1) => {
              const updatedContributors = [...contributors];
              const updatedRoleList = record.roleList || [];

              if (updatedRoleList.length === 0) {
                // 역할이 없으면 새로 생성
                updatedRoleList.push({ mainRole: newType1, subRole: "" });
              } else {
                // 첫 번째 역할의 mainRole 업데이트하고 subRole 초기화
                updatedRoleList[0] = {
                  mainRole: newType1,
                  subRole: "",
                };
              }

              updatedContributors[index] = {
                ...record,
                roleList: updatedRoleList,
              };
              onChange(updatedContributors);
            }}
            width={150}
            size="small"
            readOnly={readOnly}
          />
        );
      },
    },
    {
      header: "유형2",
      accessor: "roleList",
      align: "center",
      type: "string",
      width: 170,
      render: (_value, record, index) => {
        if (index === undefined) return null;
        // roleList의 첫 번째 역할의 subRole을 표시
        const firstRole = record.roleList?.[0];
        return (
          <CustomDropdown
            placeholder="유형2 선택"
            items={getContributorType2Options(firstRole?.mainRole || "")}
            selectedKey={firstRole?.subRole || ""}
            onSelectKey={(newType2) => {
              const updatedContributors = [...contributors];
              const updatedRoleList = record.roleList || [];

              if (updatedRoleList.length === 0) {
                // 역할이 없으면 새로 생성
                updatedRoleList.push({ mainRole: "", subRole: newType2 });
              } else {
                // 첫 번째 역할의 subRole 업데이트
                updatedRoleList[0] = {
                  ...updatedRoleList[0],
                  subRole: newType2,
                };
              }

              updatedContributors[index] = {
                ...record,
                roleList: updatedRoleList,
              };
              onChange(updatedContributors);
            }}
            width={150}
            size="small"
            readOnly={readOnly}
            disabled={!firstRole?.mainRole} // 유형1이 선택되지 않으면 비활성화
          />
        );
      },
    },
    {
      header: "",
      accessor: "_id" as keyof Contributor,
      align: "center",
      type: "button",
      width: 100,
      icon: <TrashIcon />,
      onClick: (record, rowIndex) => {
        if (rowIndex !== undefined) {
          onChange(contributors.filter((_, i) => i !== rowIndex));
        }
      },
    },
  ];

  return (
    <Container>
      <Label>
        기여자 {required && <span style={{ color: "red" }}>*</span>}
      </Label>
      <CustomTable columns={columns} data={contributors} size="small" />
      <Gap height={12} />
      <ButtonOutlinedSecondary
        label="추가"
        size="medium"
        onClick={() => {
          if (readOnly) return;
          console.log("추가 버튼 클릭됨");
          console.log("현재 contributors:", contributors);
          const newContributor: Contributor = {
            name: "",
            nameEn: "",
            roleList: [{ mainRole: "", subRole: "" }], // 역할은 1개만 (mainRole, subRole)
          };
          console.log("새 기여자:", newContributor);
          const updatedContributors = [...contributors, newContributor];
          console.log("업데이트된 contributors:", updatedContributors);
          onChange(updatedContributors);
        }}
        leftIcon={<PlusIcon />}
        expand
      />
    </Container>
  );
}
