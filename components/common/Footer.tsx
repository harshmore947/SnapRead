import { Github, Heart, FileText } from "lucide-react";
import Link from "next/link";

function Footer() {
  return (
    <footer className=" bg-white/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Logo and Description */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-gradient-to-br from-rose-400 to-rose-600 p-2">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">
                SnapRead
              </span>
            </div>
            <span className="hidden text-sm text-gray-500 md:block">
              AI-powered PDF summarization
            </span>
          </div>

          {/* Made by section */}
          <div className="flex flex-col items-center gap-2 md:items-end">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <span>Made by</span>
              <span className="font-medium text-rose-600">Harsh</span>
              <span>with</span>
              <Heart className="h-4 w-4 fill-red-500 text-red-500" />
            </div>

            {/* GitHub link */}
            <Link
              href="https://github.com/harshbanjare"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-gray-900 px-3 py-1.5 text-sm text-white transition-all hover:bg-gray-800 hover:scale-105"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </Link>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-6 border-t border-gray-200 pt-4 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} SnapRead. Transform your PDFs into
            digestible summaries.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
