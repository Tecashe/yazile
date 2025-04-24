import type React from "react";

interface YazilLogoProps {
  width?: number;
  height?: number;
  color?: string;
}

const YazilLogo: React.FC<YazilLogoProps> = ({
  width = 120,
  height = 120,
  color = "#ffffff", // Used only if paths are color-matched
}) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 739 607"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 120,150 L 200,40 L 280,150 L 240,220 L 200,160 L 160,220 Z"
          fill={color}
        />
        <text x="300" y="200" fill={color} fontSize="80" fontFamily="Arial" fontWeight="bold">
          AZIL
        </text>
        <text x="300" y="270" fill={color} fontSize="30" fontFamily="Arial">
          ENGAGE AUTOMATE GROW
        </text>
      </svg>
    </div>
  );
};

export default YazilLogo;
