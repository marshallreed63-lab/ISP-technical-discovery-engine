import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import ispCss from "../isp.css?url";
import { ISP_MARKUP } from "@/lib/isp-markup";

const TITLE = "ISP Intelligence Engine | Research to Technical Handoff";
const DESC =
  "Independent, non-affiliated prototype for ISP account research, evidence-linked AAA/RADIUS discovery and preliminary qualification tailored to InkBridge Networks.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "stylesheet", href: ispCss }],
  }),
  component: Index,
});

function Index() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current || ref.current.dataset["ready"]) return;
    ref.current.dataset["ready"] = "1";
    import("@/lib/isp-app").then((m) => m.initIspApp());
  }, []);
  return <div ref={ref} dangerouslySetInnerHTML={{ __html: ISP_MARKUP }} />;
}
