// components/Breadcrumbs.tsx
"use client";

import ArrowRightIcon from "./icons/ArrowRightIcon";
import Link from "next/link";
import LoginInfo from "./LoginInfo";
import React from "react";
import styled from "styled-components";
import { usePathname } from "next/navigation";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 24px;
  background: #fafafa;
  color: #0a0a0a;
  padding: 18px 60px;
  border-bottom: 1px solid #eaeaea;
  min-height: 76px;

  @media (max-width: 768px) {
    padding: 16px 0;
    flex-wrap: wrap;
  }
`;

const BreadcrumbWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;

  svg {
    width: 12px;
    height: 12px;
    display: block;
  }

  svg path {
    stroke: #8a8a8a;
  }
`;

const PrevBreadcrumb = styled.div`
  font-family: var(--font-pretendard), Pretendard, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.4;
  letter-spacing: -0.01em;
  color: #8a8a8a;
`;

const CurrentBreadcrumb = styled.div`
  font-family: var(--font-pretendard), Pretendard, sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: -0.01em;
  color: #0a0a0a;
`;

const Breadcrumbs = () => {
  const pathname = usePathname();

  const renderBreadcrumbs = () => {
    // 동적 라우트 매칭을 위해 정규식 사용
    if (pathname.match(/^\/content\/album\/list\/[^\/]+$/)) {
      return (
        <BreadcrumbWrapper>
          <PrevBreadcrumb>콘텐츠 관리</PrevBreadcrumb>
          <ArrowRightIcon width={12} height={12} />
          <PrevBreadcrumb>앨범</PrevBreadcrumb>
          <ArrowRightIcon width={12} height={12} />
          <PrevBreadcrumb>리스트 조회</PrevBreadcrumb>
          <ArrowRightIcon width={12} height={12} />
          <CurrentBreadcrumb>상세</CurrentBreadcrumb>
        </BreadcrumbWrapper>
      );
    }

    if (pathname.match(/^\/content\/video\/list\/[^\/]+$/)) {
      return (
        <BreadcrumbWrapper>
          <PrevBreadcrumb>콘텐츠 관리</PrevBreadcrumb>
          <ArrowRightIcon width={12} height={12} />
          <PrevBreadcrumb>영상</PrevBreadcrumb>
          <ArrowRightIcon width={12} height={12} />
          <PrevBreadcrumb>리스트 조회</PrevBreadcrumb>
          <ArrowRightIcon width={12} height={12} />
          <CurrentBreadcrumb>상세</CurrentBreadcrumb>
        </BreadcrumbWrapper>
      );
    }

    if (pathname.match(/^\/community\/announcement\/[^\/]+$/)) {
      return (
        <BreadcrumbWrapper>
          <PrevBreadcrumb>커뮤니티</PrevBreadcrumb>
          <ArrowRightIcon width={12} height={12} />
          <PrevBreadcrumb>공지사항</PrevBreadcrumb>
          <ArrowRightIcon width={12} height={12} />
          <CurrentBreadcrumb>상세</CurrentBreadcrumb>
        </BreadcrumbWrapper>
      );
    }

    switch (pathname) {
      case "/contract/dsp/list":
        return (
          <BreadcrumbWrapper>
            <PrevBreadcrumb>계약 관리</PrevBreadcrumb>
            <ArrowRightIcon width={12} height={12} />
            <PrevBreadcrumb>DSP</PrevBreadcrumb>
            <ArrowRightIcon width={12} height={12} />
            <CurrentBreadcrumb>리스트 조회/등록</CurrentBreadcrumb>
          </BreadcrumbWrapper>
        );
      case "/contract/licensor/list":
        return (
          <BreadcrumbWrapper>
            <PrevBreadcrumb>계약 관리</PrevBreadcrumb>
            <ArrowRightIcon width={12} height={12} />
            <PrevBreadcrumb>권리자</PrevBreadcrumb>
            <ArrowRightIcon width={12} height={12} />
            <CurrentBreadcrumb>리스트 조회/등록</CurrentBreadcrumb>
          </BreadcrumbWrapper>
        );
      case "/contract/licensor/contract-info":
        return (
          <BreadcrumbWrapper>
            <PrevBreadcrumb>계약 관리</PrevBreadcrumb>
            <ArrowRightIcon width={12} height={12} />
            <PrevBreadcrumb>권리자</PrevBreadcrumb>
            <ArrowRightIcon width={12} height={12} />
            <CurrentBreadcrumb>계약 정보 조회/등록</CurrentBreadcrumb>
          </BreadcrumbWrapper>
        );

      case "/content/album/list":
        return (
          <BreadcrumbWrapper>
            <PrevBreadcrumb>콘텐츠 관리</PrevBreadcrumb>
            <ArrowRightIcon width={12} height={12} />
            <PrevBreadcrumb>앨범</PrevBreadcrumb>
            <ArrowRightIcon width={12} height={12} />
            <CurrentBreadcrumb>리스트 조회</CurrentBreadcrumb>
          </BreadcrumbWrapper>
        );

      case "/content/album/new":
        return (
          <BreadcrumbWrapper>
            <PrevBreadcrumb>콘텐츠 관리</PrevBreadcrumb>
            <ArrowRightIcon width={12} height={12} />
            <PrevBreadcrumb>앨범</PrevBreadcrumb>
            <ArrowRightIcon width={12} height={12} />
            <CurrentBreadcrumb>신규 앨범 등록</CurrentBreadcrumb>
          </BreadcrumbWrapper>
        );

      case "/content/video/list":
        return (
          <BreadcrumbWrapper>
            <PrevBreadcrumb>콘텐츠 관리</PrevBreadcrumb>
            <ArrowRightIcon width={12} height={12} />
            <PrevBreadcrumb>영상 </PrevBreadcrumb>
            <ArrowRightIcon width={12} height={12} />
            <CurrentBreadcrumb>리스트 조회</CurrentBreadcrumb>
          </BreadcrumbWrapper>
        );

      case "/content/video/new":
        return (
          <BreadcrumbWrapper>
            <PrevBreadcrumb>콘텐츠 관리</PrevBreadcrumb>
            <ArrowRightIcon width={12} height={12} />
            <PrevBreadcrumb>영상 </PrevBreadcrumb>
            <ArrowRightIcon width={12} height={12} />
            <CurrentBreadcrumb>신규 영상 등록</CurrentBreadcrumb>
          </BreadcrumbWrapper>
        );

      case "/content/artist":
        return (
          <BreadcrumbWrapper>
            <PrevBreadcrumb>콘텐츠 관리</PrevBreadcrumb>
            <ArrowRightIcon width={12} height={12} />
            <PrevBreadcrumb>아티스트</PrevBreadcrumb>
            <ArrowRightIcon width={12} height={12} />
            <CurrentBreadcrumb>아티스트 관리</CurrentBreadcrumb>
          </BreadcrumbWrapper>
        );

      case "/service/settlement-status/list":
        return (
          <BreadcrumbWrapper>
            <PrevBreadcrumb>서비스 현황</PrevBreadcrumb>
            <ArrowRightIcon width={12} height={12} />
            <PrevBreadcrumb>정산 현황</PrevBreadcrumb>
            <ArrowRightIcon width={12} height={12} />
            <CurrentBreadcrumb>정산금 조회</CurrentBreadcrumb>
          </BreadcrumbWrapper>
        );

      case "/service/settlement-status/detail":
        return (
          <BreadcrumbWrapper>
            <PrevBreadcrumb>서비스 현황</PrevBreadcrumb>
            <ArrowRightIcon width={12} height={12} />
            <PrevBreadcrumb>정산 현황</PrevBreadcrumb>
            <ArrowRightIcon width={12} height={12} />
            <CurrentBreadcrumb>상세내역 조회</CurrentBreadcrumb>
          </BreadcrumbWrapper>
        );

      case "/service/admin-settlement/distribution":
        return (
          <BreadcrumbWrapper>
            <PrevBreadcrumb>서비스 현황</PrevBreadcrumb>
            <ArrowRightIcon width={12} height={12} />
            <PrevBreadcrumb>관리자 정산</PrevBreadcrumb>
            <ArrowRightIcon width={12} height={12} />
            <CurrentBreadcrumb>유통 정산 현황</CurrentBreadcrumb>
          </BreadcrumbWrapper>
        );

      case "/community/announcement":
        return (
          <BreadcrumbWrapper>
            <PrevBreadcrumb>커뮤니티</PrevBreadcrumb>
            <ArrowRightIcon width={12} height={12} />
            <CurrentBreadcrumb>공지사항</CurrentBreadcrumb>
          </BreadcrumbWrapper>
        );
    }
  };

  return (
    <Container>
      {renderBreadcrumbs()}
      <LoginInfo />
    </Container>
  );
};

export default Breadcrumbs;
