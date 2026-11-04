import ButtonOutlinedAssistive from "./basic/buttons/ButtonOutlinedAssistive";
import CustomModal from "./CustomModal";
import styled from "styled-components";
import theme from "@/styles/theme";
import { useAuthStore } from "@/stores/use-auth-store";
import { useState } from "react";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  padding: 8px 8px 8px 14px;
  background: #0a0a0a;
  flex-shrink: 0;
`;

const UserInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 144px;
`;

const UserInfoLabel = styled.div`
  font-family: var(--font-pretendard), Pretendard, sans-serif;
  font-size: 10px;
  font-weight: 400;
  letter-spacing: -0.01em;
  line-height: 1.4;
  text-transform: none;
  color: #8a8a8a;
`;

const UserName = styled.div`
  ${theme.fonts.body1.medium};
  color: #fafafa;
`;

const LoginInfo = () => {
  const { user, logout } = useAuthStore();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    setIsLogoutModalOpen(false);
  };

  return (
    <Container>
      <UserInfoWrapper>
        <UserInfoLabel>로그인 정보</UserInfoLabel>
        <UserName>{user?.displayName}</UserName>
      </UserInfoWrapper>
      <ButtonOutlinedAssistive
        onClick={handleLogoutClick}
        label="로그아웃"
        size="medium"
      />
      <CustomModal
        isOpen={isLogoutModalOpen}
        onRequestClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
        content="정말 로그아웃 하시겠어요?"
      />
    </Container>
  );
};

export default LoginInfo;
