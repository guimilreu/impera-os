import { Manrope } from "next/font/google"

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
})

export default function LoginLayout({ children }) {
  return (
    <div className={manrope.className}>
      {children}
    </div>
  )
}

