import ReactMarkdown from 'react-markdown'

interface Props {
  children: string
  className?: string
}

// Renders newsletter body text — bold, links, paragraphs — styled to the
// Cyber Cookie brand palette. Body text never contains headings/images/etc,
// so only the inline + paragraph elements are styled.
export default function Markdown({ children, className }: Props) {
  return (
    <div className={`space-y-3 ${className ?? ''}`}>
      <ReactMarkdown
        components={{
          p: ({ children }) => (
            <p className="text-cream/80 leading-relaxed text-sm">{children}</p>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-cream">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cookie-amber hover:text-cream underline underline-offset-2"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1 text-cream/80 text-sm">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1 text-cream/80 text-sm">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          code: ({ children }) => (
            <code className="bg-ghost/10 text-cookie-amber px-1 py-0.5 rounded text-xs">{children}</code>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
