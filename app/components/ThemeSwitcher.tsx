/// <reference lib="dom" />
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cn } from '../lib/utils'

export default function ThemeSwitcher() {
  const [isDark, setIsDark] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const html = document.documentElement
      html.classList.add('dark')
      setIsDark(true)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const html = document.documentElement
      if (isDark) {
        html.classList.add('dark')
      } else {
        html.classList.remove('dark')
      }
    }
  }, [isDark, mounted])

  if (!mounted) return null

  return (
    <SwitchPrimitive.Root
      checked={isDark}
      onCheckedChange={setIsDark}
      aria-label='Toggle theme'
      className={cn(
        'peer transition-all inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent dark:border-neutral-600 shadow-xs outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=checked]:bg-primary data-[state=unchecked]:bg-input dark:bg-neutral-800'
      )}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          'bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none flex items-center justify-center size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0'
        )}
      >
        {isDark ? <Moon className='w-3.5 h-3.5 text-white' /> : <Sun className='w-3.5 h-3.5 text-black' />}
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  )
}
