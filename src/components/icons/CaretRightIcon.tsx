import { SVGProps } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
`;

export default function CaretRightIcon({
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
          d="M17.2687 11.2434C17.8571 11.6397 17.8571 12.5058 17.2687 12.9022L8.80866 18.6006C8.14443 19.048 7.25 18.5721 7.25 17.7712L7.25 6.3743C7.25 5.57344 8.14443 5.0975 8.80866 5.54491L17.2687 11.2434Z"
          fill={color}
        />
      </svg>
    </Container>
  );
}
