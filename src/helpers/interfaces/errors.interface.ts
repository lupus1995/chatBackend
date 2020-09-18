export interface ErrorsInterface {
  errors: {
    [property: string]: {
      name: string;
      message: string;
      properties: {
        message: string;
        type: string;
        path: string;
      };
      kind: string;
      path: string;
    };
  };
  _message: string;
  message: string;
}
