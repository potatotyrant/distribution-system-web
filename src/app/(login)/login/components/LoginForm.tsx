"use client";

import ButtonFilledPrimary from "@/components/basic/buttons/ButtonFilledPrimary";
import CustomInput from "@/components/basic/CustomInput";
import styled from "styled-components";
import theme from "@/styles/theme";
import toast from "react-hot-toast";
import { useAuthStore } from "@/stores/use-auth-store";
import { useState } from "react";
import { useUserStore } from "@/stores/use-user-store";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 320px;
  max-width: 100%;
  color: #0a0a0a;

  label {
    color: #0a0a0a;
  }

  @media (max-width: 480px) {
    width: 100%;

    > div > div {
      width: 100% !important;
      max-width: 100%;
    }
  }
`;

const Title = styled.h1`
  ${theme.fonts.title1.semibold};
  color: #0a0a0a;
  letter-spacing: -0.01em;
  line-height: 1.4;
`;

const PreviewLink = styled.button`
  ${theme.fonts.mono};
  align-self: flex-start;
  font-size: 11px;
  line-height: 16px;
  color: #8a8a8a;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;

  &:hover {
    color: #f2592a;
  }
`;

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isLoading, user, jsonWebToken, login, enterPreview } = useAuthStore();

  const handleLogin = () => {
    if (!email || !password) {
      toast.error("아이디와 비밀번호를 입력해주세요.");
      return;
    }
    login(email, password);
  };

  return (
    <Container>
      <Title>로그인</Title>
      <CustomInput
        label="아이디"
        placeholder="아이디를 입력해주세요."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <CustomInput
        label="비밀번호"
        placeholder="비밀번호를 입력해주세요."
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <ButtonFilledPrimary label="로그인" expand onClick={handleLogin} />
      <PreviewLink type="button" onClick={() => enterPreview()}>
        Preview without login
      </PreviewLink>
    </Container>
  );
}
