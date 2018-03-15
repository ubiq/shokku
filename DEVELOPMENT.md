# Development

So, you're interested in developing Shokku... nice! Then just read this guide and you'll be up and running with a dev environment in 5 minutes or less! 

## Directory structure

In order to understand better the codebase, in the graph below you will see the different important folders and a basic description:

    `|-- bin
          | -- dockerize.js              # rather simple script that allows to parse the config file shokku.config.json to generate docker swarm and compose files (to provision the cluster)
    `|-- docker                          
          | -- templates                 # directory where is stored docker templates in handlebars format
          | -- compose                   # folder where computed templates that dockerize.js produces are stored
          | -- images                    # this directory contains the different docker images that Shokku uses
    `|-- postman                         # contains all the definitions of the API (to be used with Postman)
    `|-- provisioners
          |-- helm                       # stores the definitions to deploy a Shokku cluster in kubernetes (currently not done)
          |-- terraform                  # this provides several terraform recipes that allows to create a docker swarm cluster in Vultr and DigitalOcean
    `|-- src                             # all the source code of the app is stored in this folder (pretty obvious huh?)
    `|-- test                            # directory that contains everything related to testing (again, super obvious right?)
    `|-- sparrow
          |-- sparrow-shokku-provider    # as it names implies, this is a nodejs extension that allows Sparrow (our MetaMask fork) to communicate with Shokku as a provider                

## First steps

Clone the source code:

```bash
$ git clone https://github.com/ubiq/shokku shokku
```

Enter inside the cloned repository:

```bash
$ cd shokku
```

Now inside the folder, you have to install local dependencies. This will allow you to use `dockerize.js` script to generate the docker files that are necessary for docker compose:

```bash
$ npm install
```

The whole configuration and values can be changed in [`shokku.config.js`](https://raw.githubusercontent.com/ubiq/shokku/master/shokku.config.json) file.

For developing locally, you can modify the `domain-local` property to whatever name and domain you want:

```json
{
  "domain": "myshokku.com",
  "domain-local": "myshokku.lan",
  [...]
}
```

After modifying that value to your desire, is recommended to to edit the `/etc/hosts` file (or use a custom DNS like [dnsmasq](http://www.thekelleys.org.uk/dnsmasq/doc.html)) of your operating system and add these entries to it:

```
127.0.0.1     myshokku.lan
127.0.0.1     api.myshokku.lan
127.0.0.1     testnet.api.myshokku.lan
127.0.0.1     mainnet.api.myshokku.lan
```

After you have modified the values at your will you can run `dockerize.js` script like this:

```bash
$ npm run dockerize -- generate
```

The templates are rendered and saved in `docker/compose` folder. Now, with those templates rendered you have to generate docker images:

```bash
$ npm run dockerize -- build local
```

And with the last step finished, you can use docker as usally:

```bash
$ docker-compose -f docker/compose/docker-compose-yaml up
```

Voila! You can open your browser and navigate your domain (or use Postman) to test the API!

## Runing tests

If you want to run the full suite of tests is super easy to do so:

```bash
$ npm run test
```

This will display also the current coverage.

## Linting code

Same as running tests, for linting code you can issue the following command:

```bash
$ npm run lint
```

## Docker images

To be written
