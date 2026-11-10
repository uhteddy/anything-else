import "./globals.css";
import Navbar from "@/lib/components/Navbar";

export default function RootLayout({ children, }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
