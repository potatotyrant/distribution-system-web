import CustomTable, {
  Column,
} from "@/components/basic/custom-table/CustomTable";

import ButtonOutlinedSecondary from "@/components/basic/buttons/ButtonOutlinedSecondary";
import CustomDropdown from "@/components/basic/CustomDropdown";
import CustomInput from "@/components/basic/CustomInput";
import Gap from "@/components/basic/Gap";
import PlusIcon from "@/components/icons/PlusIcon";
import { TitleLanguage } from "@/types/album";
import TrashIcon from "@/components/icons/TrashIcon";
import { getLanguageKeyValueList } from "@/constants/language";
import styled from "styled-components";
import toast from "react-hot-toast";

const Container = styled.div``;

export default function TrackTitle({
  value,
  onChange,
  readOnly,
}: {
  value: TitleLanguage[] | null;
  onChange: (value: TitleLanguage[]) => void;
  readOnly: boolean;
}) {
  const columns: Column<TitleLanguage>[] = [
    {
      header: "언어",
      accessor: "language",
      align: "center",
      type: "string",
      width: 170,
      render: (_value, record) => {
        const oldKey = Object.keys(record)[0] || "";
        return (
          <CustomDropdown
            placeholder="언어 선택"
            items={getLanguageKeyValueList()}
            selectedKey={oldKey}
            onSelectKey={(newKey) => {
              if (
                value &&
                value.some(
                  (item) =>
                    item !== record &&
                    Object.keys(item)[0] === newKey &&
                    item[newKey] !== undefined,
                )
              ) {
                toast.error("이미 선택된 언어입니다.");
                return;
              }
              // 기존의 title 값을 유지하면서 새 key로 업데이트
              const newRecord = { [newKey]: record[oldKey] || "" };
              if (value) {
                const newValue = value.map((item) =>
                  item === record ? newRecord : item,
                );
                onChange(newValue);
              }
            }}
            width={150}
            size="small"
            readOnly={readOnly}
          />
        );
      },
    },
    {
      header: "트랙명",
      accessor: "string",
      align: "center",
      type: "string",
      width: 707,
      render: (_value, record) => {
        // record는 { [language]: title } 형태이므로, 언어 코드를 추출
        const lang = Object.keys(record)[0] || "";
        const title = record[lang] || "";
        return (
          <CustomInput
            value={title}
            onChange={(e) => {
              const newTitle = e.target.value;
              const newRecord = { [lang]: newTitle };
              // value 배열에서 현재 record의 index를 찾습니다.
              const index = value
                ? value.findIndex((item) => item === record)
                : -1;
              if (index !== -1 && value) {
                const newValue = [...value];
                newValue[index] = newRecord;
                onChange(newValue);
              }
            }}
            size="small"
            width={707 - 24}
          />
        );
      },
    },
    {
      header: "",
      accessor: "action",
      align: "center",
      type: "button",
      width: 100,
      icon: <TrashIcon />,
      onClick: (record, rowIndex) => {
        // index 기준으로 삭제
        onChange(value ? value.filter((_, i) => i !== rowIndex) : []);
      },
    },
  ];

  return (
    <Container>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          fontSize: "16px",
          fontWeight: "500",
          color: "#1a1a1a",
        }}
      >
        트랙명 <span style={{ color: "red" }}>*</span>
      </div>
      <CustomTable columns={columns} data={value || []} size="small" />
      <Gap height={12} />
      {!readOnly && (
        <ButtonOutlinedSecondary
          size="medium"
          expand
          leftIcon={<PlusIcon />}
          label="추가"
          onClick={() => {
            if (readOnly) return;
            const newValue = [...(value || []), { "": "" }];
            onChange(newValue);
          }}
        />
      )}
    </Container>
  );
}
