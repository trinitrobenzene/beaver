import { Module } from '@nestjs/common';
import { MelodyService } from './melody.service';
import { MelodyController } from './melody.controller';

@Module({
  controllers: [MelodyController],
  providers: [MelodyService],
})
export class MelodyModule {}
