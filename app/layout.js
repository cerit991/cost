import { Inter } from "next/font/google";
import "./globals.css";
import { BiSolidFoodMenu } from "react-icons/bi";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Restaurant Maliyet/Cost Hesaplama",
  description: "Restaurant maliyet ve menü yönetim sistemi",
  icons: {
    icon: {
      url: "data:image/svg+xml;base64," + Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          ${BiSolidFoodMenu({}).props.children}
        </svg>`
      ).toString('base64'),
      type: "image/svg+xml",
    }
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="icon" 
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%232563eb'><path d='${BiSolidFoodMenu({}).props.children[0].props.d}'/></svg>"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
