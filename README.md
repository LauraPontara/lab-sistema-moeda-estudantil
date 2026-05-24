<!-- [![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=99999999&assignment_repo_type=AssignmentRepo) [![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=99999999) -->

<a href="https://vscode.dev/github/LauraPontara/lab-sistema-moeda-estudantil"><img src="https://img.shields.io/badge/Abrir%20no-VS%20Code-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white" width="200"/></a> <a href="https://codespaces.new/LauraPontara/lab-sistema-moeda-estudantil"><img src="https://img.shields.io/badge/Abrir%20no-Codespaces-181717?style=for-the-badge&logo=github&logoColor=white" width="220"/></a>

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
![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-149ECA?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-latest-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![GitHub license](https://img.shields.io/github/license/LauraPontara/lab-sistema-moeda-estudantil?style=for-the-badge&color=007ec6&logo=opensourceinitiative)
![GitHub last commit](https://img.shields.io/github/last-commit/LauraPontara/lab-sistema-moeda-estudantil?style=for-the-badge&logo=clockify)

---

## 📚 Índice

- [🔗 Links Úteis](#-links-úteis)
- [📖 Histórias de Usuário](#-histórias-de-usuário)
- [📝 Sobre o Projeto](#-sobre-o-projeto)
- [✨ Funcionalidades Principais](#-funcionalidades-principais)
- [🛠 Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [🏗 Arquitetura](#-arquitetura)
  - [Modelo ER (ERD)](#modelo-er-erd)
  - [Modelo Lógico](#modelo-lógico)
  - [Diagramas de Sequência](#diagramas-de-sequência)
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

- 🌐 **Demo Online:** [Acesse a Aplicação Web](link-da-demo-web)
- 📖 **Documentação da API:** [Swagger/OpenAPI](link-para-swagger)
- 📋 **Repositório GitHub:** [github.com/seu-usuario/seu-repositorio](link-do-repositorio)

---

## 📖 Histórias de Usuário

- 🧾 **Release 1:** [Acessar Histórias de Usuário](./docs/historias-de-usuario/historias_de_usuario.md)

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

| Tecnologia        | Versão |
| ----------------- | ------ |
| Next.js           | 16.x   |
| React             | 19.x   |
| TypeScript        | 5.x    |
| Tailwind CSS      | 4.x    |
| Radix UI / shadcn | latest |
| React Hook Form   | latest |
| Zod               | latest |
| Axios             | latest |
| Zustand           | latest |
| Lucide React      | latest |

### 🖥️ Back-end

| Tecnologia            | Versão |
| --------------------- | ------ |
| Node.js               | 22.x   |
| NestJS                | 11.x   |
| TypeScript            | 5.x    |
| Supabase (PostgreSQL) | latest |
| Drizzle ORM           | latest |
| Autenticação          | JWT    |

### ⚙️ Infraestrutura & DevOps

| Tecnologia              | Uso                    |
| ----------------------- | ---------------------- |
| Docker / Docker Compose | Containerização local  |
| Vercel                  | Deploy do front-end    |
| Render                  | Deploy do back-end     |
| GitHub Actions          | CI/CD _(a configurar)_ |

---

## 🏗 Arquitetura

O sistema segue arquitetura **MVC**, com separação clara entre as camadas de apresentação (frontend Next.js), lógica de negócio (backend NestJS) e persistência (Supabase/PostgreSQL via Drizzle ORM).

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
Supabase / PostgreSQL (Banco de Dados)
```

### Diagramas

> Os diagramas serão adicionados conforme produzidos nas sprints. Os arquivos-fonte (.asta ou equivalente) estarão disponíveis na pasta `/docs/diagramas`.

| Diagrama                 | Arquivo                                                                                                             |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| Diagrama de Casos de Uso | [Sistema de moedas estudantil.png](./docs/diagramas/Diagrama-de-caso-de-uso/Sistema%20de%20moedas%20estudantil.png) |
| Diagrama de Classes      | [Diagrama de classes.png](./docs/diagramas/Diagrama-de-classes/Diagrama%20de%20classes.png)                         |
| Diagrama de Componentes  | [Diagrama de componentes.png](./docs/diagramas/Diagrama-de-componentes/Diagrama%20de%20componentes.png)            |
| Modelo ER (ERD)          | [Modelo-ERD.png](./docs/diagramas/Modelo-relacionamento-entidade/Modelo-ERD.png)                                    |
| Modelo Lógico            | [Diagrama-logico.png](./docs/diagramas/Modelo-relacionamento-entidade/Diagrama-logico.png)                          |
| Diagramas de Sequência   | [UC01](./docs/diagramas/Diagrama-de-sequencia/UC01/UC01-FazerLogin.png) · [UC02](./docs/diagramas/Diagrama-de-sequencia/UC02/UC02-GerenciarAluno.png) · [UC03](./docs/diagramas/Diagrama-de-sequencia/UC03/UC03-ConsultarExtrato.png) · [UC04](./docs/diagramas/Diagrama-de-sequencia/UC04/UC04-VisualizarVantagens.png) · [UC05](./docs/diagramas/Diagrama-de-sequencia/UC05/UC05-ResgatarVantagens.png) · [UC06](./docs/diagramas/Diagrama-de-sequencia/UC06/UC06-ReceberCodigoDoCupom.png) · [UC07](./docs/diagramas/Diagrama-de-sequencia/UC07/UC07-EnviarMoedas.png) · [UC08](./docs/diagramas/Diagrama-de-sequencia/UC08/UC08-Receber1000Moedas.png) · [UC09](./docs/diagramas/Diagrama-de-sequencia/UC09/UC09-GerenciarEmpresa.png) · [UC10](./docs/diagramas/Diagrama-de-sequencia/UC10/UC10-GerenciarVantagens.png) · [UC11](./docs/diagramas/Diagrama-de-sequencia/UC11/UC11-GerenciarProfessor.png) · [UC12](./docs/diagramas/Diagrama-de-sequencia/UC12/UC12-GerenciarInstituicaoEstudantil.png) |

### Diagrama de Caso de Uso

![Diagrama de Caso de Uso](./docs/diagramas/Diagrama-de-caso-de-uso/Sistema%20de%20moedas%20estudantil.png)

Fonte editavel: [Sistema de moedas estudantil.asta](./docs/diagramas/Diagrama-de-caso-de-uso/Sistema%20de%20moedas%20estudantil.asta)

### Diagrama de Classes

![Diagrama de Classes](./docs/diagramas/Diagrama-de-classes/Diagrama%20de%20classes.png)

Fonte editavel: [Diagrama de classes.asta](./docs/diagramas/Diagrama-de-classes/Diagrama%20de%20classes.asta)

### Diagrama de Componentes

![Diagrama de Componentes](./docs/diagramas/Diagrama-de-componentes/Diagrama%20de%20componentes.png)

### Modelo ER (ERD)

![Modelo ERD](./docs/diagramas/Modelo-relacionamento-entidade/Modelo-ERD.png)

Fonte editável: [er_sistema_moeda_estudantil.drawio](./docs/diagramas/Modelo-relacionamento-entidade/er_sistema_moeda_estudantil.drawio)

### Modelo Lógico

![Diagrama Lógico](./docs/diagramas/Modelo-relacionamento-entidade/Diagrama-logico.png)

---

### Diagramas de Sequência

Os diagramas de sequência cobrem os 12 casos de uso do sistema, organizados por caso de uso. Os arquivos-fonte `.puml` estão disponíveis em cada subpasta de `/docs/diagramas/Diagrama-de-sequencia/`.

---

#### UC01 — Fazer Login

![UC01 - Fazer Login](./docs/diagramas/Diagrama-de-sequencia/UC01/UC01-FazerLogin.png)

---

#### UC02 — Gerenciar Aluno

![UC02 - Gerenciar Aluno](./docs/diagramas/Diagrama-de-sequencia/UC02/UC02-GerenciarAluno.png)

---

#### UC03 — Consultar Extrato

![UC03 - Consultar Extrato](./docs/diagramas/Diagrama-de-sequencia/UC03/UC03-ConsultarExtrato.png)

---

#### UC04 — Visualizar Vantagens

![UC04 - Visualizar Vantagens](./docs/diagramas/Diagrama-de-sequencia/UC04/UC04-VisualizarVantagens.png)

---

#### UC05 — Resgatar Vantagem

![UC05 - Resgatar Vantagem](./docs/diagramas/Diagrama-de-sequencia/UC05/UC05-ResgatarVantagens.png)

---

#### UC06 — Receber Código do Cupom

![UC06 - Receber Código do Cupom](./docs/diagramas/Diagrama-de-sequencia/UC06/UC06-ReceberCodigoDoCupom.png)

---

#### UC07 — Enviar Moedas

![UC07 - Enviar Moedas](./docs/diagramas/Diagrama-de-sequencia/UC07/UC07-EnviarMoedas.png)

---

#### UC08 — Receber 1000 Moedas

![UC08 - Receber 1000 Moedas](./docs/diagramas/Diagrama-de-sequencia/UC08/UC08-Receber1000Moedas.png)

---

#### UC09 — Gerenciar Empresa

![UC09 - Gerenciar Empresa](./docs/diagramas/Diagrama-de-sequencia/UC09/UC09-GerenciarEmpresa.png)

---

#### UC10 — Gerenciar Vantagens

![UC10 - Gerenciar Vantagens](./docs/diagramas/Diagrama-de-sequencia/UC10/UC10-GerenciarVantagens.png)

---

#### UC11 — Gerenciar Professor

![UC11 - Gerenciar Professor](./docs/diagramas/Diagrama-de-sequencia/UC11/UC11-GerenciarProfessor.png)

---

#### UC12 — Gerenciar Instituição Estudantil

![UC12 - Gerenciar Instituição Estudantil](./docs/diagramas/Diagrama-de-sequencia/UC12/UC12-GerenciarInstituicaoEstudantil.png)

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

🚀 _API disponível em `http://localhost:3001`_

**Terminal 2 — Front-end (Next.js):**

```bash
cd frontend
npm run dev
```

🎨 _Aplicação disponível em `http://localhost:3000`_

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

|              Tela               |  Captura   |
| :-----------------------------: | :--------: |
|       **Página de Login**       | _em breve_ |
|     **Dashboard do Aluno**      | _em breve_ |
| **Envio de Moedas (Professor)** | _em breve_ |
|    **Catálogo de Vantagens**    | _em breve_ |
|      **Extrato de Conta**       | _em breve_ |

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

| 👤 Nome          | 🖼️ Foto                                                                                                                        | :octocat: GitHub                                                                                                                                                    | 💼 LinkedIn                                                                                                                                                                            | 📤 Gmail                                                                                                                                                     |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Eric Leal        | <div align="center"><img src="https://github.com/Eric-Leal.png" width="70px" height="70px" style="border-radius:50%"></div>    | <div align="center"><a href="https://github.com/Eric-Leal"><img src="https://joaopauloaramuni.github.io/image/github6.png" width="50px" height="50px"></a></div>    | <div align="center"><a href="https://linkedin.com/in/ericgleal"><img src="https://joaopauloaramuni.github.io/image/linkedin2.png" width="50px" height="50px"></a></div>                | <div align="center"><a href="mailto:eric@gmail.com"><img src="https://joaopauloaramuni.github.io/image/gmail3.png" width="50px" height="50px"></a></div>     |
| Laura Pontara    | <div align="center"><img src="https://github.com/LauraPontara.png" width="70px" height="70px" style="border-radius:50%"></div> | <div align="center"><a href="https://github.com/LauraPontara"><img src="https://joaopauloaramuni.github.io/image/github6.png" width="50px" height="50px"></a></div> | <div align="center"><a href="https://linkedin.com/in/laura-pontara"><img src="https://joaopauloaramuni.github.io/image/linkedin2.png" width="50px" height="50px"></a></div>            | <div align="center"><a href="mailto:laura@gmail.com"><img src="https://joaopauloaramuni.github.io/image/gmail3.png" width="50px" height="50px"></a></div>    |
| Giuliano Percope | <div align="center"><img src="https://github.com/GiulianoLBP.png" width="70px" height="70px" style="border-radius:50%"></div>  | <div align="center"><a href="https://github.com/GiulianoLBP"><img src="https://joaopauloaramuni.github.io/image/github6.png" width="50px" height="50px"></a></div>  | <div align="center"><a href="https://www.linkedin.com/in/giuliano-lb-percope/"><img src="https://joaopauloaramuni.github.io/image/linkedin2.png" width="50px" height="50px"></a></div> | <div align="center"><a href="mailto:giuliano@gmail.com"><img src="https://joaopauloaramuni.github.io/image/gmail3.png" width="50px" height="50px"></a></div> |

> [!TIP]
> 💡 Atualize os e-mails reais de cada integrante antes de publicar o repositório.

---

## 🤝 Contribuição

1. Faça um `fork` do projeto.
2. Crie uma branch para sua feature (`git checkout -b feature/minha-feature`).
3. Commit suas mudanças (`git commit -m 'feat: Adiciona nova funcionalidade X'`). _(Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/))_
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
