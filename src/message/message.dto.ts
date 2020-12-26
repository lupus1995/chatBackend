export class CreateMessageDto {
  dialogsId: string;
  senderId: string;
  recipient: string;
  message: string;
}

export class UpdateMessageDto extends CreateMessageDto {
  _id: string;
}
