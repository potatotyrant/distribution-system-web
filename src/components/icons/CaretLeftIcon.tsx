import { SVGProps } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
`;

export default function CaretLeftIcon({
  color = "black",
  ...props
}: SVGProps<SVGSVGElement> & { color?: string }) {
  return (
    <Container>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M5.94134 11.2433C5.35289 11.6397 5.35289 12.5057 5.94134 12.9021L14.4013 18.6006C15.0656 19.048 15.96 18.572 15.96 17.7712V6.37425C15.96 5.57339 15.0656 5.09745 14.4013 5.54486L5.94134 11.2433Z"
          fill={color}
        />
      </svg>
    </Container>
  );
}
