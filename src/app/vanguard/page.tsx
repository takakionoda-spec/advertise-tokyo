"use client";

/* =============================================================================
   /vanguard — TOKYO VANGUARD editorial picks
   -----------------------------------------------------------------------------
   Hand-curated editor's selection of Tokyo-based studios, brand-consulting
   firms, and creative collectives shipping the next chapter of Japanese
   marketing / branding / creative — independent of the holdco model.

   Data lives in siteConfig.vanguard.entries; adding a new entry requires no
   code change here. Outbound links carry rel="noopener" (no "sponsored" or
   "nofollow" — these are editorial picks, not affiliate placements).
   ========================================================================== */

import { Container } from "@/components/GridSystem";
import { useLanguage } from "@/context/LanguageContext";
import { siteConfig } from "@/site.config";

type VanguardEntry = {
  id: string;
  name: string;
  url: string;
  tagline: { en: string; ja: string };
  note: { en: string; ja: string };
  tone: string;
};

export default function VanguardPage() {
  const { lang } = useLanguage();
  const vg = (siteConfig as typeof siteConfig & {
    vanguard?: {
      eyebrow: { en: string; ja: string };
      headline: { en: string; ja: string };
      lede: { en: string; ja: string };
      entries: readonly VanguardEntry[];
    };
  }).vanguard;

  if (!vg) return null;

  return (
    <>
      <Container className="pt-12 lg:pt-16 pb-12">
        <p className="eyebrow text-accent">{vg.eyebrow[lang]}</p>
        <h1 className="mt-6 font-display font-extrabold text-[clamp(2.5rem,6vw,5rem)] leading-[1.02] tracking-[-0.018em] max-w-5xl text-ink">
          {vg.headline[lang]}
        </h1>
        <p className="mt-8 max-w-[68ch] text-lg text-ink-700 leading-relaxed">
          {vg.lede[lang]}
        </p>
        <div className="silver-rule mt-12" />
      </Container>

      <Container className="pb-section">
        <div className="grid grid-cols-1 gap-y-10 lg:gap-y-14">
          {vg.entries.map((entry, i) => (
            <article
              key={entry.id}
              className="glass p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-6"
            >
              {/* Left: tone-tile with company wordmark — flat editorial,
                  not a logo upload; the wordmark itself reads as the visual.
                  The `tone` color from siteConfig sits behind the name and
                  gives each entry a distinct hue without requiring image
                  asset wrangling. */}
              <div className="lg:col-span-4">
                <div
                  className="relative aspect-[4/3] overflow-hidden rounded-sm"
                  style={{
                    background: `linear-gradient(135deg, ${entry.tone}, var(--color-paper-soft))`
                  }}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                    <span className="font-display font-extrabold text-ink text-[1.8rem] lg:text-[2.2rem] tracking-[0.04em] leading-none">
                      {entry.name}
                    </span>
                    <span className="mt-4 font-mono text-[0.625rem] tracking-[0.32em] uppercase text-ink-600">
                      No. {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: editorial body */}
              <div className="lg:col-span-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-mono text-[0.625rem] tracking-[0.32em] uppercase text-accent">
                    Editor&apos;s Pick
                  </span>
                  <span aria-hidden className="text-ink-500">·</span>
                  <span className="font-mono text-[0.625rem] tracking-[0.22em] uppercase text-ink-600">
                    {new URL(entry.url).hostname.replace(/^www\./, "")}
                  </span>
                </div>
                <h2 className="font-display font-bold text-[clamp(1.4rem,2.5vw,2rem)] leading-[1.15] tracking-[-0.005em] text-ink max-w-2xl">
                  {entry.tagline[lang]}
                </h2>
                <p className="mt-6 max-w-[68ch] text-base text-ink-700 leading-relaxed">
                  {entry.note[lang]}
                </p>
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noopener"
                  className="btn-neon mt-8 inline-flex"
                >
                  {lang === "ja" ? "公式サイトへ" : "Visit site"}
                  <span aria-hidden>↗</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </Container>

      {/* Tail — invite for more picks. Doubles as a path to the /about
          Contact section so an interested company can reach out. */}
      <Container className="pb-section">
        <div className="glass p-8 lg:p-10 text-center">
          <p className="eyebrow text-accent">
            {lang === "ja" ? "次の VANGUARD 候補" : "Next Vanguard"}
          </p>
          <h2 className="mt-4 font-display font-bold text-[clamp(1.4rem,3vw,2.2rem)] leading-[1.15] tracking-[-0.005em] text-ink max-w-3xl mx-auto">
            {lang === "ja"
              ? "東京から、次のマーケティングを作る人へ。"
              : "Building the next chapter of Tokyo marketing?"}
          </h2>
          <p className="mt-5 max-w-2xl mx-auto text-base text-ink-700 leading-relaxed">
            {lang === "ja"
              ? "新しい仕事や考え方を、編集部にぶつけてください。次回の VANGUARD 枠で取り上げる可能性があります。"
              : "Send your work, your thinking, or your launch to the editorial desk. We're looking for the next entries to feature alongside CEKAI and SIMONE."}
          </p>
          <a href="/about#contact" className="btn-neon mt-8 inline-flex">
            {lang === "ja" ? "編集部にメールする" : "Email the editorial desk"}
          </a>
        </div>
      </Container>
    </>
  );
}
