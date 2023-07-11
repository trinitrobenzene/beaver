import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MelodyService } from './melody.service';
import { CreateMelodyDto } from './dto/create-melody.dto';
import { UpdateMelodyDto } from './dto/update-melody.dto';

@Controller('melody')
export class MelodyController {
  constructor(private readonly melodyService: MelodyService) {}

  @Post()
  create(@Body() createMelodyDto: CreateMelodyDto) {
    return this.melodyService.create(createMelodyDto);
  }

  @Get()
  index() {
    return this.melodyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.melodyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMelodyDto: UpdateMelodyDto) {
    return this.melodyService.update(+id, updateMelodyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.melodyService.remove(+id);
  }
}
