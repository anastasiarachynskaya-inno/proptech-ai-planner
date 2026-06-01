# AI PropTech Deal & Milestone Planner

## 🎯 Project Purpose & Business Intent

This application is an institutional-grade real estate transaction accelerator. In traditional PropTech, creating due diligence checklists, financial audit tracks, and legal validation timelines requires weeks of manual consultation. This platform leverages Next.js 16 and Generative AI (Google Gemini 2.5 Flash / Structured Outputs) to automatically synthesize a comprehensive, chronological transaction milestone roadmap based on user inputs (property intent, geography, budget, and timeline constraint).

To ensure high availability and zero-cost user exploration, the architecture features a custom, server-side **Smart Dynamic Local Fallback Engine**. If an active AI API key is omitted, the backend programmatically parses input text parameters using localized real estate frameworks—automatically injecting Polish KW register controls for Warsaw, Land Registry validations for London, and Grundbuch legal checks for Berlin.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
