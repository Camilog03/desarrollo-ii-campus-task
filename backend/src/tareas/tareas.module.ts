import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { TareasController } from './tareas.controller';
import { TareasService } from './tareas.service';

@Module({
  imports: [DatabaseModule],
  controllers: [TareasController],
  providers: [TareasService],
})
export class TareasModule {}
