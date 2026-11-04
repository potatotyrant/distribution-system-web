import {
  MenuGroup,
  MenuGroupButton,
  MenuItem,
  MenuItemLink,
  MenuLabel,
} from "./fragment/MenuItem";

import ArrowDownIcon from "@/components/icons/ArrowDownIcon";
import ArrowUpIcon from "@/components/icons/ArrowUpIcon";
import { AuthLevel } from "@/types/user";
import Gap from "@/components/basic/Gap";
import styled from "styled-components";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTrackStore } from "@/stores/use-track-store";

const Container = styled.div``;

const ContentSection = ({ authLevel }: { authLevel: AuthLevel }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { resetTracks } = useTrackStore();
  const pathname = usePathname();
  return (
    <Container>
      <MenuGroupButton onClick={() => setIsOpen(!isOpen)}>
        콘텐츠 관리
        {isOpen ? (
          <ArrowUpIcon width={14} height={14} />
        ) : (
          <ArrowDownIcon width={14} height={14} />
        )}
      </MenuGroupButton>

      <MenuGroup $isOpen={isOpen}>
        <Gap height={12} />
        <MenuLabel>앨범</MenuLabel>

        {authLevel === AuthLevel.ADMIN && (
          <>
            <Gap height={12} />
            <MenuItemLink
              href="/content/album/new"
              onClick={() => resetTracks()}
            >
              <MenuItem $isActive={pathname === "/content/album/new"}>
                신규 앨범 등록
              </MenuItem>
            </MenuItemLink>
          </>
        )}
        <MenuItemLink href="/content/album/list">
          <MenuItem
            $isActive={
              pathname === "/content/album/list" ||
              pathname.startsWith("/content/album/list/")
            }
          >
            리스트 조회
          </MenuItem>
        </MenuItemLink>

        <Gap height={20} />
        <MenuLabel>영상</MenuLabel>

        {authLevel === AuthLevel.ADMIN && (
          <>
            <Gap height={12} />
            <MenuItemLink href="/content/video/new">
              <MenuItem $isActive={pathname === "/content/video/new"}>
                신규 영상 등록
              </MenuItem>
            </MenuItemLink>
          </>
        )}
        <MenuItemLink href="/content/video/list">
          <MenuItem
            $isActive={
              pathname === "/content/video/list" ||
              pathname.startsWith("/content/video/list/")
            }
          >
            리스트 조회
          </MenuItem>
        </MenuItemLink>

        {authLevel === AuthLevel.ADMIN && (
          <>
            <Gap height={20} />
            <MenuLabel>아티스트</MenuLabel>
            <MenuItemLink href="/content/artist">
              <MenuItem
                $isActive={
                  pathname === "/content/artist" ||
                  pathname.startsWith("/content/artist/")
                }
              >
                아티스트 관리
              </MenuItem>
            </MenuItemLink>
          </>
        )}
      </MenuGroup>
    </Container>
  );
};

export default ContentSection;
