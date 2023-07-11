import { PartialType } from '@nestjs/mapped-types';
import { CreateMelodyDto } from './create-melody.dto';

export class UpdateMelodyDto extends PartialType(CreateMelodyDto) {}
