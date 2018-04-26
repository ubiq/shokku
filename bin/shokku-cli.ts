#!/usr/bin/env node

import commander from 'commander'
import * as fs from 'fs'
import * as $ from 'shelljs'
import { default as h } from 'handlebars'
import Ora from 'ora'
import _ from 'lodash'

const pJson = require('../package.json')
const config = require('../shokku.config.json')

const ora = new Ora({
  spinner: 'toggle6'
})

commander
  .description('Shokku utility cli for building and uploading docker images')
  .version(pJson.version, '-v, --version')

commander
  .command('generate')
  .alias('g')
  .action(function () {
    ora.text = 'Reading templates from docker/templates dir...'
    ora.start()

    const dockerTemplatesDir = `${__dirname}/../provisioners/docker/templates/`
    const dockerTemplatesFiles = fs.readdirSync(dockerTemplatesDir)
    const dockerTemplates = dockerTemplatesFiles.map(f => {
      return {
        file: f,
        baseDir: dockerTemplatesDir,
        out: `${__dirname}/../../out/docker`
      }
    })

    ora.text = 'Reading templates from ks8/templates dir...'
    ora.info()

    const k8sTemplatesDir = `${__dirname}/../provisioners/k8s/templates/`
    const k8sTemplatesFiles = fs.readdirSync(k8sTemplatesDir)
    const k8sTemplates = dockerTemplatesFiles.map(f => {
      return {
        file: f,
        baseDir: k8sTemplatesDir,
        out: `${__dirname}/../out/k8s`
      }
    })

    ora.text = 'Processing templates...'
    ora.info()

    const templates = dockerTemplates.concat(k8sTemplates)

    templates.forEach(t => {
      ora.text = `Processing template file: ${t.file}`
      const raw = fs.readFileSync(t.baseDir + t.file, 'utf-8')

      ora.text = `Rendering template ${t.file}`
      const template = h.compile(raw)
      const result = template(config)
      ora.text = 'Template rendered'

      $.mkdir('-p', t.out)

      const name = t.file.replace('.tpl', '')
      fs.writeFileSync(`${t.out}/${name}`, result, {
        encoding: 'utf-8'
      })

      ora.text = `Processed template ${name} sucessfully and saved in ${t.out} folder`
      ora.info()
    })
  })

commander
  .command('build [registry]')
  .alias('b')
  .action(function (registry, options) {
    const reg = registry === 'local' ? config.docker.registry.local : config.docker.registry.remote

    ora.text = `Current registry selected ${reg}`
    ora.start()

    if (!$.which('docker')) {
      ora.text = 'Sorry, in order to work properly, this script needs docker to be installed'
      ora.fail()
      process.exit(1)
    }

    config.docker.images.forEach(image => {
      const dev = image.dev
      const name = image.name
      const version = image.version
      const folder = image.folder
      const build = image.build
      const dockerfile = image.dockerfile

      if (registry !== config.docker.registry.local && dev) {
        ora.text = `Skipping dev image ${name} for registry remote`
        ora.warn()
        return
      }

      ora.text = `Building docker image ${name}`
      ora.info()

      const c = `docker build -f provisioners/docker/images/${folder}/${dockerfile} -t ${registry}/${name}:${version} ${build}`
      const result = $.exec(c).code !== 0
      if (result) {
        process.exit(1)
      }
    })
  })

commander
  .command('upload')
  .alias('u')
  .action(function () {
    const registry = config.docker.registry.remote

    if (!$.which('docker')) {
      ora.text = 'Sorry, in order to work properly, this script needs docker to be installed'
      ora.fail()
      process.exit(1)
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

commander.parse(process.argv)
