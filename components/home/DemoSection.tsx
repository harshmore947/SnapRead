import { Pizza } from "lucide-react";
import BgGradient from "../common/bg-gradient";
import SummaryViewer from "../summary/summary-viewer";

export default function DemoSection() {
  // Sample summary content for demo
  const demoSummary = `
# 🚀 Introduction to Next.js
• ⚛️ Next.js is a React framework that enables functionality such as server-side rendering and generating static websites  
• ⚡ It provides a zero-config setup with automatic code splitting and optimized performance  
• 🎨 Built-in CSS and Sass support with styled-jsx for component-level styles  
• 📘 Automatic TypeScript configuration and support  

# 🌟 Key Features
• 🌐 Server-side rendering (SSR) for improved SEO and performance  
• ⚡ Static site generation (SSG) for blazing fast websites  
• 🛠️ API routes for building full-stack applications  
• 🖼️ Image optimization with next/image component  
• 🗂️ Built-in routing with file-based routing system  

# 🏁 Getting Started
• 📦 Install Next.js using create-next-app for quick setup  
• 📁 Understanding the pages directory and routing structure  
• 🧩 Building your first Next.js application with components  
• ☁️ Deployment options including Vercel, Netlify, and custom servers  
• ✅ Best practices for production optimization  

# 🔧 Advanced Concepts
• 🛣️ Dynamic routing with getStaticProps and getServerSideProps  
• 🧩 Middleware for request/response manipulation  
• 📝 Custom App and Document components  
• 🚀 Performance optimization techniques  
• 🤝 Integration with popular libraries and frameworks  
`.trim();

  return (
    <section className="relative">
      <div className="py-12 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:pt-12">
        <div>
          <BgGradient />
        </div>
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-gray-100/80 backdrop-blur-xs border border-gray-500/20 mb-4">
            <Pizza className="w-6 h-6 text-rose-500 " />
          </div>
          <div className="text-center mb-16">
            <h3 className="font-blod text-3xl max-w-2xl mx-auto px-4 sm:px-6">
              Watch how SnapRead Transforms{" "}
              <span className="bg-linear-to-r from-rose-500 to-rose-700 bg-clip-text text-transparent">
                this Next.js course PDF
              </span>{" "}
              into and easy-to-read summary
            </h3>
          </div>
          <div className="flex justify-center items-center px-2 sm:px-4 lg:px-6">
            <SummaryViewer summary={demoSummary} />
          </div>
        </div>
      </div>
    </section>
  );
}
