import { Manrope } from "next/font/google"
import { DashboardLayoutClient } from "./DashboardLayoutClient"

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
})

export default function DashboardLayout({ children }) {
  return (
    <div className={manrope.className}>
      <DashboardLayoutClient>
        {children}
      </DashboardLayoutClient>
    </div>
  )
}
