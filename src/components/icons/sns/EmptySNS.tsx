import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;
`;

interface EmptySNSProps {
  width?: number;
  height?: number;
  color?: string;
}

const EmptySNS = ({ width = 24, height = 24 }: EmptySNSProps) => {
  return (
    <Container>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
      >
        <g clipPath="url(#clip0_4539_43316)">
          <circle
            cx="12"
            cy="12"
            r="11"
            stroke="#eaeaea"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="2 4"
          />
        </g>
        <defs>
          <clipPath id="clip0_4539_43316">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </Container>
  );
};

export default EmptySNS;
