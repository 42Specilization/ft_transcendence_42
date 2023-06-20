![logo](./.github/assets/PongGameLogo.png)

# <center> FT_TRANSCENDENCE </center>
<p align="center">
<img alt="Github language count" src="https://img.shields.io/github/languages/count/FtTranscendence42sp/ft_transcendence_42">
<img alt="Github top language" src="https://img.shields.io/github/languages/top/FtTranscendence42sp/ft_transcendence_42">
<img alt="Contributors" src="https://img.shields.io/github/contributors/FtTranscendence42sp/ft_transcendence_42">
<img alt="Github last commit" src="https://img.shields.io/github/last-commit/FtTranscendence42sp/ft_transcendence_42">
</p>

# English
<p align="center"> Content in <a href="#pt-br">PT-BR</a> </p>

## Content
- [About](#about)
- [Tools](#tools)
- [How to use](#configuration)
- [Contributors](#contributors)
#
<p id='about'></p>

## About
The project its about recreate the famous pong game, using new tools, such as React.
#
<p id='tools'></p>

## Tools
- As develop language, TypeSript was used.
- The back-end was develop with [NestJs](https://nestjs.com), a framework of typescript with severals tools that helped developing the project.
- The front-end was develop with [React](https://pt-br.reactjs.org) with typescript, one of the most used frameworks on web developing.
#


<p id='configuration'></p>

## How to use

- If you want to test in your machine you will need to do some configurations to have a complete use of the application.

#### ENVS
``` ts
    ./web/.env

    VITE_API_HOST={Your api host}
    VITE_API_PORT={Your api Port}
    VITE_REDIRECT_LOGIN_URL={Intra redirect url to authentication}
    VITE_GAME_NAMESPACE="game"
    VITE_CHAT_NAMESPACE="chat"
    VITE_STATUS_NAMESPACE="status"
```
``` ts
    ./.production.env

    ACCESS_TOKEN_URI="https://api.intra.42.fr/oauth/token"
    CLIENT_ID={Intra client id}
    CLIENT_SECRET={Intra secret id}
    REDIRECT_URI="http://localhost:8080/oauth"
    URL_ME="https://api.intra.42.fr/v2/me"
    PORT="3000"
    CLIENT_PORT="8080"
    HOST="localhost"

    API_EMAIL_USER='teste@gmail.com'
    API_EMAIL_FROM='Transcendence API <testep@gmail.com>'
    API_EMAIL_PASS='teste'

    JWT_SECRET='jwtsecret'

    DATABASE='postgres'
    DATABASE_TYPE='postgres'
    DATABASE_HOST="localhost"
    DATABASE_USERNAME='pguser'
    DATABASE_PASSWORD='pgpassword'
```

### Dependencies
- Besides the envs, its necesssary install docker-compose to run the app. Command to execute:  
`docker-compose up --build`
 
#

<p id='contributors'></p>

## Contributors
- [gsilva-v](https://github.com/gsilva-v)
- [mmoreira](https://github.com/Matth0s)
- [mavinici](https://github.com/MarcusVinix)




#
#

# PT-BR

<p align="center"> Conteúdo em <a href="#english">Inglês</a> </p>

<p id='conteudos'></p>

## Conteúdos
- [Sobre](#sobre)
- [Ferramentas](#ferramentas)
- [Como criar um arquivo de configuração](#config)
- [Contribuidores](#contribuidores)
#
<p id='sobre'></p>

## Sobre o projeto
O projeto se trata de recriar o famoso jogo pong, utilizando de ferramentas mais atuais, como React por exemplo.
#
<p id='ferramentas'></p>

## Ferrametas
- Como linguagem de desenvolvimento, foi utilizado o TypeScript.
- O back-end foi desenvolvido com [NestJs](https://nestjs.com), um framework para typescript com diversas ferramentas que ajudaram no desenvolvimento do projeto.
- O front-end foi desenvolvido Todo com [React](https://pt-br.reactjs.org), um dos frameworks mais utilizados para desenvolvimento web.
#
<p id='config'></p>

## Como usar
### Caso queira hospedar, como subir o servidor
-  Caso queira subir seu proprio servidor com o projeto, devera fazer algumas configurações para o completo funcionamento das ferramentas.
#### ENVS
``` ts
    ./web/.env

    VITE_API_HOST={Seu host}
    VITE_API_PORT={Sua porta}
    VITE_REDIRECT_LOGIN_URL={Sua url de autenticação com a intra}
    VITE_GAME_NAMESPACE="game"
    VITE_CHAT_NAMESPACE="chat"
    VITE_STATUS_NAMESPACE="status"
```
``` ts
    ./.production.env

    ACCESS_TOKEN_URI="https://api.intra.42.fr/oauth/token"
    CLIENT_ID={Sua chave na intra}
    CLIENT_SECRET={Seu token na intra}
    REDIRECT_URI="http://localhost:8080/oauth"
    URL_ME="https://api.intra.42.fr/v2/me"
    PORT="3000"
    CLIENT_PORT="8080"
    HOST="localhost"

    API_EMAIL_USER='teste@gmail.com'
    API_EMAIL_FROM='Transcendence API <teste@gmail.com>'
    API_EMAIL_PASS='teste'

    JWT_SECRET='jwtsecret'

    DATABASE='postgres'
    DATABASE_TYPE='postgres'
    DATABASE_HOST="localhost"
    DATABASE_USERNAME='pguser'
    DATABASE_PASSWORD='pgpassword'
```

### Pacotes que devem ser intalados
- Alem da criação das envs, é necessario instalar o docker-compose para rodar o  comando para subir o projeto:  `docker-compose up --build`
#
<p id='contribuidores'></p>



## Contribuidores
### Links dos nossos gits
- [gsilva-v](https://github.com/gsilva-v)
- [mmoreira](https://github.com/Matth0s)
- [mavinici](https://github.com/MarcusVinix)




