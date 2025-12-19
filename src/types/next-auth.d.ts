import 'next-auth'
import 'next-auth/jwt'
import type { role_enum } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      role: role_enum
    }
  }

  interface User {
    id: string
    email: string
    name?: string | null
    image?: string | null
    role: role_enum
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: role_enum
  }
}
