# Execucao do Projeto

Este diretorio contem as duas aplicacoes do Sistema de Moeda Estudantil:

- `client`: frontend em Next.js
- `server`: backend em NestJS com Drizzle ORM, Supabase PostgreSQL e JWT

## Pre-requisitos

- Node.js 22 ou superior
- npm
- Acesso ao projeto Supabase configurado no `.env` do backend

Docker nao e obrigatorio, porque o banco esta no Supabase. Ele so seria necessario se a equipe decidisse rodar um PostgreSQL local.

## Backend

Entre na pasta do servidor:

```bash
cd Codigo/server
```

Instale as dependencias:

```bash
npm install
```

Crie o arquivo `.env` com base no exemplo:

```bash
copy .env.example .env
```

Configure no `.env`:

```env
PORT=3001
DATABASE_URL="postgresql://usuario:senha@host:6543/postgres"
JWT_SECRET="troque-esta-chave"
JWT_EXPIRES_IN="1d"
SUPABASE_URL="https://seu-projeto.supabase.co"
SUPABASE_PUBLISHABLE_KEY="sb_publishable_xxx"
```

Gere migrations do Drizzle quando alterar os schemas:

```bash
npm run db:generate
```

Aplique as migrations no Supabase:

```bash
npm run db:migrate
```

Execute o backend:

```bash
npm run start:dev
```

A API fica disponivel em:

```text
http://localhost:3001/api
```

## Frontend

Em outro terminal, entre na pasta do client:

```bash
cd Codigo/client
```

Instale as dependencias:

```bash
npm install
```

Execute o frontend:

```bash
npm run dev
```

A aplicacao fica disponivel em:

```text
http://localhost:3000
```

## Endpoints principais do backend

Todos usam o prefixo `/api`.

- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/students`
- `GET /api/students`
- `POST /api/partner-companies`
- `GET /api/partner-companies`
- `GET /api/users`
- `GET /api/users/:id`
- `PATCH /api/users/:id`
- `DELETE /api/users/:id`
- `GET /api/institutions`
- `POST /api/institutions`

Os endpoints de consulta, edicao e exclusao usam token JWT no header:

```text
Authorization: Bearer <token>
```

## Validacao

No backend, rode:

```bash
npm run build
npm run lint
npm test -- --runInBand
```

O `--runInBand` evita erro de spawn de workers do Jest em alguns ambientes Windows.

## Estrutura

```text
Codigo
|-- client
|   |-- src
|   |-- package.json
|
|-- server
|   |-- src
|   |   |-- auth
|   |   |-- common
|   |   |-- database
|   |   |-- institutions
|   |   |-- users
|   |
|   |-- drizzle
|   |-- drizzle.config.ts
|   |-- .env.example
|   |-- package.json
```
