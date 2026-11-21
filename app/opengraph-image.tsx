import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"
import { content } from "@/lib/content"
import { SITE_URL } from "@/lib/site"

// Statically generated at build time (no request-time data is used).
export const alt = `${content.fullName} — Backend Software Engineer`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OpengraphImage() {
  const photo = await readFile(join(process.cwd(), "public/hero_pic_3.png"))
  const photoSrc = `data:image/png;base64,${photo.toString("base64")}`
  const host = new URL(SITE_URL).host

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0a0a0a",
          color: "#fafafa",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- rendered by Satori, not the browser */}
        <img
          src={photoSrc}
          alt=""
          width={420}
          height={630}
          style={{ objectFit: "cover", objectPosition: "center 20%" }}
        />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 64px",
          }}
        >
          <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: -2 }}>{content.fullName}</div>
          <div style={{ marginTop: 16, fontSize: 34, color: "#34d399" }}>Backend Software Engineer</div>
          <div style={{ marginTop: 28, fontSize: 26, lineHeight: 1.4, color: "#a3a3a3" }}>
            {content.skills.coreStack.join(" · ")} — distributed systems, security data pipelines,
            observability.
          </div>
          <div style={{ marginTop: 48, fontSize: 24, color: "#737373" }}>{host}</div>
        </div>
      </div>
    ),
    size,
  )
}
