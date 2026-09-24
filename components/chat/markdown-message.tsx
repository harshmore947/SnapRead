"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CitationBadge } from "./citation-badge";

interface MarkdownMessageProps {
  content: string;
}

/**
 * Parses bracketed citations like [Page 3: Executive Summary] or [Page 4]
 * and replaces them with interactive CitationBadge components.
 */
function renderWithCitations(node: React.ReactNode): React.ReactNode {
  if (typeof node === "string") {
    const citationRegex = /\[Page\s+(\d+)(?::\s*([^\]]+))?\]/gi;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = citationRegex.exec(node)) !== null) {
      if (match.index > lastIndex) {
        parts.push(node.substring(lastIndex, match.index));
      }
      const pageNumber = match[1];
      const sectionTitle = match[2]?.trim();

      parts.push(
        <CitationBadge
          key={`cite-${match.index}-${pageNumber}-${sectionTitle || ""}`}
          pageNumber={pageNumber}
          sectionTitle={sectionTitle}
        />
      );
      lastIndex = citationRegex.lastIndex;
    }

    if (lastIndex < node.length) {
      parts.push(node.substring(lastIndex));
    }

    return parts.length > 0 ? parts : node;
  }

  if (React.isValidElement(node)) {
    const children = (node.props as { children?: React.ReactNode })?.children;
    if (children) {
      return React.cloneElement(
        node,
        undefined,
        React.Children.map(children, renderWithCitations)
      );
    }
  }

  return node;
}

export function MarkdownMessage({ content }: MarkdownMessageProps) {
  return (
    <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => (
            <p className="mb-2 last:mb-0">
              {React.Children.map(children, renderWithCitations)}
            </p>
          ),
          li: ({ children }) => (
            <li className="my-0.5">
              {React.Children.map(children, renderWithCitations)}
            </li>
          ),
          h1: ({ children }) => (
            <h1 className="text-base font-bold text-gray-900 mt-3 mb-1.5 border-b border-rose-100 pb-1">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-sm font-bold text-gray-900 mt-2.5 mb-1">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-800 mt-2 mb-1">
              {children}
            </h3>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-4 space-y-1 my-2 text-gray-700">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-4 space-y-1 my-2 text-gray-700">
              {children}
            </ol>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-rose-400 pl-3 my-2 italic text-gray-600 bg-rose-50/50 py-1 rounded-r-lg">
              {children}
            </blockquote>
          ),
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="bg-rose-50 text-rose-700 font-mono text-[11px] px-1.5 py-0.5 rounded border border-rose-200">
                  {children}
                </code>
              );
            }
            return (
              <pre className="bg-gray-900 text-gray-100 p-3 rounded-xl overflow-x-auto text-xs my-2 font-mono">
                <code>{children}</code>
              </pre>
            );
          },
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-900">{children}</strong>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
