// Views
export { LoginPage } from './components/LoginPage'
export { RegisterPage } from './components/RegisterPage'
export { ForgotPasswordPage } from './components/ForgotPasswordPage'
// Components

// Hooks
export { useAuth } from './hooks/useAuth'
// and should only be imported in server-side code (API routes, Server Actions, etc.)
// Types

// Validations
export { loginSchema, type LoginInput } from './validations/login'
export { registerSchema, type RegisterInput } from './validations/register'
export { forgotPasswordSchema, type ForgotPasswordInput } from './validations/forgot'
export { resetPasswordSchema, type ResetPasswordInput } from './validations/reset'
