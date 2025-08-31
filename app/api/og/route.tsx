// app/api/og/route.ts
import { ImageResponse } from "@vercel/og";
import { ogImageSchema } from "@/lib/validations/og";
import { auth } from "@/auth";

export const runtime = "edge";

// Load fonts using fetch (Edge-compatible)
const interRegular = fetch(
  new URL("../../../assets/fonts/Inter-Regular.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

const interBold = fetch(
  new URL("../../../assets/fonts/CalSans-SemiBold.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

export async function GET(req: Request) {
  try {
    // ✅ Call auth inside the function
    const session = await auth();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const fontRegular = await interRegular;
    const fontBold = await interBold;

    const url = new URL(req.url);
    const values = ogImageSchema.parse(Object.fromEntries(url.searchParams));

    const heading =
      values.heading.length > 80
        ? `${values.heading.substring(0, 100)}...`
        : values.heading;

    const paint = values.mode === "dark" ? "#fff" : "#000";
    const fontSize = heading.length > 80 ? "60px" : "80px";

    const githubName = "mickasmt";

    return new ImageResponse(
      (
        <div
          style={{
            color: paint,
            background:
              values.mode === "dark"
                ? "linear-gradient(90deg, #000 0%, #111 100%)"
                : "white",
            display: "flex",
            flexDirection: "column",
            padding: "48px",
            width: "100%",
            height: "100%",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              fontFamily: "Cal Sans",
              fontWeight: "normal",
              fontSize: "64px",
              background: "linear-gradient(90deg, #6366f1, #a855f7 80%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Next Template
          </div>

          <div style={{ flex: 1, paddingTop: "64px", display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontFamily: "Inter",
                fontWeight: "bold",
                fontSize: "20px",
                textTransform: "uppercase",
              }}
            >
              {values.type}
            </div>

            <div
              style={{
                fontFamily: "Cal Sans",
                fontWeight: "bold",
                lineHeight: 1.15,
                fontSize,
                marginLeft: "-3px",
              }}
            >
              {heading}
            </div>
          </div>

          <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", fontFamily: "Inter", fontWeight: "normal" }}>
              <img
                alt="avatar"
                width={65}
                src={`https://github.com/${githubName}.png`}
                style={{ borderRadius: "50%" }}
              />
              <div style={{ display: "flex", flexDirection: "column", marginLeft: "15px" }}>
                <div style={{ fontFamily: "Cal Sans", fontSize: "22px" }}>{githubName}</div>
                <div>Open Source Designer</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", fontFamily: "Inter", fontWeight: "normal" }}>
              <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                <path
                  d="M30 44v-8a9.6 9.6 0 0 0-2-7c6 0 12-4 12-11 .16-2.5-.54-4.96-2-7 .56-2.3.56-4.7 0-7 0 0-2 0-6 3-5.28-1-10.72-1-16 0-4-3-6-3-6-3-.6 2.3-.6 4.7 0 7a10.806 10.806 0 0 0-2 7c0 7 6 11 12 11a9.43 9.43 0 0 0-1.7 3.3c-.34 1.2-.44 2.46-.3 3.7v8"
                  stroke={paint}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18 36c-9.02 4-10-4-14-4"
                  stroke={paint}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div style={{ marginLeft: "8px" }}>github.com/mickasmt/next-auth-roles-template</div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          { name: "Inter", data: fontRegular, weight: 400, style: "normal" },
          { name: "Cal Sans", data: fontBold, weight: 700, style: "normal" },
        ],
      }
    );
  } catch (error) {
    console.error("OG generation error:", error);
    return new Response("Failed to generate image", { status: 500 });
  }
}
