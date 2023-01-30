import { User } from '@prisma/client';
// ExpressのReqの方をカスタマイズ
declare module 'express-serve-static-core' {
  interface Request {
    user?: Omit<User, 'hashedPassword'>;
  }
}