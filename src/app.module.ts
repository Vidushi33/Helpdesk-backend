import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrganizationModule } from './organization/organization.module';
import { UsersModule } from './users/users.module';
import { TicketsModule } from './tickets/tickets.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './config/typeorm';
import { OrganizationStorage } from './common/storage/organization-storage';
import { OrganizationInterceptor } from './common/interceptors/organization.interceptor';
import { CommentsService } from './comments/comments.service';
import { CommentsController } from './comments/comments.controller';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      autoLoadEntities: true,
    }),
    OrganizationModule,
    UsersModule,
    TicketsModule,
    CommentsModule,
  ],
  controllers: [AppController, CommentsController],
  providers: [
    AppService,
    OrganizationStorage,
    {
      provide: 'APP_INTERCEPTOR',
      useClass: OrganizationInterceptor,
    },
    CommentsService,
  ],
})
export class AppModule {}

// Request comes in
//       ↓
// JWT Guard sets request.user
//       ↓
// OrganizationInterceptor runs
//       ↓
// Stores organizationId in AsyncLocalStorage
//       ↓
// Controller executes
//       ↓
// Services execute
//       ↓
// Anywhere:
// organizationStorage.getOrganizationId()
// works
