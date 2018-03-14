<div align="center">
  <p>:zap::zap::zap: An open source scalable blockchain infrastructure for Ubiq, Ethereum and IPFS :zap::zap::zap:</p>
</div>

<div align="center">
  <a href="https://raw.githubusercontent.com/ubiq/shokku/master/LICENSE.md">
    <img alt="License" src="https://img.shields.io/badge/License-Apache%202.0-blue.svg">
  </a>
  <a href="https://travis-ci.org/ubiq/shokku" target="_blank">
    <img alt="Travis" src="https://travis-ci.org/ubiq/shokku.svg?branch=master" />
  </a>
  <a href="https://codecov.io/gh/ubiq/shokku" target="_blank">
    <img alt="codecov" src="https://codecov.io/gh/ubiq/shokku/branch/master/graph/badge.svg" />
  </a>
  <a href="https://david-dm.org/ubiq/shokku" target="_blank">
    <img alt="Dependency Status" src="https://david-dm.org/ubiq/shokku.svg" />
  </a>
  <a href="https://david-dm.org/ubiq/shokku?type=dev" target="_blank">
    <img alt="devDependency Status" src="https://david-dm.org/ubiq/shokku/dev-status.svg" />
  </a>
  <h1>
    <img width="100%" heigth="100%" src="https://raw.githubusercontent.com/ubiq/shokku/master/assets/shokku.jpg" alt="shokku-logo">
    <p>Shokku</p>
  </h1>
</div>

**Note**: Until further notice, this project is in heavy development mode (don't expect everything to work out of the box, also the documentation is lacking and many more)!

## Description

Shokku provides you with a complete way of having your own infrastructure for Ubiq and Ethereum (soon) nodes (pretty much like Infura does), exposing them with a nice JSON API, allowing you to have full control on the whole process.

If you want, you can try the live service hosted in [https://api.shokku.com](https://api.shokku.com) (to be deployed soon).

## Motivation

If you're asking why the existence of this project, I recommend you to read [this Medium article](https://medium.com/) (to be released soon) where I explain the reasoning in more detail.

## Development Setup

Please see [DEVELOPMENT](DEVELOPMENT.md) for more information.

## Deployment

Please see [DEPLOYMENT](DEPLOYMENT.md) for more details and options.

## TODO

Towards releasing version 1.0.0, there are several tasks that need attention. We're using Github Issues to track everything, with a sweet flavor of Waffle to have a better overall overview.

A couple of tasks that would be awesome to have help would be:

- [ ] Configure services like travis, waffle...
- [ ] Finish properly tests and make lint happy
- [ ] Finish Docker [DigitalOcean](http://digitalocean.com/) provisioner.
- [ ] Finish Docker [Vultr](http://vultr.com/) provisioner.
- [ ] Provide a better way to backup blockchain data (in case of Gubiq instances) to spin up quickly more instances without downloading the whole blockchain.
- [ ] Create [Terraform](https://www.terraform.io/) provisioner for setting up a [Kubernetes](https://kubernetes.io/) cluster tailored for Shokku.
- [ ] Create a set of [Helm](https://helm.sh/) recipes for spining Shokku inside a Kubernetes cluster.
- [ ] Add support to Ethereum nodes. Improve API to allow having Ubiq and Ethereum options (or to spin one or another depending on needs).
- [ ] Add complete support to [IPFS](https://ipfs.io/) nodes.
- [ ] Add rate limiting usage to the API.
- [ ] Add permissions to use the API with proper JWT sessions (have a better control access).
- [ ] Improve session API stickiness with [Traefik](https://traefik.io/) (at least for Docker Swarm).
- [ ] Prepare the code to scale and support heavy load.
- [ ] Increase code coverage.

## Contributing

Please see [CONTRIBUTING](CONTRIBUTING.md) for details.

## Backers

These are super hero members that have contributed in a meaningful way to the project (with a donation, with code, with documentation, with coffee...):

- [ ] Don't be shy and help! You'r name will be here ;)

## Donations

Donations are very important to us as it will help to keep this project moving! ❤❤❤

> Ubiq Address: 0x83B07FC91522e64Dac623a49Da5967d433aD1a4B | [View address on ubiqscan](https://ubiqscan.io/address/0x83b07fc91522e64dac623a49da5967d433ad1a4b)

## Acknowledgements

- Thanks to Pablo ([@ataliano](https://twitter.com/ataliano)) for creating this awesome logo!

## Support

- Join the #shokku channel in our public Discord group. Sign up at [https://discord.gg/HF6vEGF](https://discord.gg/HF6vEGF).
- File an issue on GitHub (double check that there's no duplicates).
- Tweet to or DM [@aldoborrero](https://twitter.com/aldoborrero).

## License

Everything is licensed with the Apache License 2.0 (Apache). 

Please see [License File](LICENSE.md) for more information.
