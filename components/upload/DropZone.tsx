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
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors cursor-pointer
          ${isDragActive ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center">
            <svg className="w-7 h-7 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          {isDragActive ? (
            <p className="text-indigo-600 font-medium">Drop your resume here</p>
          ) : (
            <>
              <p className="text-gray-700 font-medium">Drag & drop your resume here</p>
              <p className="text-gray-400 text-sm">or click to browse</p>
            </>
          )}
          <p className="text-xs text-gray-400">PDF or DOCX · max 10 MB</p>
        </div>
      </div>

      {rejection && (
        <p className="text-sm text-red-500 text-center">
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
