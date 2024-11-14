import { Module } from "@nestjs/common";
import { AuthService } from "../../services/AuthService/auth.service";
import { AuthController } from "../../controllers/AuthController/auth.controller";
import { UsersModule } from "../../modules/UsersModule/users.module";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "../../contant";

@Module({
    imports: [
        UsersModule,
        JwtModule.register({
            global: true,
            secret: jwtConstants,
            signOptions: { expiresIn: "36000s" },
        }),
    ],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
