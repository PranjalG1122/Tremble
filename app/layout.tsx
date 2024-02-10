import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { Slide, ToastContainer } from "react-toastify";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tremble | Secure Password Manager",
  description: "Tremble is a secure password manager.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={
          inter.className +
          " bg-background-700 text-text-50 min-h-screen w-screen flex flex-col items-center flex-grow px-2"
        }
      >
        <Navbar />
        <div className="min-h-full flex flex-grow w-full items-center justify-center">
          {children}
        </div>
        <Footer />
        <ToastContainer
          draggable={false}
          hideProgressBar={true}
          newestOnTop={true}
          theme={"colored"}
          autoClose={3000}
          pauseOnFocusLoss={true}
          limit={3}
          pauseOnHover={true}
          position="top-right"
          transition={Slide}
          icon={false}
        />
      </body>
    </html>
  );
}
