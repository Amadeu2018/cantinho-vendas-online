
-- Habilita a segurança a nível de linha na tabela de perfis para proteger os dados do usuário.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Função auxiliar que obtém a função do usuário atual de forma segura, evitando recursão infinita.
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  -- Retorna a função do usuário como texto. Retorna nulo se o usuário ou a função não for encontrado.
  RETURN (SELECT role::text FROM public.profiles WHERE id = auth.uid());
END;
$$;

-- Política RLS: Permite que os administradores visualizem todos os perfis.
-- Isso é necessário para que os administradores possam gerenciar todos os usuários no painel de administração.
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.get_current_user_role() = 'admin');

-- Política RLS: Permite que os usuários visualizem seu próprio perfil.
-- Isso é essencial para que os usuários possam ver suas próprias informações.
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Política RLS: Permite que os usuários atualizem seu próprio perfil.
-- Isso permite que os usuários editem suas informações pessoais.
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

