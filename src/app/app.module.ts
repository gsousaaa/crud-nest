import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeOrmConfig } from 'src/config/typeorm.config';
import { parseEnv } from 'src/config/parse-env';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true, validate: parseEnv}),
    TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: typeOrmConfig
  }), UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
