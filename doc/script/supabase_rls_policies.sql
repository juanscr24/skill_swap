-- ============================================
-- SUPABASE RLS POLICIES FOR CHAT
-- ============================================
-- Ejecutar este script en el SQL Editor de Supabase
-- después de crear las tablas con Prisma migrate

-- Habilitar RLS en las tablas
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICIES PARA CONVERSATIONS
-- ============================================

-- Los usuarios pueden ver conversaciones donde son participantes
CREATE POLICY "Users can view their own conversations"
  ON conversations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_participants.conversation_id = conversations.id
        AND conversation_participants.user_id = auth.uid()::uuid
    )
  );

-- Los usuarios pueden crear conversaciones (se valida en la aplicación)
CREATE POLICY "Users can create conversations"
  ON conversations
  FOR INSERT
  WITH CHECK (true);

-- Los usuarios pueden actualizar conversaciones donde son participantes
CREATE POLICY "Users can update their conversations"
  ON conversations
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_participants.conversation_id = conversations.id
        AND conversation_participants.user_id = auth.uid()::uuid
    )
  );

-- ============================================
-- POLICIES PARA CONVERSATION_PARTICIPANTS
-- ============================================

-- Los usuarios pueden ver participantes de sus conversaciones
CREATE POLICY "Users can view participants of their conversations"
  ON conversation_participants
  FOR SELECT
  USING (
    user_id = auth.uid()::uuid
    OR EXISTS (
      SELECT 1 FROM conversation_participants cp
      WHERE cp.conversation_id = conversation_participants.conversation_id
        AND cp.user_id = auth.uid()::uuid
    )
  );

-- Los usuarios pueden añadir participantes (se valida en la aplicación)
CREATE POLICY "Users can add participants"
  ON conversation_participants
  FOR INSERT
  WITH CHECK (true);

-- Los usuarios pueden actualizar su propia información de participante
CREATE POLICY "Users can update their own participant info"
  ON conversation_participants
  FOR UPDATE
  USING (user_id = auth.uid()::uuid);

-- ============================================
-- POLICIES PARA MESSAGES
-- ============================================

-- Los usuarios pueden ver mensajes de sus conversaciones
CREATE POLICY "Users can view messages from their conversations"
  ON messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_participants.conversation_id = messages.conversation_id
        AND conversation_participants.user_id = auth.uid()::uuid
    )
  );

-- Los usuarios pueden enviar mensajes a conversaciones donde son participantes
CREATE POLICY "Users can send messages to their conversations"
  ON messages
  FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()::uuid
    AND EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_participants.conversation_id = messages.conversation_id
        AND conversation_participants.user_id = auth.uid()::uuid
    )
  );

-- Solo el emisor puede actualizar sus propios mensajes (editar)
CREATE POLICY "Users can update their own messages"
  ON messages
  FOR UPDATE
  USING (sender_id = auth.uid()::uuid);

-- Solo el emisor puede eliminar sus propios mensajes
CREATE POLICY "Users can delete their own messages"
  ON messages
  FOR DELETE
  USING (sender_id = auth.uid()::uuid);

-- ============================================
-- INDEXES PARA OPTIMIZAR RLS
-- ============================================

-- Estos índices ayudan a mejorar el rendimiento de las políticas RLS
CREATE INDEX IF NOT EXISTS idx_conversation_participants_auth_lookup 
  ON conversation_participants(conversation_id, user_id);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_auth_lookup 
  ON messages(conversation_id, sender_id);

-- ============================================
-- FUNCIONES HELPERS (OPCIONAL)
-- ============================================

-- Función para obtener el otro participante en una conversación 1-a-1
CREATE OR REPLACE FUNCTION get_conversation_partner(conversation_uuid uuid, current_user_uuid uuid)
RETURNS TABLE(
  user_id uuid,
  name text,
  email text,
  image text
) AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.name, u.email, u.image
  FROM users u
  INNER JOIN conversation_participants cp ON cp.user_id = u.id
  WHERE cp.conversation_id = conversation_uuid
    AND cp.user_id != current_user_uuid
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para marcar mensajes como leídos (actualizar last_read_at)
CREATE OR REPLACE FUNCTION mark_conversation_as_read(conversation_uuid uuid, user_uuid uuid)
RETURNS void AS $$
BEGIN
  UPDATE conversation_participants
  SET last_read_at = NOW()
  WHERE conversation_id = conversation_uuid
    AND user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TRIGGER PARA ACTUALIZAR last_message_at
-- ============================================

-- Función que se ejecuta cuando se inserta un nuevo mensaje
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET 
    last_message_at = NEW.created_at,
    updated_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger que llama a la función
DROP TRIGGER IF EXISTS trigger_update_conversation_timestamp ON messages;
CREATE TRIGGER trigger_update_conversation_timestamp
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_timestamp();

-- ============================================
-- CONFIGURACIÓN DE REALTIME
-- ============================================

-- Habilitar Realtime en la tabla messages
-- Esto se hace desde el Dashboard de Supabase:
-- 1. Ve a Database > Replication
-- 2. Selecciona la tabla "messages"
-- 3. Habilita Realtime

-- También puedes ejecutar este comando si tienes permisos:
-- ALTER PUBLICATION supabase_realtime ADD TABLE messages;
