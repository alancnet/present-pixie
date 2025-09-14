import type { Config } from 'tailwindcss'
import { heroui } from '@heroui/theme'

export default {
  darkMode: 'class',
  plugins: [
    heroui({
      addCommonColors: true,
    }),
  ],
} satisfies Config


