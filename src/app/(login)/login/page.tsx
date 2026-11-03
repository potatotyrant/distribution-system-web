"use client";

import { AuthLevel } from "@/types/user";
import LoginForm from "./components/LoginForm";
import styled from "styled-components";
import { useAuthStore } from "@/stores/use-auth-store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  padding: 3rem 3.75rem;
  gap: 1.25rem;
  box-sizing: border-box;
  background: #0a0a0a;

  @media (max-width: 800px) {
    flex-direction: column;
    padding: 24px 8px 48px;
    gap: 28px;
  }
`;

const LeftSection = styled.div`
  flex: 1;
  position: relative;
  border-radius: 2px;
  overflow: hidden;
  min-height: 0;
  border: 1px solid #2a2a2a;
  background: #0a0a0a;

  @media (max-width: 800px) {
    flex: none;
    width: 100%;
    min-height: 220px;
  }
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
      <LeftSection />
      <RightSection>
        <LoginForm />
      </RightSection>
    </Container>
  );
}
