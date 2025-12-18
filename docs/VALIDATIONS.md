# 🔐 Validaciones de Autenticación con Zod

## Requisitos de Contraseña Segura

### ✅ Contraseña debe contener:

1. **Mínimo 8 caracteres**
2. **Al menos una letra minúscula** (a-z)
3. **Al menos una letra MAYÚSCULA** (A-Z)
4. **Al menos un número** (0-9)
5. **Al menos un carácter especial** (@$!%*?&.#)

### Ejemplos:

✅ **Contraseñas válidas:**
- `Password123!`
- `MiClave@2024`
- `Segura#123`
- `Admin$Pass1`

❌ **Contraseñas inválidas:**
- `password` - No tiene mayúscula, número ni especial
- `PASSWORD123` - No tiene minúscula ni especial
- `Pass123` - No tiene carácter especial
- `Pass@` - Menos de 8 caracteres

## 📋 Schemas de Validación

### Login Schema

```typescript
{
  email: string (requerido, formato email válido),
  password: string (requerido)
}
```

**Validaciones:**
- Email debe ser válido
- Email se convierte a minúsculas automáticamente
- Email se limpia de espacios

### Register Schema

```typescript
{
  name: string (requerido, 2-100 caracteres),
  email: string (requerido, formato email válido),
  password: string (requerido, 8-100 caracteres + requisitos de seguridad),
  confirmPassword: string (debe coincidir con password)
}
```

**Validaciones adicionales:**
- **Nombre:** Solo letras y espacios (incluyendo acentos y ñ)
- **Email:** Formato válido, convertido a minúsculas
- **Password:** Debe cumplir todos los requisitos de seguridad
- **ConfirmPassword:** Debe ser idéntica a password

## 🎨 Componente PasswordStrength

El componente `<PasswordStrength />` muestra visualmente:

- **Barra de progreso** con colores según fortaleza:
  - 🔴 Rojo: 0-2 requisitos (Débil)
  - 🟡 Amarillo: 3 requisitos (Media)
  - 🔵 Azul: 4 requisitos (Buena)
  - 🟢 Verde: 5 requisitos (Excelente)

- **Lista de requisitos** con indicadores:
  - ○ Gris: Sin verificar (campo vacío)
  - ✓ Verde: Requisito cumplido
  - ✗ Rojo: Requisito no cumplido

### Uso:

```tsx
import { PasswordStrength } from '@/components'

function MyForm() {
  const { watch } = useForm()
  const password = watch('password', '')
  
  return (
    <>
      <Input type="password" {...register('password')} />
      <PasswordStrength password={password} />
    </>
  )
}
```

## 🛡️ Caracteres Especiales Permitidos

```
@ $ ! % * ? & . #
```

## 🔧 Personalización

Si necesitas agregar más caracteres especiales, edita el regex en `/src/validations/auth.ts`:

```typescript
.regex(
  /^(?=.*[@$!%*?&.#TU_CARACTER_AQUI])/,
  'Mensaje de error personalizado'
)
```

## 📝 Mensajes de Error

Todos los mensajes de error están en español y son específicos:

```typescript
// Ejemplos de mensajes:
"El email es requerido"
"Email inválido"
"La contraseña debe tener al menos 8 caracteres"
"La contraseña debe contener al menos una letra mayúscula"
"La contraseña debe contener al menos un carácter especial (@$!%*?&.#)"
"Las contraseñas no coinciden"
```

## 🧪 Testing de Validaciones

Puedes probar las validaciones directamente:

```typescript
import { registerSchema } from '@/validations/auth'

try {
  const result = registerSchema.parse({
    name: "Juan Pérez",
    email: "juan@example.com",
    password: "Password123!",
    confirmPassword: "Password123!"
  })
  console.log('✅ Validación exitosa', result)
} catch (error) {
  console.log('❌ Error de validación', error.errors)
}
```

## 🎯 Integración con React Hook Form

```typescript
import { useForm } from 'react-hook-form'
import { registerSchema, type RegisterInput } from '@/validations/auth'

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<RegisterInput>()

const onSubmit = async (data: RegisterInput) => {
  try {
    // Validar con Zod
    const validatedData = registerSchema.parse(data)
    
    // Continuar con el registro
    await registerUser(validatedData)
  } catch (err) {
    // Manejar errores de validación
    console.error(err.errors)
  }
}
```

## 📊 Ejemplo Completo

```tsx
'use client'
import { useForm } from 'react-hook-form'
import { registerSchema, type RegisterInput } from '@/validations/auth'
import { Input, PasswordStrength } from '@/components'

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>()

  const password = watch('password', '')

  const onSubmit = async (data: RegisterInput) => {
    try {
      const validatedData = registerSchema.parse(data)
      // Procesar registro
    } catch (err: any) {
      if (err.errors) {
        console.error(err.errors[0]?.message)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Nombre"
        {...register('name')}
        error={errors.name?.message}
      />
      
      <Input
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
      />
      
      <Input
        label="Contraseña"
        type="password"
        {...register('password')}
        error={errors.password?.message}
      />
      <PasswordStrength password={password} />
      
      <Input
        label="Confirmar Contraseña"
        type="password"
        {...register('confirmPassword')}
        error={errors.confirmPassword?.message}
      />
      
      <button type="submit">Registrarse</button>
    </form>
  )
}
```

## 🔄 Actualizar Requisitos

Para cambiar los requisitos de contraseña:

1. Edita `/src/validations/auth.ts`
2. Actualiza los regex en `registerSchema.password`
3. Actualiza el componente `/src/components/ui/PasswordStrength.tsx`
4. Actualiza la constante `requirements` con los nuevos requisitos

---

## ✅ Validaciones Implementadas

- ✅ Email válido y único
- ✅ Contraseña con requisitos de seguridad
- ✅ Confirmación de contraseña
- ✅ Nombre válido (solo letras)
- ✅ Limpieza automática de datos (trim, toLowerCase)
- ✅ Mensajes de error en español
- ✅ Indicador visual de fortaleza de contraseña
- ✅ TypeScript completamente tipado

¡Tus validaciones están listas y son súper seguras! 🚀
