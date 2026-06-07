/* =============================================================================
   SITE CONFIG — ADVERTISE TOKYO  (template boundary)
   =============================================================================
   Sister title #3, derived from the AITECH TOKYO template per AGENTS.md.

   What changed vs. AITECH TOKYO (kept intentionally minimal):
     1. `brand`     — re-skinned to ADVERTISE TOKYO; subject is "the global
                      advertising & marketing conversation, read through a
                      Tokyo marketer's lens, every morning."
     2. `brand.cta` — REMOVED. No "Submit Tool" equivalent (yet).
     3. `layout`    — kept "directory" mode (same as AITECH).
     4. `categories`— marketing taxonomy (creative / adtech / brand / media).
                      Same `CategoryDef` shape, same `as const` derivation —
                      `CategoryKey` updates automatically.
     5. `pipeline.sources` — AdAge, Adweek, MarTech.org, Marketing Brew.
                      Per-source `framing` notes preserved.
     6. `pipeline.voice` — Tokyo marketer's register (≈ WIRED 日本版 × Senior
                      Tokyo CMO × Quartz briefing), with `structuredFields`:
                        tagline / whoForWhat / vsJapanPlay / tokyoTake
     7. `pipeline.voice.closingBlock.outputKey` — `tokyo_take`, same as AITECH
                      so the cron / renderer path keeps working unchanged.
     8. `cron` — 04:30 JST (between AITECH 03:00 and ARTEMIS 06:00, well
                      outside GitHub Actions on-the-hour deprioritization).

   Code-level changes required outside this file: none (per AGENTS.md the
   template boundary lives at this file plus optional affiliate.ts overlay).
   ========================================================================== */

export type Lang = "en" | "ja";
export type Bilingual<T = string> = { en: T; ja: T };

/* ---------------------------------------------------------------------------
   Category definition — identical shape to AITECH TOKYO so types & helpers
   in src/lib/i18n.ts and src/site.config.ts derivations work unchanged.
   ------------------------------------------------------------------------- */
export type CategoryDef = {
  key: string;
  name: Bilingual;
  /** Definition copy injected into the LLM system prompt so it picks
   *  the right category at edit time. */
  definitionForLlm: string;
  /** Visual cover image pool — Unsplash photo IDs only (no full URL).
   *  Acts as a fallback when the source RSS has no image. Aim for at least
   *  8 IDs per category. NOTE: these were inherited from the AITECH template
   *  and lean toward neutral / abstract / tech aesthetics — verify with
   *  `bash scripts/verify-cover-pool.sh` and replace with marketing-themed
   *  imagery once the site is bedded in. */
  coverPool: { id: string; tone: string }[];
  /** Fallback category keys (in preference order) when the home pool is exhausted. */
  fallback: string[];
};

/* ---------------------------------------------------------------------------
   Source definition (unchanged from AITECH TOKYO).
   ------------------------------------------------------------------------- */
export type SourceDef = {
  name: string;
  url: string;
  parse: "rss" | "atom";
  /** Must match a categories[].key. */
  category: string;
  /** Optional relevance filter — applied to title+summary. */
  filter?: RegExp;
  /** Single-sentence framing note injected per-source into the LLM prompt. */
  framing?: string;
};

/* ---------------------------------------------------------------------------
   Structured-field definition (unchanged from AITECH TOKYO).
   ------------------------------------------------------------------------- */
export type StructuredFieldType = "line" | "paragraph" | "block";
export type StructuredFieldRole = "headline" | "body" | "footnote" | "verdict";
export type StructuredFieldDef = {
  key: string;
  label: Bilingual;
  type: StructuredFieldType;
  charLimit?: Partial<Record<Lang, number>>;
  display: { role: StructuredFieldRole; onCard: boolean; onDetail: boolean };
  descriptionForLlm: string;
};

/* ---------------------------------------------------------------------------
   Affiliate types — same shape as AITECH so AffiliateCTA / data layer work.
   ------------------------------------------------------------------------- */
export type AffiliateNetwork = "amazon" | "partner" | "asp" | "other";
export type AffiliateLink = {
  url: string;
  network: AffiliateNetwork;
  label?: Bilingual<string>;
  note?: Bilingual<string>;
};

/* ---------------------------------------------------------------------------
   The configuration object itself.
   ------------------------------------------------------------------------- */
