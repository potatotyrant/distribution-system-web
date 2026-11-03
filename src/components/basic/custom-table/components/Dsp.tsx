import { getFullUrl } from "@/constants/api";
import styled from "styled-components";
import theme from "@/styles/theme";

interface DspProps {
  name: string;
  imagePath: string;
}

const DspContent = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  justify-content: center;
`;

const DspImage = styled.img`
  width: 28px;
  height: 28px;
  object-fit: cover;
  border-radius: 50%;
`;

const DspInfo = styled.div`
  display: flex;
  flex-direction: column;
  font-family: var(--font-pretendard), Pretendard, sans-serif;
  font-weight: 500;
  font-size: 15px;
  letter-spacing: -0.01em;
  line-height: 1.4;
  color: ${theme.colors.gray[800]};
`;

const Dsp = ({ name, imagePath }: DspProps) => {
  return (
    <DspContent>
      <DspImage src={getFullUrl(imagePath)} alt={name} />
      <DspInfo>
        <div>{name}</div>
      </DspInfo>
    </DspContent>
  );
};

export default Dsp;
