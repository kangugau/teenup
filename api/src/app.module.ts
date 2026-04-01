import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ParentsModule } from './parents/parents.module';
import { StudentsModule } from './students/students.module';
import { ClassesModule } from './classes/classes.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { RegistrationsModule } from './registrations/registrations.module';

@Module({
  imports: [PrismaModule, ParentsModule, StudentsModule, ClassesModule, SubscriptionsModule, RegistrationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
