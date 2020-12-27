import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({
    description: 'Id диалога',
    type: 'string',
  })
  dialogsId: string;
  @ApiProperty({
    description: 'Id отправителя',
    type: 'string',
  })
  senderId: string;
  @ApiProperty({
    description: 'Id получателя',
    type: 'string',
  })
  recipient: string;
  @ApiProperty({
    description: 'Сообщение',
    type: 'string',
  })
  message: string;
}
