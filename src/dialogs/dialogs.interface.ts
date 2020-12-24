export interface GetAllDialogsInterface {
  company: {
    fullname: string;
    _id: string;
  };
  message: string;
  date: number;
  senderId: string;
  recipientId: string;
}
