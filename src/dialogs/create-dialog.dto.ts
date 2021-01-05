import { ApiProperty } from '@nestjs/swagger';

export class CreateDialogDto {
  @ApiProperty({
    description: 'Тип диалогов',
    enum: ['chat', 'dialog'],
  })
  type: string;
  @ApiProperty({
    description: 'Участники диалога',
    type: 'string',
    isArray: true,
  })
  members: string[];
}
