'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import Image from 'next/image'

export function UserMenu() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)

  if (!session?.user) return null

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        {session.user.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name ?? 'User'}
            width={36}
            height={36}
            className="rounded-full"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium text-sm">
            {session.user.name?.[0] ?? 'U'}
          </div>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-20 py-1">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900 truncate">{session.user.name}</p>
              <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
            </div>
            <a href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              Dashboard
            </a>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  )
}
