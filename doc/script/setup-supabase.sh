#!/bin/bash

# 🚀 Script de Configuración Rápida - Supabase Chat
# Este script te ayuda a configurar todo lo necesario

echo "🎯 Configuración de Chat Realtime con Supabase"
echo "=============================================="
echo ""

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Función para verificar si un comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar Node.js
if ! command_exists node; then
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js instalado${NC}"

# Verificar npm
if ! command_exists npm; then
    echo -e "${RED}❌ npm no está instalado${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm instalado${NC}"

echo ""
echo "📦 Instalando dependencias..."
npm install

echo ""
echo "🔧 Configurando Prisma..."
npx prisma generate

echo ""
echo -e "${YELLOW}⚠️  IMPORTANTE: Configura tus variables de entorno${NC}"
echo ""
echo "Crea un archivo .env.local con:"
echo ""
echo "NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co"
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key"
echo "DATABASE_URL=\"postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres\""
echo ""
echo "Encuentra estos valores en: https://supabase.com/dashboard"
echo ""

read -p "¿Ya configuraste las variables de entorno? (s/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo -e "${YELLOW}👉 Configura las variables y vuelve a ejecutar este script${NC}"
    exit 0
fi

echo ""
echo "🗄️  Ejecutando migraciones de Prisma..."
npx prisma migrate dev --name add_chat_tables

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Migraciones aplicadas correctamente${NC}"
else
    echo -e "${RED}❌ Error al aplicar migraciones${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}📋 PRÓXIMOS PASOS:${NC}"
echo ""
echo "1. Ve al Dashboard de Supabase:"
echo "   https://supabase.com/dashboard"
echo ""
echo "2. Ve a SQL Editor y ejecuta el contenido de:"
echo "   prisma/migrations/supabase_rls_policies.sql"
echo ""
echo "3. Ve a Database > Replication"
echo "   Encuentra la tabla 'messages' y activa Realtime"
echo ""
echo "4. Ejecuta el servidor de desarrollo:"
echo "   npm run dev"
echo ""
echo -e "${GREEN}✅ Configuración completada!${NC}"
