import { Pizza } from "lucide-react";
import BgGradient from "../common/bg-gradient";
import SummaryViewer from "../summary/summary-viewer";

export default function DemoSection() {
  // Sample summary content for demo
  const demoSummary = `
# Introduction to Next.js
• Next.js is a React framework that enables functionality such as server-side rendering and generating static websites
• It provides a zero-config setup with automatic code splitting and optimized performance
• Built-in CSS and Sass support with styled-jsx for component-level styles
• Automatic TypeScript configuration and support

# Key Features
• Server-side rendering (SSR) for improved SEO and performance
• Static site generation (SSG) for blazing fast websites
• API routes for building full-stack applications
• Image optimization with next/image component
• Built-in routing with file-based routing system

# Getting Started
• Install Next.js using create-next-app for quick setup
• Understanding the pages directory and routing structure
• Building your first Next.js application with components
• Deployment options including Vercel, Netlify, and custom servers
• Best practices for production optimization

# Advanced Concepts
• Dynamic routing with getStaticProps and getServerSideProps
• Middleware for request/response manipulation
• Custom App and Document components
• Performance optimization techniques
• Integration with popular libraries and frameworks
`.trim();

  return (
    <section className="relative isolate bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-8 inline-flex items-center justify-center rounded-utility-card bg-rose-50 p-3 ring-1 ring-inset ring-rose-100">
            <Pizza className="h-6 w-6 text-rose-600" />
          </div>
          <h2 className="font-display text-4xl font-600 tracking-tight text-rose-950 sm:text-5xl">
            Watch how SnapRead transforms{" "}
            <span className="bg-linear-to-r from-rose-600 to-rose-400 bg-clip-text text-transparent">
              this Next.js course PDF
            </span>{" "}
            into an easy-to-read summary
          </h2>
        </div>

        <div className="mt-16 flex justify-center">
          <div className="w-full max-w-3xl">
            <SummaryViewer summary={demoSummary} />
          </div>
        </div>
      </div>
    </section>
  );
}