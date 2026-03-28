'use client'

interface TemplatePreviewProps {
  html: string
}

export function TemplatePreview({ html }: TemplatePreviewProps) {
  return (
    <div className="relative w-full" style={{ paddingBottom: '62.5%' }}>
      <div
        className="absolute inset-0 overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-white"
        style={{ transform: 'translateZ(0)' }}
      >
        <iframe
          srcDoc={html}
          title="Portfolio preview"
          className="w-full h-full border-0"
          style={{
            transform: 'scale(0.5)',
            transformOrigin: 'top left',
            width: '200%',
            height: '200%',
            pointerEvents: 'none',
          }}
          sandbox="allow-same-origin"
        />
      </div>
    </div>
  )
}
