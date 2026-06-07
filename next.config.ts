import type { NextConfig } from "next";

/* -----------------------------------------------------------------------------
   IMPORTANT: this list MUST mirror siteConfig.pipeline.allowedImageHosts in
   src/site.config.ts. The cron uses that allowlist when DECIDING which RSS
   image URL to write into articles.json. Next.js Image uses THIS list when
   actually rendering at runtime. Keep them in sync.
   ----------------------------------------------------------------------------- */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // --- Unsplash (fallback covers) -------------------------------------
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "source.unsplash.com" },

      // --- WordPress-VIP CDN (used by Adweek / MarTech / Marketing Dive
      //     / Marketing Brew — most marketing-trade publishers are on WP) -
      { protocol: "https", hostname: "**.wp.com" },
      { protocol: "https", hostname: "**.wordpress.com" },
      { protocol: "https", hostname: "**.wpengine.com" },

      // --- Adweek (og:image is on static-www.adweek.com) ------------------
      { protocol: "https", hostname: "adweek.com" },
      { protocol: "https", hostname: "**.adweek.com" },

      // --- MarTech.org ----------------------------------------------------
      { protocol: "https", hostname: "martech.org" },
      { protocol: "https", hostname: "**.martech.org" },
      { protocol: "https", hostname: "**.thirddoor.com" },

      // --- Marketing Dive / Industry Dive ---------------------------------
      { protocol: "https", hostname: "marketingdive.com" },
      { protocol: "https", hostname: "**.marketingdive.com" },
      { protocol: "https", hostname: "**.industrydive.com" },

      // --- Digiday --------------------------------------------------------
      { protocol: "https", hostname: "digiday.com" },
      { protocol: "https", hostname: "**.digiday.com" },
      { protocol: "https", hostname: "**.digidaymedia.com" },

      // --- AdAge / Crain (kept for back-compat with older feeds) ----------
      { protocol: "https", hostname: "adage.com" },
      { protocol: "https", hostname: "**.adage.com" },
      { protocol: "https", hostname: "**.crain.com" },

      // --- Marketing Brew / Morning Brew (kept for back-compat) -----------
      { protocol: "https", hostname: "**.marketingbrew.com" },
      { protocol: "https", hostname: "**.morningbrew.com" },

      // --- Common publisher CDNs (HN-linked outlets) ----------------------
      { protocol: "https", hostname: "**.medium.com" },
      { protocol: "https", hostname: "miro.medium.com" },
      { protocol: "https", hostname: "**.substackcdn.com" },
      { protocol: "https", hostname: "substackcdn.com" },
      { protocol: "https", hostname: "**.substack.com" },
      { protocol: "https", hostname: "**.ghost.io" },
      { protocol: "https", hostname: "**.ghostcdn.io" },
      { protocol: "https", hostname: "**.cdn.ghost.io" },
      { protocol: "https", hostname: "**.netlify.app" },
      { protocol: "https", hostname: "**.vercel.app" },
      { protocol: "https", hostname: "**.vercel-storage.com" },

      // --- Generic CDN providers ------------------------------------------
      { protocol: "https", hostname: "**.cloudfront.net" },
      { protocol: "https", hostname: "**.akamaized.net" },
      { protocol: "https", hostname: "**.akamaihd.net" },
      { protocol: "https", hostname: "**.fastly.net" },
      { protocol: "https", hostname: "**.cdninstagram.com" },
      { protocol: "https", hostname: "**.fbcdn.net" },
      { protocol: "https", hostname: "**.twimg.com" },
      { protocol: "https", hostname: "**.gstatic.com" },
      { protocol: "https", hostname: "googleusercontent.com" },
      { protocol: "https", hostname: "**.googleusercontent.com" },
      { protocol: "https", hostname: "**.cloudinary.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "https", hostname: "s3.amazonaws.com" }
    ]
  }
};

export default nextConfig;
