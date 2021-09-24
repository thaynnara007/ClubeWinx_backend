## Se é sua primeira vez, fazer esses 2 passos antes de continuar:

> login no heroku
```sh
$ heroku login
```

> login no sistema de registro de containers do heroku
```sh
$ heroku container:login
```

## Fazendo o deploy

> subindo o container (estar no mesmo diretorio que o Dockerfile da aplicação)
```sh
$ heroku container:push web --app <aplicação_nome>
```

> criando database
```sh
$ heroku addons:create heroku-postgresql:hobby-dev --app <aplicação_nome>
```

> adicione as variaveis de ambiente
```sh
$ heroku config:set <variavel>=<valor> --app <aplicação_nome>
```

> fazendo o release da aplicação
```sh
$ heroku container:release web --app <aplicação_nome>
```

> Abrindo a aplicação no browser
```sh
$ heroku open --app <aplicação_nome>
```


## migrations

> entrar no bash do container
```sh
$ heroku run sh --app <aplicação_nome>
```

> rode as migrations e seeds (NODE_ENV deve estar com production)
```sh
$ npm run migrate && npm run seed
```


## Logs

```sh
$ heroku logs --tail
```
