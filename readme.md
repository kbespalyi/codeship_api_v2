# Codeship Build Status

This project displays the status of your Codeship Pro builds to the public via a Node Express app. It uses the new Codeship verson 2 API, and is outlined in detail in [this blog post on Codeship](https://blog.codeship.com/creating-a-custom-build-status-page-using-codeship-api-v2/).

## Local Setup

This project is intended to be run in [Docker containers](https://www.docker.com/). You must also have access to the Codeship version 2 API (to be released September, 2017). To set up this project:

- Clone the repository from Github.
- Copy the `.env.example` file to `.env` and add your Codeship login credentials.
- Build the Docker image: `docker build -t karllhughes/build-status .`.
  - *You can also use the short command if you have NPM installed locally: `npm run build`.*
  - *You can also simply pull the latest image from Docker Hub: `docker pull karllhughes/build-status`.*
- Start a new container: `docker run --rm -it -p 3000:3000 -v $(pwd)/controllers:/app/controllers -v $(pwd)/views:/app/views -v $(pwd)/clients:/app/clients -v $(pwd)/data-access:/app/data-access --env-file .env karllhughes/build-status`.
  - *You can also use the NPM command: `npm start`.*

The application will be running on `localhost:3000`.

## Server Setup

This process will vary depending on how you host your containers. As this is a simple project, I have hosted it at [builds.khughes.me](https://builds.khughes.me/) using [Hyper.sh](https://hyper.sh/). The basic process goes something like this:

- Build the project and push to a container registry.
- Pull the latest version of the image from the container registry to your server.
- Run the application with your environmental variables set. The command will look something like: `docker run -d --restart always -p 80:3000 --env-file .env karllhughes/build-status node index.js`.
  - In Hyper.sh, the command I run is `hyper run -d --restart always -p 80:3000 --env-file .env --name build-status --size=s2 karllhughes/build-status node index.js`.
  - Then I attach an IP: `hyper fip attach XXX.XXX.XX.XXX build-status`.

## Heroku

Push to Heroku with Heroku CLI
This assumes you already have the Heroku CLI installed. Install the Heroku container registry plugin for the cli:

`heroku plugins:install heroku-container-tools`
`heroku plugins:install heroku-container-registry`

And Heroku Docker
`heroku plugins:install heroku-docker`

Login to the registry:
`heroku container:login`

Now create a Heroku app:
`heroku create`

That command will return an app name, copy it to use it for the next command.
`heroku container:push web --app codeship-api-server`

Open heroku console:
`heroku run bash`

Open heroku application
`heroku open -a codeship-api-server`


Push to Heroku with Docker only
The following is good if you’re deploying to Heroku with your CI tool and/or don’t want to install the Heroku CLI.

You’ll need to get your Heroku token which you can get from the cli on any machine that’s logged into Heroku:

`heroku auth:token`

Grab the returned token and from this point on, you don’t need Heroku CLI anymore.

Use the token to login to the Heroku Registry:
`docker login --username=_ --password=${YOUR_TOKEN}` registry.heroku.com

Note: The email and username are actually the underscore, don’t change those.

Heroku deployment docker library [https://github.com/codeship-library/heroku-deployment/tree/master/dockercfg-generator]

Encrypt/Decrypt Heroku env (no forget to take AES key to codeship.aes file from Codeship's project in general settings) [https://documentation.codeship.com/pro/builds-and-configuration/environment-variables/]

`jet encrypt .env heroku.env.encrypted`
`jet decrypt heroku.env.encrypted .env`

And then just push your image:
`docker build -t registry.heroku.com/codeship-api-server/app .`
`docker push registry.heroku.com/codeship-api-server/app`

Now surf to your Heroku app again and you’ll see it live.

If your application responds with an HTTP error status code when we send a request. Please take a look at your logs (e.g. 'heroku logs -t -a codeship-api-server') to check for the cause of those errors and how to fix them.

LOCAL RUNNING:
Install Gem: `gem install foreman`
RUN from local directory:
`foreman start`


## Contributing

Contributions on Github are welcome and appreciated! Submit an issue or pull request with your improvements or suggestions.

## License

This software is offered as-is under the MIT License:

> MIT License
>
> Copyright (c) 2017 Karl L. Hughes
>
> Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
