import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Request } from 'express';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true })); //設定したdtoに含まれない属性が送られたら省く
  app.enableCors({
    credentials: true, //フロントバック間のjwt受け渡しをcookieで行う
    origin: [
      'http://localhost:3000',
      // 'https://frontend-todo-nextjs.vercel.app',
    ],
  });
  app.use(cookieParser()); //フロントから受け取ったcookieを解析

  app.use(
    csurf({
      cookie: {
        //csrf-tokenをcookieに格納
        httpOnly: true, //csrf発行のsecretをjsで読み込ませない
        sameSite: 'none',
        secure: true,
      },
      //csrf-tokenをcsurfに返却する処理
      //csurfがcookieからsecretを取り出し、ハッシュにかける
      //ここで送ったtokenとハッシュ化したtokenが一致するか検証
      value: (req: Request) => {
        return req.header('csrf-token');
      },
    }),
  );
  await app.listen(process.env.PORT || 3005);
}
bootstrap();
