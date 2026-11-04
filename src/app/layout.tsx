import CustomToaster from "@/components/CustomToaster";
// import "./globals.css";
import GlobalStyles from "@/styles/global-styles";
import type { Metadata } from "next";
import StyledComponentsRegistry from "@/lib/registry";
import "@/styles/fonts.css";
import localFont from "next/font/local";

const pretendard = localFont({
  src: "../fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
});

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "오디오가이 유통시스템",
  description: "",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${pretendard.variable} antialiased`}>
        <StyledComponentsRegistry>
          <GlobalStyles />
          {children}
          <CustomToaster />
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
