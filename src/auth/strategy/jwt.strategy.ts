import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

//クライアントから受け取ったjwtを検証
//正しければペイロードの復元
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  //UseGuardsで指定したキー?
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    //jwtからペイロードの復元
    super({
      //reqのどこにjwtが格納されているか設定
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          let jwt = null;
          if (req && req.cookies) {
            jwt = req.cookies['access_token'];
          }
          return jwt;
        },
      ]),
      ignoreExpiration: false, //有効期限が切れていたら許可しない
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  //返り値は自動的にリクエストに含める
  async validate(payload: { sub: number; email: string }) {
    //復元したidがデータベースに存在するか検証
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });
    delete user.hashedPassword;
    return user; //useGurdがログインしているユーザーのuserオブジェクトを返す
  }
}
