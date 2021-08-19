import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/graphql', {
      useCreateIndex: true,
    }),
    GraphQLModule.forRoot({ autoSchemaFile: true }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
