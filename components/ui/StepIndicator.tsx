const STEPS = [
  { label: 'Upload', num: 1 },
  { label: 'Review', num: 2 },
  { label: 'Design', num: 3 },
  { label: 'Deploy', num: 4 },
]

export function StepIndicator({ currentStep }: { currentStep: 1 | 2 | 3 | 4 }) {
  return (
    <nav className="flex items-center justify-center mb-10" aria-label="Progress">
      <div className="flex items-center gap-0.5 bg-zinc-100 rounded-full p-1">
        {STEPS.map((step) => {
          const done = step.num < currentStep
          const active = step.num === currentStep

          return (
            <div
              key={step.num}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                active
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : done
                  ? 'text-zinc-500'
                  : 'text-zinc-400'
              }`}
            >
              {done ? (
                <svg
                  className="w-3.5 h-3.5 text-indigo-500 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span
                  className={`text-[9px] w-4 h-4 rounded-full flex items-center justify-center shrink-0 font-bold leading-none ${
                    active ? 'bg-indigo-600 text-white' : 'bg-zinc-300 text-zinc-500'
                  }`}
                >
                  {step.num}
                </span>
              )}
              {/* Show label always on sm+, only for active/done on mobile */}
              <span className="hidden sm:inline">{step.label}</span>
              <span className="sm:hidden">{(active || done) ? step.label : ''}</span>
            </div>
          )
        })}
      </div>
    </nav>
  )
}
