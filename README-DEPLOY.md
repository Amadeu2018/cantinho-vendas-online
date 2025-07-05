# Deploy no Choreos

Este guia explica como fazer deploy da aplicação Cantinho Algarvio no Choreos.

## Pré-requisitos

1. Conta no Choreos
2. Repositório Git com o código da aplicação
3. Docker instalado localmente (opcional, para teste)

## Estrutura de Arquivos para Deploy

Os seguintes arquivos foram criados para suportar o deploy:

- `Dockerfile` - Configuração do container Docker
- `nginx.conf` - Configuração do servidor web Nginx
- `docker-compose.yml` - Para teste local
- `.choreo/endpoints.yaml` - Configuração dos endpoints do Choreos
- `.choreo/context.yaml` - Contexto do projeto
- `openapi.yaml` - Especificação da API
- `.dockerignore` - Arquivos a ignorar no build

## Como fazer Deploy no Choreos

### 1. Preparar o Repositório

Certifique-se de que todos os arquivos estão no repositório Git:

```bash
git add .
git commit -m "Add Choreos deployment configuration"
git push origin main
```

### 2. Criar Projeto no Choreos

1. Acesse o [Choreos Console](https://console.choreo.dev/)
2. Clique em "Create Project"
3. Digite o nome do projeto: "cantinho-algarvio"
4. Selecione sua organização

### 3. Criar Componente Web App

1. No projeto criado, clique em "Create Component"
2. Selecione "Web Application"
3. Configure:
   - **Name**: cantinho-algarvio-frontend
   - **Description**: Frontend da aplicação Cantinho Algarvio
   - **Repository**: Selecione seu repositório Git
   - **Branch**: main
   - **Dockerfile Path**: ./Dockerfile
   - **Context Path**: /

### 4. Configurar Build e Deploy

1. O Choreos irá detectar automaticamente o `Dockerfile`
2. Clique em "Deploy" para iniciar o build
3. Aguarde o processo de build completar

### 5. Configurar Domínio (Opcional)

1. Após o deploy, vá para "Settings" > "Domain"
2. Configure um domínio personalizado se desejar

## Teste Local com Docker

Para testar localmente antes do deploy:

```bash
# Build da imagem
docker build -t cantinho-algarvio .

# Executar container
docker run -p 3000:80 cantinho-algarvio
```

Ou usar docker-compose:

```bash
docker-compose up
```

A aplicação estará disponível em `http://localhost:3000`

## Configurações de Ambiente

Se sua aplicação precisar de variáveis de ambiente:

1. No Choreos Console, vá para "Settings" > "Environment Variables"
2. Adicione as variáveis necessárias
3. Redeploy a aplicação

## Monitoramento e Logs

1. No Choreos Console, acesse "Observability"
2. Visualize logs e métricas da aplicação
3. Configure alertas se necessário

## Troubleshooting

### Build Falha

- Verifique se o `Dockerfile` está correto
- Certifique-se de que todas as dependências estão no `package.json`
- Verifique os logs de build no Choreos Console

### Aplicação não Carrega

- Verifique se a porta 80 está exposta no `Dockerfile`
- Confirme se o `nginx.conf` está configurado corretamente
- Verifique os logs da aplicação

### Problemas de Roteamento

- Certifique-se de que o `nginx.conf` inclui a configuração de fallback para SPAs:
  ```nginx
  location / {
      try_files $uri $uri/ /index.html;
  }
  ```

## Comandos Úteis

```bash
# Ver logs da aplicação
choreoctl logs <component-name>

# Redeploy
choreoctl deploy <component-name>

# Ver status
choreoctl status <component-name>
```

## Notas Importantes

- O Choreos faz build automaticamente a cada push para a branch configurada
- Certifique-se de que o Supabase está configurado com as URLs corretas
- Para production, configure HTTPS e certificados SSL
- Monitore o uso de recursos e escale conforme necessário