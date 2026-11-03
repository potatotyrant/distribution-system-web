import {
  MenuGroup,
  MenuGroupButton,
  MenuItem,
  MenuItemLink,
} from "./fragment/MenuItem";

import ArrowDownIcon from "@/components/icons/ArrowDownIcon";
import ArrowUpIcon from "@/components/icons/ArrowUpIcon";
import Gap from "@/components/basic/Gap";
import Link from "next/link";
import styled from "styled-components";
import theme from "@/styles/theme";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Container = styled.div``;

const CommunitySection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  return (
    <Container>
      <MenuGroupButton onClick={() => setIsOpen(!isOpen)}>
        커뮤니티
        {isOpen ? (
          <ArrowUpIcon width={14} height={14} />
        ) : (
          <ArrowDownIcon width={14} height={14} />
        )}
      </MenuGroupButton>
      <Gap height={12} />
      <MenuGroup $isOpen={isOpen}>
        <MenuItemLink href="/community/announcement">
          <MenuItem
            $isActive={
              pathname === "/community/announcement" ||
              pathname.startsWith("/community/announcement/")
            }
          >
            공지사항
          </MenuItem>
        </MenuItemLink>
      </MenuGroup>
    </Container>
  );
};

export default CommunitySection;
