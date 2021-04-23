# ClubeWinx_backend - Homemate

Homemate é uma aplicação desenvolvida para a disciplica de Projeto em Computação 1, da Universidade Federal de Campina Grande, UFCG.

>  Atualmente, dividir uma locação com outra pessoa já não é uma realidade apenas de estudantes, muitas pessoas optam por essa forma de viver por ser menos custosa, além de proporcionar o  compartilhamento de experiências e aprendizado. Logo, cada vez mais pessoas se interessam em procurar por um(a) colega de apartamento, especialmente que seja compatível com seu modo de ser. Sabendo que essa busca não é trivial, o Homemate tem por objetivo facilitar esses encontros através da solução que faz uso de filtros e recomendações, explorando informações que vão ajudar os usuários a escolherem roomies que tenham afinidades semelhantes, aumentando as chances de uma boa convivência.


---

## Iniciando a aplicação
> Clone do projeto
```shell
$ git clone https://github.com/thaynnara007/ClubeWinx_backend.git
```
> Entre no diretório do projeto
```shell
$ cd ClubeWinx_backend
```
> Em ambiente de desenvolvimento, criei o diretório de logs
```shell
$ mkdir logs
```
> Em ambiente de desenvolvimento, criei o diretório do node_modules
```shell
$ mkdir node_modules
```
> Em ambiente de desenvolvimento, instale as dependências de desenvolvimento
```shell
$ npm install --only=dev
```
> Copie e renomei o arquivo .env-example
```shell
$ cp .env-example .env
```
> Coloque os valores corretos nas variáveis de ambientes definidas no arquivo .env

> Copie e renomei o arquivo firebase.example.json
```shell
$ cp firebase.example.json firebase.json
```
> Coloque os valores das credenciais do firebase no arquivo

> Criando as imagens
```shell
$ docker-compose build
```
> Subindo os containers
```shell
$ docker-compose up
```
> Execute as migrations, se houver
```shell
$ docker-compose run api npm run migrate
```
> Execute as seeds, se houver
```shell
$ docker-compose run api npm run seed
```
> Pronto, agora você poderá acessar:
```
    * A aplicação na porta 3000
    * A documentação em localhost:3000/doc
    * O banco de dados na porta 5432
    * PgAdmin na porta 5050
```
---
## Outras informações

### Git workflow

- A branch master é onde fica a versão estável da aplicação e tambem a versão do código que estará na nuvem. Apenas o código na develop, após testado, deve ser incorporado a essa branch.
- A branch develop é para onde as features desenvolvidades, após terem sido testadas unitariamente, devem ser subidas.
- Após a finalização de uma task, para a mesma deve ser criado um Pull Resquest para a develop.
- Um Pull Request só deve ser aceito depois de ter sido aprovado por pelo menos dois desenvolvedores, excluindo o autor do PR.

### Algums comandos úteis

#### Docker

> Listar containers em execução
```shell
$ docker ps
```
> Listar todos os containers
```shell
$ docker ps -a
```
> Para descer os containers em execução
```shell
$ docker-compose down
```
> Para parar algum container
```shell
$ docker stop <nome_container>
```
> Para remover algum container
```shell
$ docker rm <nome_conatiner>
```
> Listar todas as imagens
```shell
$ docker images -a
```
> Listar todos os volumes
```shell
$ docker volume ls
```
> Para executar um serviço expecífico
```shell
$ docker-compose up <nome_do_serviço>
```
> Para executar algum comando dentro do contexto de um serviço
```shell
$ docker-compose run <nome_do_serviço> <comando>
```
> Apagar os  volumes sem uso do docker
```shell
$ docker volume prune -f 
```
> Apagar as imagens sem uso do docker
```shell
$ docker system prune -a
```
> Forçar a recriação de algum serviço
```shell
$ docker-compose up --build -V --force-recreate <nome_do_serviço> 
```

#### Swagger

> Gerar/atualizar a documentação
```shell
$ npm run swagger-autogen
```

#### Sequelize

> Roda as migrations
```shell
$ npm run migrate
```
> Desfaz a última migration
```shell
$ npm run migrate:undo
```
> Roda as seeds
```shell
$ npm run seed
```

#### Test
> Roda os testes
```shell
$ npm run test
```


### Algums links úteis

* [Swagger-autogen](https://www.npmjs.com/package/swagger-autogen)
* [Sequelize](https://sequelize.org/v5/)
* Link do projeto no [Dockerhub](https://hub.docker.com/repository/docker/thaynnara007/homemate-api-dev)

**IMPORTANTE**: Nunca altere uma migration anterior a menos que você saiba exatamente o que você está fazendo.
