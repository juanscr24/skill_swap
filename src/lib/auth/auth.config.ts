import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import { getUserByEmail, verifyPassword, createUserFromOAuth } from '@/services/auth'

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
    newUser: '/dashboard',
  },
  providers: [
    // Autenticación con credenciales (email y password)
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email y contraseña son requeridos')
        }

        const user = await getUserByEmail(credentials.email)

        if (!user || !user.password) {
          throw new Error('Usuario no encontrado')
        }

        const isPasswordValid = await verifyPassword(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error('Contraseña incorrecta')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        }
      },
    }),

    // Autenticación con Google (opcional)
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
              params: {
                prompt: "consent",
                access_type: "offline",
                response_type: "code",
                scope: 'openid email profile'
              }
            }
          }),
        ]
      : []),

    // Autenticación con GitHub (opcional)
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      // Si es un nuevo login
      if (user) {
        token.id = user.id
        token.role = user.role
      }

      // Si es login con OAuth y tenemos account
      if (account && account.provider !== 'credentials') {
        // Obtener o crear usuario desde OAuth
        const profile = {
          email: user.email!,
          name: user.name,
          image: user.image,
        }
        
        try {
          const dbUser = await createUserFromOAuth(profile)
          token.id = dbUser.id
          token.role = dbUser.role
        } catch (error) {
          console.error('Error creating OAuth user:', error)
        }
      }

      // Actualizar el token si se actualiza la sesión
      if (trigger === 'update' && session) {
        token = { ...token, ...session.user }
      }

      return token
    },
    async session({ session, token }) {
      // Pasar información del token a la sesión
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role
      }
      return session
    },
  },
  events: {
    async signIn({ user, isNewUser }) {
      // Puedes agregar lógica adicional aquí
      // Por ejemplo, enviar email de bienvenida para nuevos usuarios
      if (isNewUser) {
        console.log(`Nuevo usuario registrado: ${user.email}`)
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}
