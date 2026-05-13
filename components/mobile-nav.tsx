"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, Terminal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnchorLink } from "@/components/anchor-link"

const navItems = [
    { href: "/cv.html", label: "Resume", external: false },
    { href: "#experience", label: "Experience" },
    { href: "#skills", label: "Skills" },
    { href: "#projects", label: "Projects" },
    { href: "#open-source", label: "Open Source" },
]

export function MobileNav() {
    const [isOpen, setIsOpen] = React.useState(false)

    // Close menu on escape key
    React.useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false)
        }
        if (isOpen) {
            window.addEventListener("keydown", handleEscape)
            // Prevent body scroll when menu is open
            document.body.style.overflow = "hidden"
        }
        return () => {
            window.removeEventListener("keydown", handleEscape)
            document.body.style.overflow = ""
        }
    }, [isOpen])

    return (
        <div className="sm:hidden">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
            >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 top-[57px] z-40 bg-background/80 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                        aria-hidden="true"
                    />

                    {/* Menu */}
                    <nav
                        className="fixed inset-x-0 top-[57px] z-50 border-b bg-background p-4"
                        role="navigation"
                        aria-label="Mobile navigation"
                    >
                        <ul className="flex flex-col gap-4">
                            {navItems.map((item) => (
                                <li key={item.href}>
                                    {item.external ? (
                                        <a
                                            href={item.href}
                                            className="block py-2 text-lg text-muted-foreground hover:text-foreground"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {item.label}
                                        </a>
                                    ) : (
                                        <AnchorLink
                                            href={item.href}
                                            className="block py-2 text-lg text-muted-foreground hover:text-foreground"
                                            onNavigated={() => setIsOpen(false)}
                                        >
                                            {item.label}
                                        </AnchorLink>
                                    )}
                                </li>
                            ))}
                            <li>
                                <Link
                                    href="/terminal"
                                    className="flex items-center gap-2 py-2 text-lg text-emerald-600 hover:text-emerald-700"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Terminal className="h-5 w-5" />
                                    Terminal
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </>
            )}
        </div>
    )
}
