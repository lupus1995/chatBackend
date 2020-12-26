import { dialogType } from 'src/helpers/types/dialog';

export class CreateDialogDto {
  type: dialogType;
  members: string[];
}

export class UpdateDialogDto extends CreateDialogDto {
  _id: string;
}
