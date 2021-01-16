export default interface VerifyTokenInterface {
  username: string;
  sub: string;
  iat: number;
  exp: number;
}
