import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshDto {
  @ApiProperty({
    description: 'Refresh token пользователя',
    type: 'string',
  })
  @IsNotEmpty()
  refreshToken: string;
}
