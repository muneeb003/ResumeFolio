const STEPS = [
  { label: 'Upload', num: 1 },
  { label: 'Review', num: 2 },
  { label: 'Design', num: 3 },
  { label: 'Deploy', num: 4 },
]

export function StepIndicator({ currentStep }: { currentStep: 1 | 2 | 3 | 4 }) {
  return (
    <nav className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((step, i) => {
        const done = step.num < currentStep
        const active = step.num === currentStep

        return (
          <div key={step.num} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  done
                    ? 'bg-indigo-600 text-white'
                    : active
                    ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {done ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.num
                )}
              </div>
              <span
                className={`mt-1 text-xs font-medium ${
                  active ? 'text-indigo-600' : done ? 'text-gray-600' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>

            {i < STEPS.length - 1 && (
              <div
                className={`w-16 h-0.5 mb-4 mx-1 transition-colors ${
                  step.num < currentStep ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        )
      })}
    </nav>
  )
}
