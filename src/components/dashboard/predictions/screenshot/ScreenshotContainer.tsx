import { ReactNode } from "react";

interface ScreenshotContainerProps {
  children: ReactNode;
}

export function ScreenshotContainer({ children }: ScreenshotContainerProps) {
  const containerStyle: React.CSSProperties = {
    position: "absolute",
    left: "-9999px",
    padding: "32px",
    width: "400px",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "2px solid #F97316",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    background: "linear-gradient(to bottom right, #FFF7ED, #FFFFFF)"
  };

  return <div style={containerStyle}>{children}</div>;
}