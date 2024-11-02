import styled, { css, keyframes } from "styled-components";
import { space } from "styled-system";

interface SvgStyleProps {
  color?: string;
  width?: string;
  xmlns?: string;
  $spin?: number;
}

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const spinStyle = css`
    animation: ${rotate} 2s linear infinite;
`;

const Svg = styled.svg<SvgStyleProps>`
    align-self: center; // Safari fix
    flex-shrink: 0;
    ${space}

    ${({ $spin }) => {
        return $spin && spinStyle;
    }}
`;

Svg.defaultProps = {
    color: "text",
    width: "20px",
    xmlns: "http://www.w3.org/2000/svg",
    $spin: 0
};

export default Svg;
