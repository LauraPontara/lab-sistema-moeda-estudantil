<!-- [![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=99999999&assignment_repo_type=AssignmentRepo) [![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=99999999) -->

<a href="https://classroom.github.com/online_ide?assignment_repo_id=99999999&assignment_repo_type=AssignmentRepo"><img src="https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg" width="200"/></a> <a href="https://classroom.github.com/open-in-codespaces?assignment_repo_id=99999999"><img src="https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg" width="250"/></a>

---

# 🪙 Sistema de Moeda Estudantil

> Sistema para estimular o reconhecimento do mérito estudantil por meio de uma moeda virtual. Professores distribuem moedas aos alunos como reconhecimento, e os alunos podem trocá-las por vantagens oferecidas por empresas parceiras.

<table>
  <tr>
    <td width="800px">
      <div align="justify">
        O <b>Sistema de Moeda Estudantil</b> é um projeto acadêmico desenvolvido para a disciplina de <i>Laboratório de Desenvolvimento de Software</i> da PUC Minas. O sistema propõe uma <b>moeda virtual</b> como instrumento de reconhecimento do mérito estudantil: professores recebem um saldo semestral de moedas que podem distribuir aos alunos por bom desempenho, participação e comportamento. Os alunos, por sua vez, acumulam moedas e as utilizam para resgatar vantagens — como descontos em restaurantes, materiais e mensalidades — oferecidas por <i>empresas parceiras</i> cadastradas na plataforma. O projeto é desenvolvido em ciclos de release utilizando arquitetura <b>MVC</b>, com frontend em <b>Next.js</b> e backend em <b>NestJS</b>.
      </div>
    </td>
    <td>
      <div align="center">
        <!-- Substitua pela logo do projeto quando disponível -->
        🪙
      </div>
    </td>
  </tr>
</table>

---

## 🚧 Status do Projeto

[![Versão](https://img.shields.io/badge/Versão-v1.0.0-blue?style=for-the-badge)](https://github.com/seu-usuario/seu-repositorio/releases)
![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-149ECA?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![GitHub license](https://img.shields.io/github/license/seu-usuario/seu-repositorio?style=for-the-badge&color=007ec6&logo=opensourceinitiative)
![GitHub last commit](https://img.shields.io/github/last-commit/seu-usuario/seu-repositorio?style=for-the-badge&logo=clockify)

---

## 📚 Índice

- [🔗 Links Úteis](#-links-úteis)
- [📝 Sobre o Projeto](#-sobre-o-projeto)
- [✨ Funcionalidades Principais](#-funcionalidades-principais)
- [🛠 Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [🏗 Arquitetura](#-arquitetura)
- [🔧 Instalação e Execução](#-instalação-e-execução)
- [🚀 Deploy](#-deploy)
- [📂 Estrutura de Pastas](#-estrutura-de-pastas)
- [🎥 Demonstração](#-demonstração)
- [🧪 Testes](#-testes)
- [🔗 Documentações Utilizadas](#-documentações-utilizadas)
- [👥 Autores](#-autores)
- [🤝 Contribuição](#-contribuição)
- [🙏 Agradecimentos](#-agradecimentos)
- [📄 Licença](#-licença)

---

## 🔗 Links Úteis

- 🌐 **Demo Online:** [Acesse a Aplicação Web](<link-da-demo-web>)
- 📖 **Documentação da API:** [Swagger/OpenAPI](<link-para-swagger>)
- 📋 **Repositório GitHub:** [github.com/seu-usuario/seu-repositorio](<link-do-repositorio>)

---

## 📝 Sobre o Projeto

O **Sistema de Moeda Estudantil** nasceu da necessidade de criar mecanismos digitais de incentivo ao mérito acadêmico. A plataforma conecta três perfis de usuários — alunos, professores e empresas parceiras — em torno de uma economia virtual baseada em reconhecimento.

A cada semestre, professores recebem 1.000 moedas que podem distribuir livremente aos seus alunos, sempre com uma mensagem justificando o reconhecimento. Os alunos acumulam esse saldo e podem resgatá-lo em vantagens reais junto às empresas parceiras, que se cadastram no sistema e oferecem produtos, descontos e benefícios. Todo o fluxo — desde a distribuição até o resgate — é rastreado, notificado por e-mail e autenticado por perfis individuais.

O projeto é desenvolvido em três releases progressivas, seguindo metodologia ágil com sprints semanais, e adota arquitetura MVC com separação clara entre frontend, backend e banco de dados.

---

## ✨ Funcionalidades Principais

- 🔐 **Autenticação por perfil:** Login e senha para alunos, professores e empresas parceiras.
- 📋 **Cadastro de alunos:** Auto-cadastro com dados pessoais, instituição e curso.
- 🏫 **Gestão de professores e instituições:** Pré-cadastro feito pelo administrador.
- 🏢 **Cadastro de empresas parceiras:** Auto-cadastro com gestão de vantagens oferecidas.
- 💸 **Envio de moedas:** Professores enviam moedas a alunos com mensagem de reconhecimento.
- 📊 **Extrato de conta:** Professores e alunos consultam saldo e histórico de transações.
- 🎁 **Catálogo de vantagens:** Alunos visualizam e resgatam vantagens disponíveis.
- 📩 **Notificações por e-mail:** Confirmação de recebimento de moedas e cupons de resgate.
- 🎫 **Cupom com código único:** Gerado automaticamente no resgate, enviado ao aluno e à empresa.
- 📷 **Foto de produto:** Empresas parceiras adicionam imagem e descrição às vantagens.

---

## 🛠 Tecnologias Utilizadas

### 💻 Front-end

| Tecnologia | Versão |
|---|---|
| Next.js | 15.x |
| React | 19.x |
| TypeScript | 5.x |
| Tailwind CSS | 4.x |
| Radix UI / shadcn | latest |
| React Hook Form | latest |
| Zod | latest |
| Axios | latest |
| Zustand | latest |
| Lucide React | latest |

### 🖥️ Back-end

| Tecnologia | Versão |
|---|---|
| Node.js | 22.x |
| NestJS | 11.x |
| TypeScript | 5.x |
| PostgreSQL | 15.x |
| ORM | *a definir* |
| Autenticação | JWT |

### ⚙️ Infraestrutura & DevOps

| Tecnologia | Uso |
|---|---|
| Docker / Docker Compose | Containerização local |
| Vercel | Deploy do front-end |
| Render | Deploy do back-end |
| GitHub Actions | CI/CD *(a configurar)* |

---

## 🏗 Arquitetura

O sistema segue arquitetura **MVC**, com separação clara entre as camadas de apresentação (frontend Next.js), lógica de negócio (backend NestJS) e persistência (PostgreSQL).

> [!NOTE]
> A definição detalhada da arquitetura de pastas, padrões de projeto (Repository, Service Layer, DTOs, etc.) e estratégia de acesso ao banco de dados (ORM, DAO) será concluída na Sprint 01 da Release 1 e documentada aqui.

### Visão macro

```text
Next.js (Frontend)
      |
      v
NestJS API (Backend)
      |
      v
PostgreSQL (Banco de Dados)
```

### Diagramas

> Os diagramas serão adicionados conforme produzidos nas sprints. Os arquivos-fonte (.asta ou equivalente) estarão disponíveis na pasta `/docs/diagramas`.

| Diagrama | Arquivo |
|---|---|
| Diagrama de Casos de Uso | *em breve* |
| Diagrama de Classes | *em breve* |
| Diagrama de Componentes | *em breve* |
| Modelo ER | *em breve* |
| Diagrama de Sequências | *em breve* |

---

## 🔧 Instalação e Execução

### Pré-requisitos

- **Node.js:** v22.x ou superior
- **npm** ou **yarn**
- **Docker** (recomendado para o banco de dados)

---

### 🔑 Variáveis de Ambiente

#### Front-end (Next.js)

Crie um arquivo **`.env.local`** na raiz da pasta `/frontend`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

#### Back-end (NestJS)

Crie um arquivo **`.env`** na raiz da pasta `/backend`:

```env
# Servidor
PORT=3001

# Banco de Dados
DATABASE_URL=postgresql://postgres:senha123@localhost:5432/moeda_estudantil

# Autenticação
JWT_SECRET=sua_chave_jwt_super_secreta

# E-mail
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=seu_email@gmail.com
MAIL_PASS=sua_senha_de_app
```

---

### 📦 Instalação de Dependências

1. **Clone o repositório:**

```bash
git clone <URL_DO_REPOSITÓRIO>
cd lab-sistema-moeda-estudantil
```

2. **Instale as dependências do front-end:**

```bash
cd frontend
npm install
cd ..
```

3. **Instale as dependências do back-end:**

```bash
cd backend
npm install
cd ..
```

---

### 💾 Inicialização do Banco de Dados (PostgreSQL via Docker)

```bash
docker run --name moeda_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=senha123 \
  -e POSTGRES_DB=moeda_estudantil \
  -p 5432:5432 \
  -d postgres:15
```

---

### ⚡ Como Executar a Aplicação

Execute em dois terminais separados:

**Terminal 1 — Back-end (NestJS):**

```bash
cd backend
npm run start:dev
```

🚀 *API disponível em `http://localhost:3001`*

**Terminal 2 — Front-end (Next.js):**

```bash
cd frontend
npm run dev
```

🎨 *Aplicação disponível em `http://localhost:3000`*

---

### 🐳 Execução com Docker Compose

```bash
docker-compose up --build -d
```

Para parar:

```bash
docker-compose down
```

---

## 🚀 Deploy

O frontend será hospedado na **Vercel** e o backend no **Render**, conforme exigido na Release 3.

```bash
# Build do frontend
cd frontend
npm run build

# Build do backend
cd backend
npm run build
```

> Configure as variáveis de ambiente no painel da Vercel e do Render antes do deploy.

---

## 📂 Estrutura de Pastas

> A estrutura detalhada de pastas e os padrões de projeto adotados serão definidos e documentados durante a Sprint 01. A estrutura abaixo representa a organização inicial do repositório.

```
.
├── README.md
├── docker-compose.yml
├── .gitignore
│
├── /docs                        # 📚 Documentação e artefatos de engenharia
│   ├── /diagramas               # Diagramas UML exportados e arquivos-fonte
│   └── /historias-de-usuario    # Histórias de usuário em markdown/PDF
│
├── /frontend                    # 💻 Aplicação Next.js
│   ├── /public
│   ├── /src
│   │   ├── /app                 # Rotas e páginas (App Router)
│   │   ├── /components          # Componentes reutilizáveis
│   │   ├── /services            # Chamadas HTTP ao backend
│   │   ├── /hooks               # Hooks customizados
│   │   ├── /types               # Tipagens TypeScript
│   │   └── /styles              # Estilos globais
│   ├── .env.local
│   └── package.json
│
└── /backend                     # 🖥️ API NestJS
    ├── /src
    │   ├── /modules             # Módulos por domínio (a definir)
    │   └── main.ts
    ├── .env
    └── package.json
```

---

## 🎥 Demonstração

> As capturas de tela e GIFs de demonstração serão adicionados conforme o desenvolvimento avança.

### 🌐 Aplicação Web

| Tela | Captura |
|:---:|:---:|
| **Página de Login** | *em breve* |
| **Dashboard do Aluno** | *em breve* |
| **Envio de Moedas (Professor)** | *em breve* |
| **Catálogo de Vantagens** | *em breve* |
| **Extrato de Conta** | *em breve* |

---

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Cobertura
npm run test:cov
```

---

## 🔗 Documentações Utilizadas

- 📖 [Documentação Oficial do **Next.js**](https://nextjs.org/docs)
- 📖 [Documentação Oficial do **NestJS**](https://docs.nestjs.com/)
- 📖 [Documentação Oficial do **React**](https://react.dev/reference/react)
- 📖 [Documentação do **Tailwind CSS**](https://tailwindcss.com/docs)
- 📖 [Documentação do **shadcn/ui**](https://ui.shadcn.com/)
- 📖 [Documentação do **Docker**](https://docs.docker.com/)
- 📖 [**Conventional Commits**](https://www.conventionalcommits.org/en/v1.0.0/)
- 📖 [Template README — Prof. João Paulo Aramuni](https://github.com/joaopauloaramuni/laboratorio-de-desenvolvimento-de-software/blob/main/TEMPLATES/template_README.md)

---

## 👥 Autores

| 👤 Nome | 🖼️ Foto | :octocat: GitHub | 💼 LinkedIn | 📤 Gmail |
|---------|----------|-----------------|-------------|-----------|
| Eric Leal | <div align="center"><img src="https://github.com/Eric-Leal.png" width="70px" height="70px" style="border-radius:50%"></div> | <div align="center"><a href="https://github.com/Eric-Leal"><img src="https://joaopauloaramuni.github.io/image/github6.png" width="50px" height="50px"></a></div> | <div align="center"><a href="https://linkedin.com/in/ericgleal"><img src="https://joaopauloaramuni.github.io/image/linkedin2.png" width="50px" height="50px"></a></div> | <div align="center"><a href="mailto:eric@gmail.com"><img src="https://joaopauloaramuni.github.io/image/gmail3.png" width="50px" height="50px"></a></div> |
| Laura Pontara | <div align="center"><img src="https://github.com/LauraPontara.png" width="70px" height="70px" style="border-radius:50%"></div> | <div align="center"><a href="https://github.com/LauraPontara"><img src="https://joaopauloaramuni.github.io/image/github6.png" width="50px" height="50px"></a></div> | <div align="center"><a href="https://linkedin.com/in/laura-pontara"><img src="https://joaopauloaramuni.github.io/image/linkedin2.png" width="50px" height="50px"></a></div> | <div align="center"><a href="mailto:laura@gmail.com"><img src="https://joaopauloaramuni.github.io/image/gmail3.png" width="50px" height="50px"></a></div> |
| Giuliano Percope | <div align="center"><img src="https://github.com/GiulianoLBP.png" width="70px" height="70px" style="border-radius:50%"></div> | <div align="center"><a href="https://github.com/GiulianoLBP"><img src="https://joaopauloaramuni.github.io/image/github6.png" width="50px" height="50px"></a></div> | <div align="center"><a href="https://www.linkedin.com/in/giuliano-lb-percope/"><img src="https://joaopauloaramuni.github.io/image/linkedin2.png" width="50px" height="50px"></a></div> | <div align="center"><a href="mailto:giuliano@gmail.com"><img src="https://joaopauloaramuni.github.io/image/gmail3.png" width="50px" height="50px"></a></div> |

> [!TIP]
> 💡 Atualize os e-mails reais de cada integrante antes de publicar o repositório.

---

## 🤝 Contribuição

1. Faça um `fork` do projeto.
2. Crie uma branch para sua feature (`git checkout -b feature/minha-feature`).
3. Commit suas mudanças (`git commit -m 'feat: Adiciona nova funcionalidade X'`). *(Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/))*
4. Faça o `push` para a branch (`git push origin feature/minha-feature`).
5. Abra um **Pull Request**.

---

## 🙏 Agradecimentos

- [**Engenharia de Software PUC Minas**](https://www.instagram.com/engsoftwarepucminas/) — Pelo apoio institucional e estrutura acadêmica.
- [**Prof. Dr. João Paulo Aramuni**](https://github.com/joaopauloaramuni) — Pelos ensinamentos em Laboratório de Desenvolvimento de Software, Arquitetura e Padrões de Projeto.

---

## 📄 Licença

Este projeto é distribuído sob a **[Licença MIT](./LICENSE)**.

---

> Desenvolvido para fins acadêmicos no contexto do Laboratório de Desenvolvimento de Software — PUC Minas.