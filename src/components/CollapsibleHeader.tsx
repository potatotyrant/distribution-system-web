import ArrowDownIcon from "./icons/ArrowDownIcon";
import ArrowUpIcon from "./icons/ArrowUpIcon";
import styled from "styled-components";
import theme from "@/styles/theme";
import { useState } from "react";

interface CollapsibleHeaderProps {
  title: string;
  renderComponent?: React.ReactNode;
}

const HeaderContainer = styled.div`
  margin-bottom: 16px;
`;

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;

  gap: 12px;
`;

const Title = styled.h2`
  ${theme.fonts.heading2.medium};
  color: ${theme.colors.gray[800]};
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid ${theme.colors.purple[600]}; /* purple600 */
`;

const ContentWrapper = styled.div<{ $isOpen: boolean }>`
  max-height: ${({ $isOpen }) => ($isOpen ? "10000px" : "0")};
  overflow: hidden;
  transition: max-height 0.1s ease-in-out;
`;

const CollapsibleHeader: React.FC<CollapsibleHeaderProps> = ({
  title,
  renderComponent,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <HeaderContainer>
      <HeaderWrapper onClick={toggleOpen}>
        <Title>{title}</Title>
        <IconWrapper>
          {isOpen ? (
            <ArrowUpIcon
              color={theme.colors.purple[600]}
              width={13.5}
              height={13.5}
            />
          ) : (
            <ArrowDownIcon
              color={theme.colors.purple[600]}
              width={13.5}
              height={13.5}
            />
          )}
        </IconWrapper>
      </HeaderWrapper>
      <ContentWrapper $isOpen={isOpen}>{renderComponent}</ContentWrapper>
    </HeaderContainer>
  );
};

export default CollapsibleHeader;
