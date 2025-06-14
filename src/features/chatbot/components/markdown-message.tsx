import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownMessageProps {
  content: string;
  className?: string;
}

export function MarkdownMessage({ content, className }: MarkdownMessageProps) {
  return (
    <div className={`markdown-content ${className || ""}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // 自定義各種 Markdown 元素的樣式
          p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
          h1: ({ children }) => (
            <h1 className="text-lg font-bold mb-2 text-gray-900">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-base font-bold mb-2 text-gray-900">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm font-bold mb-1 text-gray-900">{children}</h3>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-900">{children}</strong>
          ),
          em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>
          ),
          li: ({ children }) => <li className="text-sm leading-relaxed">{children}</li>,
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="px-1 py-0.5 bg-gray-100 rounded text-xs font-mono text-gray-800">
                  {children}
                </code>
              );
            }
            return (
              <code className="block p-2 bg-gray-100 rounded text-xs font-mono text-gray-800 whitespace-pre-wrap overflow-x-auto">
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="mb-2 bg-gray-100 rounded p-2 overflow-x-auto">{children}</pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-300 pl-3 mb-2 italic text-gray-600">
              {children}
            </blockquote>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto mb-2">
              <table className="min-w-full border-collapse border border-gray-300 text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => <tr className="border-b border-gray-300">{children}</tr>,
          th: ({ children }) => (
            <th className="border border-gray-300 px-2 py-1 text-left font-semibold">{children}</th>
          ),
          td: ({ children }) => <td className="border border-gray-300 px-2 py-1">{children}</td>,
          hr: () => <hr className="my-2 border-gray-300" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
