import { ApplicationModule } from '@/app.module'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as express from 'express'
import * as SwaggerUI from 'swagger-ui-express'
import * as reflect from 'reflect-metadata'

async function bootstrap() {
  const server = express()
  const app = await NestFactory.create(ApplicationModule, server, {})

  const options = new DocumentBuilder()
    .setTitle('Shokku API')
    .setDescription('An open source scalable blockchain infrastructure for Ubiq, Ethereum and IPFS that runs on Kubernetes')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, options)
  server.use('/swagger', SwaggerUI.serve, SwaggerUI.setup(document))

  await app.listen(3000)
}

bootstrap()