export const siteConfig = {
  /* ------------------------------------------------------------------ BRAND */
  brand: {
    name: "ADVERTISE TOKYO",
    wordmark: "Advertise Tokyo",
    /** Canonical site URL — vercel.app subdomain until the custom domain
     *  arrives (swap to https://www.advertise-tokyo.com — or whatever final
     *  domain — once registered, and update Vercel NEXT_PUBLIC_SITE_URL). */
    siteUrl: "https://advertise-tokyo.vercel.app",
    subject: {
      en: "the world's cutting-edge marketing — delivered to every marketer in Japan, in both English and Japanese, every morning, for free",
      ja: "世界の最先端マーケティングを、東京にいながら実感できる無料のバイリンガル WEB メディア。すべての日本のマーケッターへ毎朝お届けします"
    },
    city: { en: "Tokyo", ja: "東京" },
    keywords: [
      "advertising",
      "marketing",
      "ad tech",
      "martech",
      "branding",
      "CMO",
      "media planning",
      "performance marketing",
      "programmatic",
      "creative",
      "Cannes Lions",
      "AdAge",
      "Adweek",
      "Tokyo",
      "Japan",
      "東京",
      "広告",
      "マーケティング",
      "ブランド",
      "アドテック"
    ],
    /** Issue counter origin — masthead reads "Vol. xx — YYYY". Start in
     *  June 2026 so Vol. 01 corresponds to the launch month. */
    issueBase: { year: 2026, month: 6 },

    /** Primary CTA — surfaced in Header (utility row), Footer, and the home
     *  page tail. Used here as the "submit your company / get covered" entry
     *  point for Japanese marketing / ad-tech / AI firms that want to be
     *  spotlighted alongside the global feed. Targets `/about#contact` so
     *  the contact context is one page, indexable, and doesn't require a
     *  separate route. */
    cta: {
      label: { en: "Submit Your Company", ja: "企業情報を掲載する" },
      href: "/about#contact",
      hint: {
        en: "Free for every marketer in Japan — and your company can be featured alongside the global feed.",
        ja: "日本のマーケッターに無料で。海外フィードと並べて、あなたの会社の情報も掲載できます。"
      }
    }
  },

  /* ------------------------------------------------------------------ LAYOUT
     Inherited from AITECH TOKYO — directory mode, 4-up grid, editor's picks
     row above the main grid. */
  layout: {
    mode: "directory" as const,
    directory: {
      columns: { base: 1, sm: 2, md: 3, lg: 4 },
      showEditorsPicks: true,
      showSectionRule: true,
      pageSize: 24,
      /** While the index is still small, render real RSS-derived covers (and
       *  the tone tile fallback). Flip to TRUE once the grid is dense with
       *  campaign-specific imagery and the Unsplash fallbacks start to look
       *  off-tone. */
      preferToneTileOverStockCover: false
    }
  },

  /* ----------------------------------------------------------------- CHROME */
  chrome: {
    tagline: {
      en: "The world's cutting-edge marketing, delivered to every marketer in Japan for free. Bilingual, every morning, with a Tokyo perspective on the global feed — and a spotlight on Japan's own marketing, ad-tech and AI players.",
      ja: "世界の最先端マーケティングを、東京から無料で。毎朝バイリンガルで、海外の動向に東京視点を加えて読み解き、さらに日本のマーケティング・アドテク・AI 企業の最新情報もキュレーションしてお届けします。"
    },
    legal: {
      en: "© 2026 ADVERTISE TOKYO. All rights reserved.",
      ja: "© 2026 ADVERTISE TOKYO. 全著作権所有。"
    },
    nav: {
      home: { en: "Home", ja: "ホーム" },
      about: { en: "About", ja: "ABOUT" },
      subscribe: { en: "Newsletter", ja: "ニュースレター" }
    },
    ui: {
      readMore: { en: "Open", ja: "開く" },
      by: { en: "Via", ja: "経由" },
      minRead: { en: "min read", ja: "分で読了" },
      featured: { en: "Editor's Picks", ja: "編集部ピック" },
      latest: { en: "Recently Indexed", ja: "最近インデックスされた記事" },
      related: { en: "Related Stories", ja: "関連記事" },
      backToHome: { en: "Back to grid", ja: "グリッドへ戻る" },
      issue: { en: "Index", ja: "INDEX" },
      moreIn: { en: "More in", ja: "もっと見る:" }
    },
    newsletter: {
      eyebrow: { en: "The Briefing", ja: "ブリーフィング" },
      heading: {
        en: "World marketing, delivered to Tokyo. Free, weekly, in Japanese.",
        ja: "世界のマーケティングを、東京へ。\n毎週、日本語の無料ブリーフィング。"
      },
      lede: {
        en: "Each Friday: the five global marketing stories every Japanese marketer should know — translated, read through a Tokyo lens, and paired with the Japan-side moves worth tracking this week. Free, no spam, unsubscribe anytime.",
        ja: "毎週金曜。日本のマーケッターが今週知っておくべき海外マーケティングニュースを 5 本厳選し、日本語に翻訳して東京視点で解説。並行して、日本国内で追っておくべき動きも紹介します。無料、スパムなし、いつでも解除可能。"
      },
      placeholder: { en: "Your email address", ja: "メールアドレス" },
      cta: { en: "Subscribe", ja: "購読する" },
      disclaimer: {
        en: "We respect your inbox. Unsubscribe anytime.",
        ja: "受信箱を尊重します。いつでも解除可能。"
      }
    },
    footer: {
      copy: {
        en: "ADVERTISE TOKYO is a free bilingual media for every marketer in Japan. Each morning we translate the world's cutting-edge marketing news — from AdAge, Adweek, MarTech.org and Marketing Brew — into Japanese, add a Tokyo perspective, and spotlight the Japanese marketing, ad-tech and AI companies shaping the local landscape. If your company would like to be covered, please get in touch.",
        ja: "ADVERTISE TOKYO は、すべての日本のマーケッターのための無料バイリンガル WEB メディアです。毎朝、世界の最先端マーケティング情報 — AdAge、Adweek、MarTech.org、Marketing Brew — を日本語に翻訳し、東京視点を加えてお届けします。さらに、日本のマーケティング・アドテク・AI 企業の最新情報もキュレーションして紹介。掲載をご希望の企業様はお気軽にご連絡ください。"
      },
      strapline: "Tokyo · Bilingual · Free for Marketers"
    },
    languageToggle: { en: "JA", ja: "EN" },
    notFound: {
      title: { en: "404 — not in the index.", ja: "404 — インデックスにありません。" },
      lede: {
        en: "Either the story was pulled, the URL was malformed, or the index hasn't caught up yet.",
        ja: "記事が削除されたか、URLが正しくないか、まだインデックスに反映されていません。"
      },
      back: { en: "Back to the grid", ja: "グリッドへ戻る" }
    },
    emptyState: {
      eyebrow: { en: "Indexing", ja: "インデックス中" },
      heading: {
        en: "The first ADVERTISE TOKYO index is being built.",
        ja: "ADVERTISE TOKYO の最初のインデックスを\n組み立てています。"
      },
      lede: {
        en: "Each morning, our pipeline pulls the world's cutting-edge marketing news — from AdAge, Adweek, MarTech.org and Marketing Brew — translates the items worth knowing into Japanese, adds a Tokyo perspective, and spotlights Japanese marketing, ad-tech and AI companies alongside the global feed. Free for every marketer in Japan. The first index will appear here as soon as the next cycle completes.",
        ja: "ADVERTISE TOKYO のパイプラインは毎朝、世界の最先端マーケティング情報 — AdAge、Adweek、MarTech.org、Marketing Brew — を取得し、知っておくべき一次情報を日本語に翻訳して東京視点で解説します。世界の動向と並べて、日本のマーケティング・アドテク・AI 企業の最新情報もキュレーションして紹介。すべての日本のマーケッターに、無料で。次回サイクルが完了次第、最初のインデックスが表示されます。"
      },
      nextDispatch: {
        en: "Next index: 04:30 JST",
        ja: "次回インデックス：日本時間 朝4時半"
      }
    }
  },

  /* ------------------------------------------------------------------ ABOUT */
  about: {
    headline: {
      en: "The world's cutting-edge marketing, in Tokyo.",
      ja: "世界の最先端マーケティングを、東京で。"
    },
    lede: {
      en: "ADVERTISE TOKYO is a free bilingual web media for every marketer in Japan. Each morning, we translate the world's cutting-edge marketing news into Japanese, read it through a Tokyo perspective, and spotlight Japanese marketing, ad-tech and AI companies alongside the global feed. No paywall, no signup, no agency relationship required — just the global marketing conversation, made available in Tokyo, in both languages, every morning.",
      ja: "ADVERTISE TOKYO は、すべての日本のマーケッターのための無料バイリンガル WEB メディアです。毎朝、世界の最先端マーケティング情報を日本語に翻訳し、東京視点で読み解きます。さらに、世界の動向と並べて、日本のマーケティング・アドテク・AI 企業の最新情報もキュレーションして紹介。ペイウォールなし、登録不要、代理店契約も不要。世界のマーケティングの会話を、東京にいながら、両方の言語で、毎朝お届けします。"
    },
    blocks: [
      {
        eyebrow: { en: "OUR PROMISE", ja: "私たちの約束" },
        heading: {
          en: "Free for every marketer in Japan.",
          ja: "すべての日本のマーケッターに、無料で。"
        },
        body: {
          en: "Most premium marketing intelligence in Japan sits behind a paywall, a corporate subscription, or an agency relationship. ADVERTISE TOKYO doesn't. Every morning, the world's cutting-edge marketing news gets translated into Japanese and posted here — free, bilingual, no signup required. A young creative at a JTC, a solo growth marketer at a Roppongi startup, a media planner at 電通 or 博報堂, a brand manager at an FMCG — same access, same morning, same depth.",
          ja: "日本の優れたマーケティング情報の多くは、ペイウォール、企業契約、代理店との関係の中にしか流れていない。ADVERTISE TOKYO はそうではない。毎朝、世界の最先端マーケティング情報を日本語に翻訳して、ここに無料で並べる。バイリンガル、登録不要。JTC の若手クリエイティブも、六本木のスタートアップのソロ・グロースマーケッターも、電通や博報堂のメディアプランナーも、消費財ブランドのブランドマネージャーも、同じ朝、同じ情報、同じ深さでアクセスできる。"
        }
      },
      {
        eyebrow: { en: "OUR LENS", ja: "編集の視点" },
        heading: {
          en: "Tokyo, reading the world.",
          ja: "東京から、世界を読む。"
        },
        body: {
          en: "Translation alone doesn't bridge the gap. The world's marketing is written for US holdcos, European brands, and Silicon Valley audiences. ADVERTISE TOKYO adds the Tokyo layer machine translation can't: which campaigns fit a Japanese brief, which platforms actually serve Japan, which assumptions about audience or media don't translate, and which Japanese alternatives already solve the problem. Every entry gets the same four questions: what it actually is, who it's for, how it differs from the Japan play today, and the Tokyo Take.",
          ja: "翻訳だけではギャップは埋まらない。世界のマーケティングは、US ホールディングス、欧米ブランド、シリコンバレーのオーディエンスのために書かれている。ADVERTISE TOKYO は、機械翻訳が届けない東京視点を加える — どのキャンペーンが日本のブリーフに合うのか、どのプラットフォームが日本で本当に機能するのか、どのオーディエンス・メディア前提が日本に通じないのか、すでに日本のどのプレイヤーがその問題を解いているのか。毎エントリー、同じ 4 つの問い — 本当のところそれが何なのか、誰のためなのか、現在の日本の手とどう違うのか、そして東京視点。"
        }
      },
      {
        eyebrow: { en: "OUR SPOTLIGHT", ja: "国内スポットライト" },
        heading: {
          en: "Japan's own marketing, ad-tech, and AI — covered alongside.",
          ja: "日本のマーケティング・アドテク・AI 企業も、並べて紹介。"
        },
        body: {
          en: "The global feed is half the story. Japan has its own world-class marketing, ad-tech, and AI players — from 電通・博報堂 to サイバーエージェント, from PLAUD to Sakana AI, from Mercari's experimental ad units to LINEヤフー's identity stack. ADVERTISE TOKYO covers them in the same depth and on the same morning. If your company is shipping something Japanese marketers should know about — a launched product, a new agency capability, a research drop — we'd like to hear from you. Use the Contact section below.",
          ja: "海外フィードは半分の話に過ぎない。日本にも、世界水準のマーケティング・アドテク・AI 企業がある — 電通・博報堂、サイバーエージェント、PLAUD、Sakana AI、Mercari の実験的な広告枠、LINE ヤフーのアイデンティティ・スタックまで。ADVERTISE TOKYO は、それらを同じ深さで、同じ朝に、並べて紹介する。日本のマーケッターが知っておくべきものをローンチしている企業の方 — 新プロダクト、新しい代理店ケイパビリティ、調査リリースなど — はぜひご連絡ください。下の Contact セクションからどうぞ。"
        }
      }
    ]
  },

  /* ------------------------------------------------------------- CATEGORIES
     Marketing taxonomy — 4 keys. coverPool IDs are inherited from the
     AITECH TOKYO template as neutral placeholders; replace with marketing-
     themed Unsplash IDs (color, type, studio, screens, store windows, etc.)
     once the site is bedded in.
     ---------------------------------------------------------------------- */
  categories: [
    {
      key: "creative",
      name: { en: "Creative", ja: "クリエイティブ" },
      definitionForLlm:
        "the creative product itself: launched campaigns, ads, copy, design systems, brand identity work, award-winning work (Cannes Lions, D&AD, One Show, ADC), creative-led platform stunts, and the craft conversations around them.",
      fallback: ["brand", "media"],
      coverPool: [
        { id: "1620712943543-bccf2f2c1ae9", tone: "#0d0d0f" },
        { id: "1677442136019-21780ecad995", tone: "#0c0d0f" },
        { id: "1655720828018-edd2daec9349", tone: "#0e0f12" },
        { id: "1684391938577-67c3e8b9c7a8", tone: "#0a0a0c" },
        { id: "1701978500311-7ddd0a30a64f", tone: "#101011" },
        { id: "1697577418970-95d99b5a55cf", tone: "#0c0c0e" },
        { id: "1672239497060-46b39e7e23c4", tone: "#0d0e10" },
        { id: "1717501218385-55bc3a95be94", tone: "#0a0a0a" },
        { id: "1620712943543-26fab76e6f5d", tone: "#0c0c0c" }
      ]
    },
    {
      key: "adtech",
      name: { en: "Ad Tech", ja: "アドテック" },
      definitionForLlm:
        "the marketing technology stack: DSPs, SSPs, programmatic buying, attribution platforms, AI-generated creative tools, identity / cookie / Privacy Sandbox developments, measurement, MMM, RMNs (retail media networks), CDPs and ad-data infrastructure. The reader is operations- or tech-side.",
      fallback: ["media", "brand"],
      coverPool: [
        { id: "1517694712202-14dd9538aa97", tone: "#0d0f12" },
        { id: "1555066931-4365d14bab8c", tone: "#0c0c0e" },
        { id: "1542831371-29b0f74f9713", tone: "#0e0e10" },
        { id: "1504639725590-34d0984388bd", tone: "#0b0b0d" },
        { id: "1517180102446-f3ece451e9d8", tone: "#0c0c0e" },
        { id: "1581291518857-4e27b48ff24e", tone: "#101012" },
        { id: "1593720213428-28a5b9e94613", tone: "#0d0d0f" },
        { id: "1531403009284-440f080d1e12", tone: "#08080a" }
      ]
    },
    {
      key: "brand",
      name: { en: "Brand", ja: "ブランド" },
      definitionForLlm:
        "brand strategy, CMO and executive moves, repositioning announcements, brand-architecture decisions, B2B/B2C brand-building debates, holdco politics (WPP, Omnicom / IPG, Publicis, Dentsu, Hakuhodo), agency M&A and CMO tenure stories.",
      fallback: ["creative", "media"],
      coverPool: [
        { id: "1593344484962-796055d4a3a4", tone: "#1a1a1a" },
        { id: "1606293459339-aa5d34a7b0e1", tone: "#0c0c0c" },
        { id: "1546435770-a3e426bf472b", tone: "#161616" },
        { id: "1518770660439-4636190af475", tone: "#0e0e0e" },
        { id: "1556656793-08538906a9f8", tone: "#0d0d0d" },
        { id: "1572569511254-d8f925fe2cbb", tone: "#121212" },
        { id: "1601445638532-3c6f6c3aa1d6", tone: "#0c0c0c" },
        { id: "1611532736597-de2d4265fba3", tone: "#0a0a0a" }
      ]
    },
    {
      key: "media",
      name: { en: "Media & Buying", ja: "メディア・媒体" },
      definitionForLlm:
        "media planning and buying: TV / CTV / streaming spend, social platforms (Meta, TikTok, X, YouTube, LINE, Snap), influencer and creator economy, attention economy, podcast / audio buying, OOH, sports / events sponsorship, audience behaviour and viewership reports.",
      fallback: ["adtech", "brand"],
      coverPool: [
        { id: "1611224923853-80b023f02d71", tone: "#101010" },
        { id: "1551434678-e076c223a692", tone: "#0a0a0c" },
        { id: "1559136555-9303baea8ebd", tone: "#0c0c0e" },
        { id: "1499951360447-b19be8fe80f5", tone: "#0a0a0c" },
        { id: "1486312338219-ce68d2c6f44d", tone: "#0d0d0f" },
        { id: "1551288049-bebda4e38f71", tone: "#0e0e10" },
        { id: "1454165804606-c3d57bc86b40", tone: "#0a0a0a" },
        { id: "1521737604893-d14cc237f11d", tone: "#0c0c0e" }
      ]
    }
  ] as const,

  /* ----------------------------------------------------------- LEGACY MAP
     Inherited keys + AITECH legacy. Populated to keep cross-template tests
     happy. */
  legacyCategoryMap: {
    "ai-tools": "adtech",
    "llm-tools": "adtech",
    productivity: "media",
    hardware: "adtech",
    "dev-tools": "adtech",
    workflow: "media",
    "ai-gadgets": "adtech"
  } as Record<string, string>,

  /* ----------------------------------------------------------------- PIPELINE
     Sources + voice + image-host allowlist. The cron-publisher reads this
     verbatim. Sources for ADVERTISE TOKYO match the brief: AdAge, Adweek,
     MarTech.org, Marketing Brew.
     ---------------------------------------------------------------------- */
  pipeline: {
    relevanceFilters: {
      adsOrMarketing:
        /\b(ad\b|ads\b|advert\w*|campaign\w*|brand\w*|marketing|cmo|agenc\w*|creative|copywrit\w*|programmatic|dsp\b|ssp\b|cpm\b|cpa\b|cpc\b|media[- ]?bu\w*|cookie|privacy[- ]?sandbox|attribution|mmm\b|ctv\b|ott\b|influenc\w*|creator[- ]?econom\w*|tiktok|meta|facebook|instagram|youtube|line\b|snap\b|x\.com|twitter|cannes|adweek|adage|wpp|omnicom|publicis|dentsu|hakuhodo)\b/i
    },

    sources: [
      {
        name: "AdAge",
        url: "https://adage.com/rss.xml",
        parse: "rss",
        category: "brand",
        framing:
          "(industry trade — AdAge frames everything through US holdcos and brand-side decisions; the underlying story is usually who-moved-where and what budget is shifting, not the press-release angle)"
      },
      {
        name: "Adweek",
        url: "https://www.adweek.com/feed/",
        parse: "rss",
        category: "creative",
        framing:
          "(creative trade — Adweek leans into campaign work and agency creative; read past the launch hype to find the actual craft decision or strategic shift the piece is documenting)"
      },
      {
        name: "MarTech.org",
        url: "https://martech.org/feed/",
        parse: "rss",
        category: "adtech",
        framing:
          "(martech trade — vendor-funded ecosystem coverage; treat platform announcements skeptically and isolate what actually changes for an operator buying or running these stacks)"
      },
      {
        name: "Marketing Brew",
        url: "https://www.marketingbrew.com/feed",
        parse: "rss",
        category: "brand",
        framing:
          "(newsletter-style roundup — Marketing Brew's tone is conversational and US-centric; mine for the underlying story not the witty intro, and ask 'does the trend cross the Pacific'?)"
      }
      // Optional 5th source — uncomment once steady state is reached to
      // strengthen the `media` category coverage.
      // ,{
      //   name: "Digiday",
      //   url: "https://digiday.com/feed/",
      //   parse: "rss",
      //   category: "media",
      //   framing:
      //     "(media-buying trade — Digiday is the operator's beat: trading desks, RMNs, attention economy; useful for media-side angles the brand-trade misses)"
      // }
    ] as SourceDef[],

    /** Image hosts the deployed `next/image` is allowed to render. Mirror in
     *  next.config.ts → images.remotePatterns. */
    allowedImageHosts: [
      // --- Unsplash (fallback covers) ---
      "images.unsplash.com",
      "source.unsplash.com",

      // --- AdAge / Crain ---
      "adage.com",
      "**.adage.com",
      "**.crain.com",
      "**.crainsdigital.com",

      // --- Adweek ---
      "**.adweek.com",
      "static.adweek.com",

      // --- MarTech / Third Door Media ---
      "martech.org",
      "**.martech.org",
      "**.thirddoor.com",

      // --- Marketing Brew / Morning Brew ---
      "**.marketingbrew.com",
      "**.morningbrew.com",
      "**.brewdaily.com",

      // --- Digiday (optional source) ---
      "digiday.com",
      "**.digiday.com",
      "**.digidaymedia.com",

      // --- WordPress-VIP CDN (used by many trade publishers) ---
      "**.wp.com",
      "**.wordpress.com",
      "**.wpengine.com",

      // --- Common publisher CDNs ---
      "**.medium.com",
      "miro.medium.com",
      "**.substackcdn.com",
      "substackcdn.com",
      "**.substack.com",
      "**.ghost.io",
      "**.ghostcdn.io",
      "**.cdn.ghost.io",
      "**.netlify.app",
      "**.vercel.app",
      "**.vercel-storage.com",

      // --- Generic CDN providers ---
      "**.cloudfront.net",
      "**.akamaized.net",
      "**.akamaihd.net",
      "**.fastly.net",
      "**.cdninstagram.com",
      "**.fbcdn.net",
      "**.twimg.com",
      "**.gstatic.com",
      "googleusercontent.com",
      "**.googleusercontent.com",
      "**.cloudinary.com",
      "res.cloudinary.com",
      "**.amazonaws.com",
      "s3.amazonaws.com"
    ],

    /* -------- VOICE -------- */
    voice: {
      premise:
        "ADVERTISE TOKYO, an independent bilingual (English / Japanese) directory that bridges the global advertising and marketing news cycle and Tokyo's marketer's reality — translating the global conversation into Japanese and adding the lens of a Tokyo brand and media desk.",
      toneOfVoice:
        "A fusion of *WIRED Japan*'s editorial confidence, the calm skepticism of a senior Tokyo CMO writing for their own team, and the cleanliness of *Quartz's* daily briefing voice: industry-fluent but not inside-baseball, opinionated yet never gossipy, allergic to press-release copy.\n- No exclamation marks. No 'revolutionize / disrupt / game-changing' verbs. No phrase that could appear on a holdco landing page.\n- Short declarative sentences. One slightly literary line per piece is allowed; do not perform it.\n- Treat agency M&A, CMO transitions, and 'first AI campaign to ...' claims as background, not as the story. The story is always what the brief, the buy, or the creative actually changes for a working marketer.\n- It is acceptable — encouraged — to say 'this is the same playbook Dentsu has run for ten years', 'the AI angle here is marketing veneer', 'the campaign won Cannes but the Japan market wouldn't run it', when it is true.\n- Cliché block-list (EN): 'groundbreaking', 'cutting-edge', 'next-generation', 'AI-powered', 'unleash', 'supercharge', 'transform your marketing', 'the future of advertising', 'paradigm shift', 'storytelling', 'authenticity at scale'.\n- Cliché block-list (JA): 「革新的」「次世代」「DX で変わる」「顧客体験を再定義」「ブランドの未来を再定義」「ゲームチェンジャー」「破壊的」「ストーリーテリング」「共創」「ブランドジャーニーを変える」.",
      framingQuestion:
        '"What does this global advertising / marketing story mean for a marketer working in Tokyo today — and would it actually change how they plan, brief, or buy media this quarter?"',
      framingExpansion:
        "Not 'this campaign is impressive'. Specifically: what concretely changes for a Tokyo-based marketer — a brand manager at a Japanese consumer brand, a media planner at a 電通 / 博報堂 / 国内独立系 agency, a startup head of growth in Roppongi, an in-house performance marketer at an EC brand, a CMO at a JTC — after reading this and acting on it? Does it shorten a brief? Does it open a media buy that wasn't previously available in Japan? Or — if the honest answer is 'nothing, this is a US-only play / Japan media doesn't carry this inventory / the consumer-behaviour assumption doesn't translate' — say that plainly.\n\nThe story is not interesting because advertising is involved. It is interesting only if a Tokyo marketer is meaningfully better informed or better equipped after reading it.",
      compositionRules:
        "- Body: 2–4 short paragraphs in each language. Optional ONE '## subheading' (e.g. '## What actually shipped') and ONE '> pull-quote' line from the original dispatch.\n- Open by stating WHAT THE STORY IS in one sentence — no scene-setting, no narrative ramp.\n- Do NOT repeat the article title as the first body paragraph.\n- Name concrete details: brand, agency, platform, budget tier where disclosed, geo, KPI / outcome.\n- Do NOT fabricate budgets, win rates, agency names, CMO names, dates, or platform stats. If a fact is not in the source, omit it. Better quiet than wrong.\n- The four required STRUCTURED FIELDS (tagline / whoForWhat / vsJapanPlay / tokyoTake) are emitted in addition to the body — see `structuredFields` below.",
      japaneseRules:
        "- The Japanese is a PARALLEL piece in Japanese marketing-blog idiom — NOT a translation of the English.\n- Use clean modern Japanese (常体 mostly). Mix kanji and hiragana naturally.\n- Leave proper nouns (Cannes, AdAge, Adweek, Meta, TikTok, DSP, RMN, CDP) in roman or established katakana. Use 「DSP」「RMN」「CDP」 over awkward 「ディーエスピー」「アールエムエヌ」「シーディーピー」.\n- Punctuation: 「」for quoted phrases, — (em-dash) for editorial asides.\n- For Japanese agency / brand references, use the standard Japanese forms: 電通、博報堂、ADK、サイバーエージェント、TBWA、トランスコスモス, etc.",

      /* -------- STRUCTURED FIELDS (4) -------- */
      structuredFields: [
        {
          key: "tagline",
          label: { en: "Tagline", ja: "タグライン" },
          type: "line",
          charLimit: { en: 60, ja: 30 },
          display: { role: "headline", onCard: true, onDetail: true },
          descriptionForLlm:
            "ONE short punchy line that captures what the story actually is. Not what the campaign press release says — what a Tokyo planner would tell a colleague in one breath. Japanese must be ≤30 full-width characters. English must be ≤60 characters. No exclamation marks. No 'AI-powered', no 'revolutionary'. If the honest tagline is 'a Dentsu playbook with a TikTok skin', say that."
        },
        {
          key: "whoForWhat",
          label: { en: "Who & For What", ja: "誰の業務に効くか" },
          type: "paragraph",
          charLimit: { en: 220, ja: 110 },
          display: { role: "body", onCard: true, onDetail: true },
          descriptionForLlm:
            "ONE sentence (or at most two) naming the exact marketer persona and the exact work. The audience is Tokyo marketers — brand managers, media planners, performance marketers, growth heads, CMOs, agency strategists, in-house creatives. Bad: 'for anyone in marketing'. Good: 'for a Tokyo-based brand manager at a Japanese CPG running a Q4 TVCM + retail media plan who needs a fresh attribution argument for the next budget defence'. Be concrete about the role and the part of the week / quarter this would land in."
        },
        {
          key: "vsJapanPlay",
          label: { en: "vs. Japan Play", ja: "日本の現状との違い" },
          type: "paragraph",
          charLimit: { en: 240, ja: 120 },
          display: { role: "body", onCard: true, onDetail: true },
          descriptionForLlm:
            "ONE sentence naming the SPECIFIC existing Japanese play or vendor this competes with (Dentsu standard plan, 博報堂 brand work, CyberAgent operative ad, LINE Ads Platform, Yahoo! JAPAN DSP, TVer CTV, Septeni, established 国内 SaaS like Marketo Engage Japan or KARTE, etc.) and stating concretely what is different. If the difference is 'nothing meaningful for Japan', say that explicitly. Name the Japanese counterpart; do not say 'other agencies'."
        },
        {
          key: "tokyoTake",
          label: { en: "Tokyo Take", ja: "東京視点" },
          type: "paragraph",
          charLimit: { en: 260, ja: 130 },
          display: { role: "verdict", onCard: true, onDetail: true },
          descriptionForLlm:
            "The signed Tokyo marketer-desk verdict in 1–2 sentences. Address what a Tokyo marketer needs to know that English coverage typically omits. Cover at least one of: (a) does the Japan media environment actually carry this inventory / channel (does TVer have this ad unit; does LINE Ads carry this format; does Yahoo! JAPAN's identity stack handle this); (b) does the audience behaviour assumption translate (does the JP consumer respond to creator-led / influencer-led / sports-sponsored content the same way); (c) does the pricing or budget scale make sense for a Japanese brand at JPY rate cards; (d) is there a domestic player (電通、博報堂、CyberAgent、LINEヤフー、TBS / フジ系列、ABEMA、TVer、Money Forward x 広告、freee x 広告) that already solves this in Japan. Be useful, not diplomatic — if the answer is 'interesting abroad, wait 6 months for Japan', say that."
        }
      ] as StructuredFieldDef[],

      /** Closing "view from {city}" block — long-form expansion on the
       *  detail page only. */
      closingBlock: {
        title: { en: "ADVERTISE TOKYO — Tokyo Take", ja: "ADVERTISE TOKYO 視点" },
        subheading: {
          en: "Does this earn a slot in a Tokyo CMO's next brief?",
          ja: "東京の CMO の次のブリーフに、入れる価値はあるか。"
        },
        outputKey: "tokyo_take",
        rules:
          "Long-form expansion of the `tokyoTake` structured field — 2–3 paragraphs only on the detail page, not on the card. Reference at least one concrete Japanese player when natural: 電通、博報堂、ADK、サイバーエージェント、Septeni、LINEヤフー、TVer、ABEMA、TBS / フジテレビ系列、Money Forward / freee の SMB マーケ周辺、Mercari の C2C 広告枠、Cookpad のレシピ広告、JTC のマーケ部内政、東京の代理店 BD の動き方。No empty patriotism. No defeatism. If the honest answer is 'wait 6 months', say that."
      }
    }
  },

  /* --------------------------------------------------------- MONETIZATION
     Same shape as AITECH. Disclosure copy localised to ADVERTISE TOKYO. */
  monetization: {
    affiliate: {
      enabled: true,
      networks: ["amazon", "partner", "asp"] as readonly AffiliateNetwork[],
      networkLabels: {
        amazon: { en: "Amazon", ja: "Amazon" },
        partner: { en: "Partner", ja: "公式パートナー" },
        asp: { en: "PR", ja: "PR" },
        other: { en: "Sponsored", ja: "PR" }
      } as Record<AffiliateNetwork, Bilingual<string>>,
      defaultLabel: { en: "Visit site", ja: "公式サイトへ" },
      disclosureShort: {
        en: "Some links on ADVERTISE TOKYO are affiliate links. We may earn a commission when you sign up, at no extra cost to you.",
        ja: "ADVERTISE TOKYO の一部リンクはアフィリエイト・リンクを含みます。リンク経由でのご利用により当サイトが報酬を受け取る場合がありますが、ご利用料金は変わりません。"
      },
      disclosureLong: {
        en: "ADVERTISE TOKYO participates in the Amazon Associates Program, partner / referral programs run by individual marketing-technology vendors, and Japanese affiliate networks (ASPs). When a story or directory entry includes a button marked PR / Partner / Amazon, the link is an affiliate link: clicking through and signing up may earn ADVERTISE TOKYO a commission, at no additional cost to you. Affiliate relationships do not determine editorial coverage, do not change the four structured fields a story is evaluated on (tagline / who & for what / vs. Japan play / Tokyo Take), and do not soften the Tokyo Take when the honest answer is 'wait six months'.",
        ja: "ADVERTISE TOKYO は、Amazon アソシエイト・プログラム、マーケティング・テクノロジー各社が運営するパートナー／リファラル・プログラム、および国内アフィリエイト・サービス・プロバイダー（ASP）に参加しています。記事内またはディレクトリエントリーに「PR」「公式パートナー」「Amazon」と表示されたボタンが含まれる場合、当該リンクはアフィリエイト・リンクです。リンク経由でご登録／ご購入いただくと当サイトが報酬を受け取ることがありますが、ユーザーの支払金額は変わりません。アフィリエイト関係は編集方針に影響を与えず、各ストーリーを評価する 4 つの構造化フィールド（タグライン／誰の業務に効くか／日本の現状との違い／東京視点）の判断、および「半年待った方がよい」と書くべき場面での率直さを変えるものではありません。"
      }
    },
    sponsors: [] as readonly {
      id: string;
      title: Bilingual<string>;
      blurb: Bilingual<string>;
      href: string;
      sponsoredBy: Bilingual<string>;
      validUntil: string;
    }[],
    ads: {
      provider: "adsense" as const,
      client: "",
      slots: {
        feedTop: "",
        feedMid: "",
        articleInline: ""
      }
    }
  },

  /* ---------------------------------------------------------------- CRON
     UTC schedule consumed by .github/workflows/daily-publish.yml.
     04:30 JST = 19:30 UTC previous day — sits between AITECH (03:00 JST)
     and ARTEMIS (06:00 JST), well outside the on-the-hour deprioritization
     band GitHub Actions sometimes applies. */
  cron: {
    utc: "30 19 * * *",
    localLabel: "04:30 JST"
  }
} as const;

