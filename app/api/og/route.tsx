import { ImageResponse } from "@vercel/og";
import { ogImageSchema } from "@/lib/validations/og";
import { auth } from "@/auth";

export const runtime = "edge"; // Edge runtime required by @vercel/og

const interRegularPromise = fetch(
  new URL("../../../assets/fonts/Inter-Regular.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

const interBoldPromise = fetch(
  new URL("../../../assets/fonts/CalSans-SemiBold.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const fontRegular = await interRegularPromise;
    const fontBold = await interBoldPromise;

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
          tw="flex relative flex-col p-12 w-full h-full items-start"
          style={{
            color: paint,
            background:
              values.mode === "dark"
                ? "linear-gradient(90deg, #000 0%, #111 100%)"
                : "white",
          }}
        >
          <div
            tw="text-5xl"
            style={{
              fontFamily: "Cal Sans",
              fontWeight: "normal",
              position: "relative",
              background: "linear-gradient(90deg, #6366f1, #a855f7 80%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Next Template
          </div>

          <div tw="flex flex-col flex-1 py-16">
            <div
              tw="flex text-xl uppercase font-bold tracking-tight"
              style={{ fontFamily: "Inter", fontWeight: "normal" }}
            >
              {values.type}
            </div>

            <div
              tw="flex leading-[1.15] text-[80px] font-bold"
              style={{
                fontFamily: "Cal Sans",
                fontWeight: "bold",
                marginLeft: "-3px",
                fontSize,
              }}
            >
              {heading}
            </div>
          </div>

          {/* Footer with GitHub */}
          <div tw="flex items-center w-full justify-between">
            <div
              tw="flex items-center text-xl"
              style={{ fontFamily: "Inter", fontWeight: "normal" }}
            >
              <img
                alt="avatar"
                width="65"
                src={`https://github.com/${githubName}.png`}
                style={{ borderRadius: 128 }}
              />
              <div tw="flex flex-col" style={{ marginLeft: "15px" }}>
                <div tw="text-[22px]" style={{ fontFamily: "Cal Sans" }}>
                  {githubName}
                </div>
                <div>Open Source Designer</div>
              </div>
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
    console.error("OG Image generation error:", error);
    return new Response("Failed to generate image", { status: 500 });
  }
}
