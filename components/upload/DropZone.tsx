'use client'

import { useDropzone } from 'react-dropzone'

interface DropZoneProps {
  onFileDrop: (file: File) => void
  disabled?: boolean
}

export function DropZone({ onFileDrop, disabled }: DropZoneProps) {
  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop: (accepted) => { if (accepted[0]) onFileDrop(accepted[0]) },
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    disabled,
  })

  const rejection = fileRejections[0]?.errors[0]

  return (
    <div className="flex flex-col gap-2">
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200 cursor-pointer group
          ${isDragActive
            ? 'border-indigo-400 bg-indigo-50/60 scale-[1.01]'
            : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/60'}
          ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 ${
              isDragActive
                ? 'bg-indigo-100 scale-110'
                : 'bg-zinc-100 group-hover:bg-zinc-200'
            }`}
          >
            <svg
              className={`w-5 h-5 transition-colors ${isDragActive ? 'text-indigo-600' : 'text-zinc-500'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          {isDragActive ? (
            <p className="text-sm font-medium text-indigo-600">Drop to upload</p>
          ) : (
            <div>
              <p className="text-sm font-medium text-zinc-700 mb-0.5">
                Drop your resume, or{' '}
                <span className="text-indigo-600 underline decoration-dotted underline-offset-2">browse</span>
              </p>
              <p className="text-xs text-zinc-400">PDF or DOCX · max 10 MB</p>
            </div>
          )}
        </div>
      </div>

      {rejection && (
        <p className="text-xs text-red-500 text-center">
          {rejection.code === 'file-too-large'
            ? 'File exceeds 10 MB limit'
            : rejection.code === 'file-invalid-type'
            ? 'Only PDF and DOCX files are supported'
            : rejection.message}
        </p>
      )}
    </div>
  )
}
