# Backend - Sistema de Moeda Estudantil

API NestJS da Sprint 02, focada no servico de usuarios, autenticação JWT e persistencia no Supabase PostgreSQL com Drizzle ORM.

## Stack

- NestJS 11
- Drizzle ORM
- Supabase PostgreSQL
- JWT com Passport
- bcrypt para hash de senha
- class-validator para validacao de DTOs

## Variaveis de ambiente

Crie um `.env` a partir de `.env.example`.

```env
PORT=3001
DATABASE_URL="postgresql://postgres:senha@host:6543/postgres"
JWT_SECRET="troque-esta-chave"
JWT_EXPIRES_IN="1d"
SUPABASE_URL="https://seu-projeto.supabase.co"
SUPABASE_PUBLISHABLE_KEY="sb_publishable_xxx"
```

O backend usa o Supabase como banco PostgreSQL via `DATABASE_URL`. A conexao usa `prepare: false`, necessario para o pooler do Supabase na porta `6543`.

## Comandos

```bash
npm install
npm run build
npm run start:dev
npm run db:generate
npm run db:migrate
npm run db:studio
npm test -- --runInBand
```

## Endpoints principais

Todos os endpoints usam o prefixo `/api`.

### Autenticacao

- `POST /api/auth/login`
- `GET /api/auth/me` com Bearer token

### Alunos

- `POST /api/students`
- `GET /api/students` com Bearer token

### Empresas parceiras

- `POST /api/partner-companies`
- `GET /api/partner-companies` com Bearer token

### Usuarios gerais

- `GET /api/users` com Bearer token
- `GET /api/users/:id` com Bearer token
- `PATCH /api/users/:id` com Bearer token
- `DELETE /api/users/:id` com Bearer token

### Complementares

- `POST /api/professors` com Bearer token
- `GET /api/professors` com Bearer token
- `POST /api/admins` com Bearer token
- `GET /api/admins` com Bearer token
- `GET /api/institutions`
- `GET /api/institutions/:id`
- `POST /api/institutions` com Bearer token

## Modelo de dados inicial

A migration inicial cria:

- `users`
- `institutions`
- `student_profiles`
- `partner_company_profiles`
- `professor_profiles`
- `administrator_profiles`

O saldo inicial do professor e criado com 1000 moedas. Alunos, empresas e administradores começam com saldo 0.
