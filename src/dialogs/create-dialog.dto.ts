import { ApiProperty } from '@nestjs/swagger';
import { dialogType } from 'src/helpers/types/dialog';

export class CreateDialogDto {
  @ApiProperty({
    description: 'Тип диалогов',
    enum: ['chat', 'dialog'],
  })
  type: dialogType;
  @ApiProperty({
    description: 'Участники диалога',
    type: 'string',
    isArray: true,
  })
  members: string[];
}

export class UpdateDialogDto extends CreateDialogDto {
  @ApiProperty({
    description: 'Id диалога',
    type: 'string',
  })
  _id: string;
}
