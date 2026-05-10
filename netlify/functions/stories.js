import { parse } from "node-html-parser";

const teddy_stories = [
  "https://gemini.google.com/share/d8393171d6f6",
  "https://gemini.google.com/share/b957fdbae96e",
  "https://gemini.google.com/share/5ffcd776aa12",
  "https://gemini.google.com/share/de9489700602",
  "https://gemini.google.com/share/b0b09c0171ae",
  "https://gemini.google.com/share/8dabdd2e53af",
  "https://gemini.google.com/share/7b10997045dc",
  "https://gemini.google.com/share/bb5bb1f64e6b",
  "https://gemini.google.com/share/9bd729678d20",
  "https://gemini.google.com/share/1c6fc901758c",
  "https://gemini.google.com/share/8076577f7906",
  "https://gemini.google.com/share/ce4b3b29f785",
  "https://gemini.google.com/share/1989192e706f",
  "https://gemini.google.com/share/7399b0858b1e",
  "https://gemini.google.com/share/8ef7507fd14b",
  "https://gemini.google.com/share/30d769843c1b",
  "https://gemini.google.com/share/65bfb910d214",
  "https://gemini.google.com/share/1dd1c1203168",
  "https://gemini.google.com/share/4577dd967510",
  "https://gemini.google.com/share/9313b3594279",
  "https://gemini.google.com/share/c8d74bc38cab",
  "https://gemini.google.com/share/7e958e521350",
  "https://gemini.google.com/share/fec69a867acb",
  "https://gemini.google.com/share/1fb13676482e",
  "https://gemini.google.com/share/a028f3ed7600",
  "https://gemini.google.com/share/3b7c0b885900",
  "https://gemini.google.com/share/737c70d323a5",
  "https://gemini.google.com/share/e7d91f4ff531"
];

async function fetchOGData(url) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      return { url, title: url, description: "", image: "" };
    }

    const html = await response.text();
    const root = parse(html);

    const getMeta = (property) => {
      const el =
        root.querySelector(`meta[property="${property}"]`) ||
        root.querySelector(`meta[name="${property}"]`);
      return el ? el.getAttribute("content") || "" : "";
    };

    const title =
      getMeta("og:title") ||
      (root.querySelector("title")
        ? root.querySelector("title").text
        : "") ||
      url;
    const description = getMeta("og:description") || getMeta("description");
    const image = getMeta("og:image");

    return { url, title, description, image };
  } catch {
    return { url, title: url, description: "", image: "" };
  }
}

export default async (request) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "0", 10);
  const limit = parseInt(url.searchParams.get("limit") || "50", 10);

  const start = page * limit;
  const end = start + limit;
  const slice = teddy_stories.slice(start, end);

  const stories = await Promise.all(slice.map(fetchOGData));

  return new Response(
    JSON.stringify({
      stories,
      hasMore: end < teddy_stories.length,
      total: teddy_stories.length,
    }),
    {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
};
