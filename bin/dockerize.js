#!/usr/bin/env node

/* eslint import/no-extraneous-dependencies: 0 */
/* eslint no-console: 0 */
/* eslint no-unused-expressions: 0 */

const fs = require('fs')
const chalk = require('chalk')
const $ = require('shelljs')
const h = require('handlebars')

const config = require('../shokku.config.json')

const log = console.log

require('yargs')
  .command('generate', 'create shokku docker compose related files', () => {}, () => {
    log(chalk.green('Reading templates from docker/templates dir!'))
    const templatesPath = `${__dirname}/../docker/templates/`
    const templatesFiles = fs.readdirSync(templatesPath)
    templatesFiles.forEach(f => {
      const t = fs.readFileSync(templatesPath + f, 'utf-8')

      log(chalk.green(`Processing file: ${f}!`))

      const template = h.compile(t)
      const result = template(config)

      const name = f.replace('.tpl', '')
      fs.writeFileSync(`${__dirname}/../docker/compose/${name}`, result, { encoding: 'utf-8' })

      log(chalk.green(`File ${name} saved in docker/compose folder!`))
    })
  })
  .command('build [registry]', 'build docker images', yargs => {
    yargs.positional('option', {
      describe: 'registry to build images on. Current options: [remote, local]',
      default: 'local'
    })
  }, argv => {
    const registry = argv.registry === 'local' ? config.docker.registry.local : config.docker.registry.remote

    log(chalk.green(`Current registry selected ${registry}`))

    if (!$.which('docker')) {
      log(chalk.red('Sorry, in order to work properly, this script needs docker to be installed!'))
    }

    config.docker.images.forEach(image => {
      const dev = image.dev
      const name = image.name
      const version = image.version
      const folder = image.folder
      const build = image.build
      const dockerfile = image.dockerfile

      if (registry !== config.docker.registry.local && dev) {
        log(chalk.yellow(`Skipping dev image ${name} for registry remote!`))
        return
      }

      log(chalk.green(`Building docker image ${name}`))

      const c = `docker build -f docker/images/${folder}/${dockerfile} -t ${registry}/${name}:${version} ${build}`
      const result = $.exec(c).code !== 0
      if (result) {
        process.exit(1)
      }
    })
  })
  .command('upload', 'upload docker images to registry', () => {}, () => {
    const registry = config.docker.registry.remote

    if (!$.which('docker')) {
      log(chalk.red('Sorry, in order to work properly, this script needs docker to be installed!'))
    }

    config.docker.images.forEach(image => {
      const name = image.name
      const version = image.version

      const c = `docker push ${registry}/${name}:${version}`
      const result = $.exec(c).code !== 0
      if (result) {
        process.exit(1)
      }
    })
  })
  .argv
