import { Injectable } from '@nestjs/common';
import { CreateMelodyDto } from './dto/create-melody.dto';
import { UpdateMelodyDto } from './dto/update-melody.dto';
import { melodyAnalytic } from './lib';

@Injectable()
export class MelodyService {
  create(createMelodyDto: CreateMelodyDto) {
    return 'This action adds a new melody';
  }

  findAll() {
    melodyAnalytic.main();
    return 'OKie';
  }

  findOne(id: number) {
    return `This action returns a #${id} melody`;
  }

  update(id: number, updateMelodyDto: UpdateMelodyDto) {
    return `This action updates a #${id} melody`;
  }

  remove(id: number) {
    return `This action removes a #${id} melody`;
  }
}
