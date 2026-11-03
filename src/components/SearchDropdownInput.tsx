import { useEffect, useRef, useState } from "react";

import Gap from "./basic/Gap";
import SearchInput from "@/components/SearchInput";
import { createPortal } from "react-dom";
import styled from "styled-components";
import theme from "@/styles/theme";

const Container = styled.div`
  position: relative;
`;

const Title = styled.div`
  ${theme.fonts.body2.medium}
  color: ${theme.colors.gray[600]};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ListContainer = styled.div`
  position: relative;
  width: 320px;
`;

const List = styled.ul`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 0;
  background: ${theme.colors.white};
  z-index: 1;
  border-radius: 8px;
  border: 1px solid ${theme.colors.gray[50]};
  overflow: hidden;
  max-height: 300px;
  overflow-y: auto;
`;

const ListItem = styled.li`
  padding: 12px 14px;
  ${theme.fonts.body1.medium}
  color: ${theme.colors.gray[800]};
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  &:not(:last-child)::after {
    content: "";
    position: absolute;
    left: 14px;
    right: 14px;
    bottom: 0;
    height: 1px;
    background-color: ${theme.colors.gray[50]};
  }

  &:hover {
    background: ${theme.colors.gray[25]};
  }
`;

const EmptyResultItem = styled(ListItem)`
  justify-content: center;
  cursor: default;
  color: ${theme.colors.gray[500]};

  &:hover {
    background: ${theme.colors.white};
  }
`;

interface SearchDropdownInputProps<T> {
  title: string;
  placeholder: string;
  onClickSearch: (searchKeyword: string) => Promise<T[]>;
  onSelect: (selectedItem: T) => void;
  renderItem?: (item: T) => string;
  size?: "normal" | "small";
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  required?: boolean;
  blueRequired?: boolean;
}

const SearchDropdownInput = <T,>({
  title,
  placeholder,
  onClickSearch,
  onSelect,
  renderItem = (item: T) => String(item),
  size = "normal",
  onKeyDown,
  required = false,
  blueRequired = false,
}: SearchDropdownInputProps<T>) => {
  const [searched, setSearched] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResult, setSearchResult] = useState<T[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !(portalRef.current && portalRef.current.contains(event.target as Node))
      ) {
        setSearched(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleItemClick = (item: T) => {
    onSelect(item);
    setSearched(false);
  };

  const handleSearch = async () => {
    setIsLoading(true);
    const res = await onClickSearch(searchKeyword);

    setSearchResult(res);
    setIsLoading(false);
    setSearched(true);
  };

  const renderDropdownList = () => {
    if (!dropdownRef.current) return null;
    const rect = dropdownRef.current.getBoundingClientRect();
    return createPortal(
      <div
        ref={portalRef}
        style={{
          position: "absolute",
          top: rect.bottom + window.scrollY + 8,
          left: rect.left + window.scrollX,
          width: rect.width,
          zIndex: 9999,
          pointerEvents: "auto",
        }}
      >
        <List>
          {searchResult.length > 0 ? (
            searchResult.map((item, index) => (
              <ListItem key={index} onClick={() => handleItemClick(item)}>
                {renderItem(item)}
              </ListItem>
            ))
          ) : (
            <EmptyResultItem>검색결과가 없습니다.</EmptyResultItem>
          )}
        </List>
      </div>,
      document.body,
    );
  };

  return (
    <Container ref={dropdownRef}>
      <Title>
        {title}
        {required && <span style={{ color: "red" }}>*</span>}
        {blueRequired && <span style={{ color: "blue" }}>*</span>}
      </Title>
      <Gap height={8} />
      <SearchInput
        placeholder={placeholder}
        onClickSearch={handleSearch}
        onChange={(e) => {
          setSearchKeyword(e.target.value);
        }}
        value={searchKeyword}
        isLoading={isLoading}
        size={size}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
          onKeyDown?.(e);
        }}
      />
      {searched && renderDropdownList()}
    </Container>
  );
};

export default SearchDropdownInput;
