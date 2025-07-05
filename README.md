# Cantinho Algarvio - Restaurante e Delivery

Sistema completo de delivery e gestão para restaurante com foco em culinária angolana e portuguesa.

## 🚀 Funcionalidades Principais

### Para Clientes
- **Menu Digital**: Navegação por categorias (Entradas, Peixes, Carnes, Vegetarianos, etc.)
- **Filtros Avançados**: Busca por nome, ingredientes e categorias específicas
- **Sistema de Pedidos**: Carrinho completo com checkout
- **Rastreamento**: Acompanhe seu pedido em tempo real
- **Perfil de Usuário**: Histórico de pedidos, favoritos e endereços
- **Notificações**: Receba atualizações sobre seus pedidos
- **Avaliações**: Sistema de reviews para pratos

### Para Administradores
- **Dashboard Completo**: Visão geral de vendas, pedidos e estatísticas
- **Gestão de Produtos**: CRUD completo com upload de imagens
- **Gerenciamento de Pedidos**: Status, processamento e acompanhamento
- **Controle de Estoque**: Alertas de baixo estoque e movimentações
- **Relatórios Financeiros**: Gráficos e análises de vendas
- **Sistema de Faturas**: Geração automática de faturas
- **Gestão de Clientes**: Base de dados completa de clientes
- **Configurações**: Dados da empresa, contas bancárias, etc.

### Catering e Eventos
- **Solicitação de Eventos**: Formulário completo para eventos
- **Gestão de Propostas**: Sistema de orçamentos e aprovações
- **Faturas de Eventos**: Controle financeiro específico para eventos

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Componentes**: Shadcn/ui, Radix UI
- **Gráficos**: Recharts
- **Deploy**: Docker, Nginx, Choreos

## 📦 Instalação e Desenvolvimento

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/cantinho-algarvio.git

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local

# Execute em modo desenvolvimento
npm run dev
```

## 🚀 Deploy

### Deploy no Choreos
Veja o arquivo [README-DEPLOY.md](./README-DEPLOY.md) para instruções completas de deploy no Choreos.

### Deploy Local com Docker
```bash
# Build da imagem
docker build -t cantinho-algarvio .

# Execute o container
docker run -p 3000:80 cantinho-algarvio
```

## 🗃️ Estrutura do Banco de Dados

### Tabelas Principais
- `products` - Produtos do restaurante
- `categories` - Categorias dos produtos
- `orders` - Pedidos dos clientes
- `profiles` - Perfis dos usuários
- `notifications` - Sistema de notificações
- `event_requests` - Solicitações de eventos
- `reviews` - Avaliações dos produtos

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Linting
npm run lint
```

## 🎨 Design System

O projeto utiliza um design system personalizado com:
- Cores temáticas (cantinho-navy, cantinho-terracotta, etc.)
- Componentes reutilizáveis
- Responsividade mobile-first
- Animações e transições suaves

## 📱 Responsividade

- Design mobile-first
- Breakpoints customizados
- Componentes adaptativos
- Navegação otimizada para touch

## 🔒 Segurança

- Autenticação via Supabase Auth
- Row Level Security (RLS) no banco
- Validação de dados no frontend e backend
- Sanitização de inputs

## 📊 Monitoramento

- Logs estruturados
- Métricas de performance
- Alertas de erro
- Analytics de uso

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Contato

- Email: contato@cantinhoalgarvio.com
- Telefone: +244 924 678 544
- Website: https://cantinhoalgarvio.com

---

**Lovable Project URL**: https://lovable.dev/projects/76a894dc-b987-4e4a-a474-6edb63441c38

Desenvolvido com ❤️ para o Cantinho Algarvio