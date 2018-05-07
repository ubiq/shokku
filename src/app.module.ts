import AppController from '@/app.controller'
import { routes } from '@/app.routes'
import { NetworksRepository } from '@/networks'
import BlacklistModule from '@/server/blacklist/blacklist.module'
import JsonRpcModule from '@/server/jsonrpc/jsonrpc.module'
import TickerModule from '@/server/ticker/ticker.module'
import { MorganMiddleware } from '@nest-middlewares/morgan'
import { Global, MiddlewaresConsumer, Module, RequestMethod } from '@nestjs/common'
import { GraphQLFactory, GraphQLModule } from '@nestjs/graphql'
import GraphQLServerOptions from 'apollo-server-core/dist/graphqlOptions'
import { graphiqlExpress, graphqlExpress } from 'apollo-server-express'
import { GraphiQLData } from 'apollo-server-module-graphiql'
import { graphql } from 'graphql'
import { RouterModule } from 'nest-router'

@Global()
@Module({
  imports: [RouterModule.forRoutes(routes), BlacklistModule, JsonRpcModule, TickerModule, GraphQLModule],
  exports: [NetworksRepository],
  controllers: [AppController],
  components: [NetworksRepository]
})
export class ApplicationModule {
  constructor(private readonly graphQLFactory: GraphQLFactory) {}

  configure(consumer: MiddlewaresConsumer): void {
    // GraphQL
    const typeDefs = this.graphQLFactory.mergeTypesByPaths('./**/*.graphql')
    const schema = this.graphQLFactory.createSchema({ typeDefs })
    const qraphql = graphqlExpress(req => ({ rootValue: req, schema } as GraphQLServerOptions))
    consumer.apply(qraphql).forRoutes({ path: '/graphql', method: RequestMethod.ALL })

    // GraphiQL
    graphiqlExpress(req => ({ endpointURL: '/graphiql' } as GraphiQLData))
    consumer.apply(graphql).forRoutes({ path: '/graphiql', method: RequestMethod.ALL })

    // Morgan
    MorganMiddleware.configure('tiny')
    consumer.apply(MorganMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}
