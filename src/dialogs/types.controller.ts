import { Controller, Get } from '@nestjs/common';
import consts from 'src/helpers/resourse/consts';

@Controller('types')
export class TypesController {
  @Get()
  async getTypes() {
    return [consts.dialogTypeDialog, consts.dialogTypeChat];
  }
}
