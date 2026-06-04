# WhatsApp Notifications Setup — Sistema de Moeda Estudantil

Este guia configura as notificações via WhatsApp usando **WAHA** (WhatsApp HTTP API).
As mesmas notificações enviadas por email são enviadas também por WhatsApp.

---

## Notificações implementadas

| Evento | Destinatário |
|--------|-------------|
| Cadastro de professor | Professor (boas-vindas + senha temporária) |
| Esqueci minha senha | Usuário (link de redefinição) |
| Envio de moedas | Professor (confirmação de envio) |
| Recebimento de moedas | Aluno (notificação de recebimento) |

---

## Pré-requisitos

- Docker instalado
- Node.js 18+
- Banco Supabase configurado (ver `.env.example`)

---

## 1. Variáveis de ambiente

Adicione ao `Codigo/server/.env`:

```env
# WhatsApp (WAHA)
WAHA_BASE_URL=http://localhost:3000
WAHA_SESSION=default
WAHA_API_KEY=fc3b06af3734447eb6e4f0d348d20ddf
WAHA_DASHBOARD_USERNAME=admin
WAHA_DASHBOARD_PASSWORD=3146ee6e58bd4552908ed3c4844db0b1
WHATSAPP_SWAGGER_USERNAME=admin
WHATSAPP_SWAGGER_PASSWORD=3146ee6e58bd4552908ed3c4844db0b1
```

---

## 2. Migration do banco

A coluna `whatsapp_phone` precisa existir na tabela `users`.

```powershell
cd Codigo/server
npm run db:migrate
```

Se travar, aplique manualmente no Supabase SQL Editor:

```sql
ALTER TABLE "users" ADD COLUMN "whatsapp_phone" varchar(20);
```

---

## 3. Subir o WAHA (Docker)

Rode na pasta raiz do projeto (para salvar a sessão com volume):

```powershell
docker run -it --rm -p 3000:3000 `
  -e WHATSAPP_API_KEY=fc3b06af3734447eb6e4f0d348d20ddf `
  -v ${PWD}/.sessions:/app/.sessions `
  devlikeapro/waha
```

> O volume `-v` garante que a sessão WhatsApp persiste mesmo reiniciando o container.

---

## 4. Conectar o WhatsApp ao WAHA

### 4.1 Acessar o Swagger

Acesse: `http://localhost:3000/api`

Clique em **Authorize** e coloque a API key:
```
fc3b06af3734447eb6e4f0d348d20ddf
```

### 4.2 Criar a sessão

**POST /api/sessions** → Try it out → body:
```json
{
  "name": "default"
}
```

> Se aparecer erro "Session already exists", pule para o passo 4.3.

### 4.3 Iniciar a sessão

**POST /api/sessions/{session}/start** → Try it out → session: `default` → Execute.

### 4.4 Autenticar pelo código de pareamento

**POST /api/{session}/auth/request-code** → Try it out → body:
```json
{
  "phoneNumber": "55SEU_NUMERO_COMPLETO",
  "method": "sms"
}
```

Ex.: `"phoneNumber": "5531999999999"`

Um código de 8 dígitos chegará no WhatsApp. No celular:
- Abre o WhatsApp
- Configurações → Dispositivos conectados → Conectar dispositivo
- Clica em "Conectar com número de telefone"
- Digite o código recebido

### 4.5 Verificar conexão

**GET /api/sessions/{session}** com `session = default`.

Status deve ser `WORKING`. Ou acesse o dashboard: `http://localhost:3000/dashboard`
- Usuário: `admin`
- Senha: `3146ee6e58bd4552908ed3c4844db0b1`

---

## 5. Subir o servidor NestJS

```powershell
cd Codigo/server
npm run start:dev
```

---

## 6. Subir o frontend Next.js

```powershell
cd Codigo/client
npm run dev
```

> Se a porta 3000 estiver ocupada (pelo WAHA), o Next.js vai perguntar se quer usar outra porta — confirme com `y`.

---

## 7. Testar

### Teste 1: Cadastro de professor (admin)
1. Loga como admin: `admin@gmail.com` / `Senha123!`
2. Vai em **Professores → Novo Professor**
3. Preenche os dados e coloca o número no campo **WhatsApp (opcional)**
   - Formato: só DDD + número, ex.: `31999999999` (sem +55, sem espaços)
4. Clica em **Criar professor**
5. Mensagem de boas-vindas chega no WhatsApp

### Teste 2: Esqueci minha senha
1. Vai em `/esqueci-senha`
2. Digita o email de um usuário com `whatsappPhone` cadastrado
3. Link de redefinição chega no WhatsApp

### Teste 3: Transferência de moedas
1. Loga como professor
2. Envia moedas para um aluno que tenha `whatsappPhone` cadastrado
3. Professor recebe confirmação + aluno recebe notificação no WhatsApp

---

## Reiniciar em outro dia

O container Docker para quando o terminal fecha. Para retomar:

```powershell
# 1. Sobe o WAHA com volume (sessão já salva)
docker run -it --rm -p 3000:3000 `
  -e WHATSAPP_API_KEY=fc3b06af3734447eb6e4f0d348d20ddf `
  -v ${PWD}/.sessions:/app/.sessions `
  devlikeapro/waha

# 2. Inicia a sessão (já autenticada, vai direto pra WORKING)
curl -X POST "http://localhost:3000/api/sessions/default/start" `
  -H "X-Api-Key: fc3b06af3734447eb6e4f0d348d20ddf"

# 3. Sobe o servidor
cd Codigo/server && npm run start:dev

# 4. Sobe o frontend (outro terminal)
cd Codigo/client && npm run dev
```

---

## Arquitetura

```
App (Next.js)
    │
    ▼
API (NestJS) ──→ Email (Nodemailer/Gmail)
    │
    └──→ WhatsAppService ──→ WAHA (Docker) ──→ WhatsApp
```

**Arquivos principais da implementação:**
- `Codigo/server/src/whatsapp/whatsapp.service.ts` — serviço de envio
- `Codigo/server/src/whatsapp/whatsapp.module.ts` — módulo NestJS
- `Codigo/server/drizzle/0005_striped_quicksilver.sql` — migration da coluna

**Formato do número aceito:** qualquer formato numérico com DDD.
O serviço normaliza automaticamente adicionando o código do Brasil (`55`).
