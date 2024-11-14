import { Module } from "@nestjs/common";
import { FramesModule } from "./modules/FramesModule/frames.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./modules/AuthModule/auth.module";
import { AuthController } from "./controllers/AuthController/auth.controller";
import { AuthService } from "./services/AuthService/auth.service";
import { UsersModule } from "./modules/UsersModule/users.module";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "postgres",
            // host: "localhost",
            host: process.env.NODE_ENV == "dev" ? "127.0.0.1" : "db",
            port: 5432,
            username: "postgres",
            password: "postgres",
            database: "postgres",
            autoLoadEntities: true,
            synchronize: false,
        }),
        FramesModule,
        AuthModule,
        UsersModule,
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AppModule {}
