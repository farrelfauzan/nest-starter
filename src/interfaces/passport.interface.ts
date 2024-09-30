import { TokenType } from 'src/types/enums';

export interface PassportPayload {
  id: string;
  authEntityType: number;
  type: TokenType;
  iat: number;
  exp: number;
}