/* ---------------------------------------------------------------------------
   Type derivations & helpers — identical surface to AITECH / ARTEMIS so the
   rest of the codebase reads from `siteConfig.*` without any change.
   ------------------------------------------------------------------------- */
export type SiteConfig = typeof siteConfig;
export type CategoryKey = (typeof siteConfig.categories)[number]["key"];

export const CATEGORY_ORDER: CategoryKey[] = siteConfig.categories.map(
  (c) => c.key
) as CategoryKey[];

export const getCategoryDef = (key: string): CategoryDef | undefined =>
  siteConfig.categories.find((c) => c.key === key) as CategoryDef | undefined;

export const normalizeCategory = (v: unknown): CategoryKey => {
  if (typeof v !== "string") return CATEGORY_ORDER[0];
  if ((CATEGORY_ORDER as readonly string[]).includes(v)) return v as CategoryKey;
  const mapped = siteConfig.legacyCategoryMap[v];
  if (mapped && (CATEGORY_ORDER as readonly string[]).includes(mapped)) {
    return mapped as CategoryKey;
  }
  return CATEGORY_ORDER[0];
};

export const categoryNames: Record<CategoryKey, Bilingual> = Object.fromEntries(
  siteConfig.categories.map((c) => [c.key, c.name])
) as Record<CategoryKey, Bilingual>;

