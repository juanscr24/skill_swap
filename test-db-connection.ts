import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Cargar variables de entorno
config();

async function testConnection() {
  console.log('🔍 Verificando configuración del .env...\n');
  
  // 1. Verificar que la variable existe
  if (!process.env.DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL no está definida en el archivo .env');
    process.exit(1);
  }
  
  console.log('✅ DATABASE_URL encontrada en .env');
  
  // Mostrar la URL (ocultando la contraseña)
  const url = process.env.DATABASE_URL;
  const maskedUrl = url.replace(/:[^:@]+@/, ':****@');
  console.log(`📍 URL de conexión: ${maskedUrl}\n`);
  
  // 2. Verificar formato de la URL
  try {
    const urlObj = new URL(url);
    console.log('✅ Formato de URL válido');
    console.log(`   - Protocolo: ${urlObj.protocol}`);
    console.log(`   - Host: ${urlObj.hostname}`);
    console.log(`   - Puerto: ${urlObj.port}`);
    console.log(`   - Base de datos: ${urlObj.pathname.slice(1)}`);
    console.log(`   - Usuario: ${urlObj.username}\n`);
  } catch (error) {
    console.error('❌ ERROR: Formato de URL inválido');
    console.error(error);
    process.exit(1);
  }
  
  // 3. Intentar conectar con Prisma
  console.log('🔌 Intentando conectar a la base de datos...\n');
  
  const prisma = new PrismaClient({
    log: ['error', 'warn'],
  });
  
  try {
    // Realizar una consulta simple
    await prisma.$connect();
    console.log('✅ ¡Conexión exitosa a la base de datos!');
    
    // Intentar una query simple
    const result = await prisma.$queryRaw`SELECT current_database(), version()`;
    console.log('\n📊 Información de la base de datos:');
    console.log(result);
    
    await prisma.$disconnect();
    console.log('\n✅ ¡El archivo .env funciona correctamente!');
    process.exit(0);
    
  } catch (error: any) {
    console.error('\n❌ ERROR al conectar a la base de datos:\n');
    
    if (error.code === 'P1001') {
      console.error('💡 No se puede alcanzar el servidor de base de datos.');
      console.error('   Posibles causas:');
      console.error('   - El servidor PostgreSQL no está ejecutándose');
      console.error('   - El host o puerto son incorrectos');
      console.error('   - Hay un firewall bloqueando la conexión');
      console.error('   - La base de datos es remota y necesitas VPN/túnel SSH');
    } else if (error.code === 'P1002') {
      console.error('💡 El servidor de base de datos se alcanzó pero expiró el tiempo.');
    } else if (error.code === 'P1003') {
      console.error('💡 La base de datos no existe en el servidor.');
    } else if (error.code === 'P1010') {
      console.error('💡 Acceso denegado - verifica usuario y contraseña.');
    } else {
      console.error(`💡 Código de error: ${error.code}`);
      console.error(`   Mensaje: ${error.message}`);
    }
    
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Ejecutar la prueba
testConnection().catch((error) => {
  console.error('❌ Error inesperado:', error);
  process.exit(1);
});
