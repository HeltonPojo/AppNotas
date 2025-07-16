# EasyNotes: Sistema de Gerenciamento de Notas

## Visão Geral do Projeto

O EasyNotes é um projeto desenvolvido para a disciplina de Desenvolvimento Web 2, com o objetivo de demonstrar a criação de um aplicativo completo para gerenciar notas. Ele permite aos usuários criar, organizar e visualizar suas anotações. A arquitetura do projeto foi criada para ser modular e escalável, separando claramente as responsabilidades do frontend e do backend. No backend, foi adotado o padrão de arquitetura MVC (Model-View-Controller), trazendo maior organização ao código e facilitando sua manutenção e evolução.

![Diagrama de Arquitetura](https://i.imgur.com/EhW7uM4.png)


## Funcionalidades Principais

- **Criação e Edição de Notas**: Interface amigável para adicionar e modificar notas com suporte a texto formatado.
- **Organização por Pastas**: Capacidade de criar e gerenciar pastas para categorizar notas, melhorando a organização.
- **Autenticação de Usuários**: Sistema de cadastro e login.
- **Interface Responsiva**: Design responsivo para garantir uma experiência consistente em diferentes dispositivos (desktop e mobile).
- **Gerenciamento CRUD Completo**: Controle sobre suas notas e pastas (criar, visualizar, atualizar, deletar).

## Tecnologias Utilizadas
### Frontend
- **React**
- **Vite**
- **TypeScript**
- **Shadcn UI**
- **Tailwind CSS**

### Backend
- **PHP**
- **CodeIgniter 4**: Framework PHP para desenvolvimento web. Ele fornece uma estrutura MVC (Model-View-Controller) que facilita o desenvolvimento de aplicações web robustas e seguras.
- **Firebase/PHP-JWT**: Utilizado para a implementação de JSON Web Tokens (JWT) para autenticação segura de usuários, garantindo que apenas usuários autorizados possam acessar os recursos da API.

### Banco de Dados

- **MySQL**

## Rotas da API

O backend expõe as seguintes rotas RESTful:

### Autenticação
- `POST /api/login`: Autentica um usuário e retorna um token JWT.
- `POST /api/register`: Registra um novo usuário e retorna um token JWT.

### Rotas Protegidas (requerem token JWT):
### Pastas
- `GET /api/pastas`: Lista todas as pastas do usuário autenticado.
- `POST /api/pastas`: Cria uma nova pasta.
- `PUT /api/pastas/{id}`: Atualiza uma pasta existente.
- `DELETE /api/pastas/{id}`: Exclui uma pasta.

### Notas
- `GET /api/notas`: Lista todas as notas do usuário autenticado (suporta filtro por `pasta_id`, paginação por `page` e `limit`).
- `GET /api/notas/{id}`: Retorna uma nota específica.
- `POST /api/notas`: Cria uma nova nota.
- `PUT /api/notas/{id}`: Atualiza uma nota existente.
- `DELETE /api/notas/{id}`: Exclui uma nota.


## Como usar

Para inicializar o processo:

```sh
docker compose up --build
```

Obtenha o nome do conteiner do mysql por:

```sh
docker image ls
```

Entre no banco de dados pelo terminal:

```sh
docker exec -it <nome do conteiner mysql> mysql -u root -p
```

Dentro do banco de dados e dentro do schema de appnotas rodar o script: `./bd/banco.sql`

Para acessar o aplicação basta acessar o endereço ``http://localhost/``
