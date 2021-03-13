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
> Coloque os valores corretos nas variáveis de ambientes definidas no .env

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
---
## Outras informações

### Git workflow

- A branch master é onde fica a versão estável da aplicação e tambem a versão do código que estará na nuvem. Apenas o código na develop, após testado, deve ser incorporado a essa branch.
- A branch develop é para onde as features desenvolvidades, após terem sido testadas unitariamente, devem ser subidas.
- Após a finalização de uma task, para a mesma deve ser criado um Pull Resquest para a develop.
- Um Pull Request só deve ser aceito depois de ter sido aprovado por pelo menos dois desenvolvedores, excluindo o autor do PR.

### Algums comandos úteis

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
> Forçar a recriação de algum serviço
```shell
$ docker-compose up --build -V --force-recreate <nome_do_serviço> 
```

**IMPORTANTE**: Nunca altere uma migration anterior a menos que você saiba exatamente o que você está fazendo.