import { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
    title: "Terminal | Namra Maniar",
    description:
        "Interactive terminal interface to explore Namra Maniar's portfolio, projects, and skills.",
}

export default function TerminalLayout({ children }: { children: ReactNode }) {
    return children
}
