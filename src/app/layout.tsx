import type { Metadata, Viewport } from "next";
import { Fraunces, Noto_Sans_Sinhala } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

const body = Noto_Sans_Sinhala({
  variable: "--font-body",
  subsets: ["sinhala"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ඩිජිටල් සන්නිවේදනය සහ ඉදිරිපත් කිරීමේ කුසලතා | වන සංරක්ෂණය",
  description:
    "වන සංරක්ෂණ දෙපාර්තමේන්තුවේ නිලධාරීන් සඳහා පුහුණු ප්‍රශ්නාවලිය.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1d7a45",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="si"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="relative flex min-h-full flex-col">{children}</body>
    </html>
  );
}
