import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ApplicationsModule } from './applications/applications.module';

@Module({
  imports: [UsersModule, ApplicationsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
