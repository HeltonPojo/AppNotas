### Projeto para a matéria de Desenvolvimento Web 2

Esse é um projeto para a disciplina de Desenvolvimento web que tem o intuito de implementar um aplicativo que cria um CRUD de notas com pastas e imagens

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
