import { layout } from "@/styles/layout-metrics";
import styled from "styled-components";
import theme from "@/styles/theme";

const HeaderContainer = styled.div`
  padding: ${layout.pageHeaderPaddingTop}px 0;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Title = styled.div`
  ${theme.fonts.title1.medium};
  color: ${theme.colors.gray[800]};
  letter-spacing: -0.03em;
`;

const RequiredInfo = styled.div`
  ${theme.fonts.body2.medium};
  color: ${theme.colors.gray[600]};
  display: flex;
  gap: 8px;
`;

const RequiredText = styled.span`
  color: ${theme.colors.red[500]};
`;

const OptionalText = styled.span`
  color: ${theme.colors.blue[500]};
`;

interface PageHeaderProps {
  title: string;
  showRequiredInfo?: boolean;
}

const PageHeader = ({ title, showRequiredInfo = false }: PageHeaderProps) => {
  return (
    <HeaderContainer>
      <Title>{title}</Title>
      {showRequiredInfo && (
        <RequiredInfo>
          <RequiredText>*</RequiredText>
          <span>빨간색은 DDEX 전송 필수값,</span>
          <OptionalText>*</OptionalText>
          <span>파란색은 정산 필수값</span>
        </RequiredInfo>
      )}
    </HeaderContainer>
  );
};

export default PageHeader;
