# Projeto Final — Guildfy 🧙‍♂️

Projeto acadêmico/educacional que replica funcionalidades básicas do Instagram, com foco em praticar consumo de API REST, autenticação e operações CRUD full-stack.

> ⚠️ Projeto criado exclusivamente para fins de estudo. Não possui vínculo com a Meta/Instagram.

## 🛠️ Tecnologias

**Frontend**
- Vue 3
- Vite

**Backend**
- Laravel
- API REST (CRUD)

**Infraestrutura**
- Docker / Docker Compose

## 📁 Estrutura do projeto

```
PROJETO FINAL/
├── backend/     # API Laravel
├── frontend/    # SPA Vue
├── LICENSE
└── README.md
```

## 🚧 Status

Projeto em desenvolvimento inicial. Funcionalidades planejadas:

- [ ] Autenticação (login/registro)
- [ ] CRUD de posts (criar, curtir, comentar, excluir)
- [ ] Perfil de usuário
- [ ] Seguir/deixar de seguir usuários
- [ ] Upload de imagens
- [ ] Stories

## 🚀 Como rodar o projeto (Docker)

### Pré-requisitos
- [Docker](https://www.docker.com/) e Docker Compose instalados

### Passos

1. Clone o repositório
   ```bash
   git clone <url-do-repositorio>
   cd "PROJETO FINAL"
   ```

2. Configure as variáveis de ambiente do backend
   ```bash
   cd backend
   cp .env.example .env
   ```
   Ajuste as variáveis de banco de dados e demais configurações conforme necessário.

3. Suba os containers do backend
   ```bash
   docker compose up -d --build
   ```

4. Instale as dependências e gere a chave da aplicação (dentro do container)
   ```bash
   docker compose exec app composer install
   docker compose exec app php artisan key:generate
   docker compose exec app php artisan migrate
   ```

5. Suba os containers do frontend
   ```bash
   cd ../frontend
   docker compose up -d --build
   ```

6. Acesse a aplicação
   - Frontend: `http://localhost:PORTA` *(ajustar conforme o `compose.yml`)*
   - Backend/API: `http://localhost:PORTA` *(ajustar conforme o `compose.yml`)*

> 📝 Ajuste as portas acima de acordo com o que estiver definido nos arquivos `compose.yml` de cada pasta.