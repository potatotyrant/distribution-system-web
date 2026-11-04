"use client";

import { AuthLevel } from "@/types/user";
import LoginForm from "./components/LoginForm";
import loginPhoto from "@/assets/login-photo.webp";
import styled from "styled-components";
import { useAuthStore } from "@/stores/use-auth-store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  /* Was 48px top/bottom and 60px left. 24px is 50% of 48 and 40% of 60. */
  padding: 24px 60px 24px 24px;
  gap: 1.25rem;
  box-sizing: border-box;
  background: #fafafa;

  @media (max-width: 800px) {
    flex-direction: column;
    padding: 16px 16px 16px 16px;
    gap: 28px;
  }
`;

const LeftSection = styled.div`
  flex: 1;
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  min-height: 0;
  border: 1px solid #2a2a2a;
  background: #0a0a0a;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;

  @media (max-width: 800px) {
    flex: none;
    width: 100%;
    min-height: 280px;
  }
`;

const PanelPhoto = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 42% 60%;
  border: 0;
  pointer-events: none;
`;

const PanelCopy = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 20px;
  max-width: 100%;
`;

const PanelTitle = styled.h2`
  font-family: "Recital", serif;
  font-weight: 400;
  font-size: 46px;
  letter-spacing: -0.03em;
  line-height: 1.3;
  color: #fafafa;
  white-space: nowrap;
  text-shadow: 0 1px 16px rgba(0, 0, 0, 0.72);
`;

const TradeMark = styled.span`
  font-family: var(--font-pretendard), Pretendard, sans-serif;
  font-weight: 400;
  font-size: inherit;
  line-height: inherit;
  color: inherit;
`;

const PanelSub = styled.p`
  font-family: var(--font-pretendard), Pretendard, sans-serif;
  font-weight: 400;
  font-size: 20px;
  letter-spacing: -0.01em;
  line-height: 1.4;
  color: #fafafa;
  text-shadow: 0 1px 16px rgba(0, 0, 0, 0.72);
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function LoginPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    if (isHydrated && user) {
      if (user.authLevel === AuthLevel.ADMIN) {
        router.push("/contract/dsp/list");
      } else {
        router.push("/community/announcement");
      }
    }
  }, [user, router, isHydrated]);

  if (!isHydrated) {
    return <div>로딩 중...</div>;
  }

  return (
    <Container>
      <LeftSection>
        <PanelPhoto
          src={loginPhoto.src}
          width={loginPhoto.width}
          height={loginPhoto.height}
          alt=""
          aria-label="Hands on a mixing console"
        />
        <PanelCopy>
          <PanelTitle>
            Audioguys for Artists<TradeMark>™</TradeMark>
          </PanelTitle>
          <PanelSub>발매부터 정산까지, 내 음악의 모든 다음 단계</PanelSub>
        </PanelCopy>
      </LeftSection>
      <RightSection>
        <LoginForm />
      </RightSection>
    </Container>
  );
}
