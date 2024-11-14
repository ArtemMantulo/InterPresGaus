import { Module } from "@nestjs/common";
import { UsersService } from "../../services/UsersService/users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Users } from "../../entities/Users/users.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Users])],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
