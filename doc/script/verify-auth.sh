#!/bin/bash

echo "🔍 Verificando sistema de autenticación..."
echo ""

# Verificar variables de entorno
echo "✅ Verificando variables de entorno..."
if grep -q "NEXTAUTH_SECRET" .env && grep -q "DATABASE_URL" .env; then
    echo "   ✓ Variables de entorno configuradas"
else
    echo "   ✗ Faltan variables de entorno"
    exit 1
fi

# Verificar base de datos
echo ""
echo "✅ Verificando conexión a base de datos..."
npx prisma db pull --force > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✓ Conexión a base de datos exitosa"
else
    echo "   ✗ Error al conectar a la base de datos"
    exit 1
fi

# Generar cliente de Prisma
echo ""
echo "✅ Generando cliente de Prisma..."
npx prisma generate > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "   ✓ Cliente de Prisma generado"
else
    echo "   ✗ Error al generar cliente de Prisma"
    exit 1
fi

# Verificar que existan los archivos necesarios
echo ""
echo "✅ Verificando archivos del sistema de autenticación..."

files=(
    "src/app/api/auth/[...nextauth]/route.ts"
    "src/app/api/auth/register/route.ts"
    "src/lib/auth/auth.config.ts"
    "src/services/auth/user.service.ts"
    "src/hooks/useAuth.ts"
    "src/validations/auth.ts"
    "src/views/LoginView.tsx"
    "src/views/RegisterView.tsx"
    "src/middleware.ts"
)

all_files_exist=true
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✓ $file"
    else
        echo "   ✗ $file no encontrado"
        all_files_exist=false
    fi
done

if [ "$all_files_exist" = false ]; then
    exit 1
fi

echo ""
echo "🎉 ¡Sistema de autenticación verificado correctamente!"
echo ""
echo "Para iniciar el servidor:"
echo "  npm run dev"
echo ""
echo "Luego visita:"
echo "  http://localhost:3000/register - Para registrarte"
echo "  http://localhost:3000/login - Para iniciar sesión"
echo ""