export const coverUrl = (id: string): string =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=2200&q=80`;

/* ---------------------------------------------------------------------------
   Layout / structured-field / monetization helpers — defensive shape so
   sister templates that strip optional blocks still compile.
   ------------------------------------------------------------------------- */
type WithOptionalLayout = SiteConfig & {
  layout?: { mode?: "magazine" | "directory" };
};
export const getLayoutMode = (): "magazine" | "directory" => {
  return (siteConfig as WithOptionalLayout).layout?.mode ?? "magazine";
};

type WithOptionalStructuredFields = SiteConfig & {
  pipeline: SiteConfig["pipeline"] & {
    voice: SiteConfig["pipeline"]["voice"] & {
      structuredFields?: readonly StructuredFieldDef[];
    };
  };
};
export const STRUCTURED_FIELDS: readonly StructuredFieldDef[] =
  (siteConfig as WithOptionalStructuredFields).pipeline.voice.structuredFields ??
  ([] as readonly StructuredFieldDef[]);

export const HAS_STRUCTURED_FIELDS: boolean = STRUCTURED_FIELDS.length > 0;

type WithOptionalMonetization = SiteConfig & {
  monetization?: {
    affiliate?: {
      enabled?: boolean;
      networks?: readonly AffiliateNetwork[];
      networkLabels?: Record<AffiliateNetwork, Bilingual<string>>;
      defaultLabel?: Bilingual<string>;
      disclosureShort?: Bilingual<string>;
      disclosureLong?: Bilingual<string>;
    };
  };
};

export const AFFILIATE_ENABLED: boolean = Boolean(
  (siteConfig as WithOptionalMonetization).monetization?.affiliate?.enabled
);

export const AFFILIATE_NETWORKS: readonly AffiliateNetwork[] =
  (siteConfig as WithOptionalMonetization).monetization?.affiliate?.networks ??
  ([] as readonly AffiliateNetwork[]);

export const getAffiliateNetworkLabel = (
  network: AffiliateNetwork
): Bilingual<string> => {
  const labels = (siteConfig as WithOptionalMonetization).monetization?.affiliate
    ?.networkLabels;
  return (
    labels?.[network] ?? {
      en: "Sponsored",
      ja: "PR"
    }
  );
};

export const getAffiliateDefaultLabel = (): Bilingual<string> => {
  return (
    (siteConfig as WithOptionalMonetization).monetization?.affiliate
      ?.defaultLabel ?? { en: "Visit site", ja: "公式サイトへ" }
  );
};

export const getAffiliateDisclosureShort = (): Bilingual<string> => {
  return (
    (siteConfig as WithOptionalMonetization).monetization?.affiliate
      ?.disclosureShort ?? { en: "", ja: "" }
  );
};

export const getAffiliateDisclosureLong = (): Bilingual<string> => {
  return (
    (siteConfig as WithOptionalMonetization).monetization?.affiliate
      ?.disclosureLong ?? { en: "", ja: "" }
  );
};

export const isAffiliateNetworkActive = (
  network: AffiliateNetwork
): boolean => {
  if (!AFFILIATE_ENABLED) return false;
  return AFFILIATE_NETWORKS.includes(network);
};
