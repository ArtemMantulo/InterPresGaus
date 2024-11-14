import { Module } from "@nestjs/common";
import { FramesService } from "src/services/FramesService/frames.service";
import { FramesController } from "src/controllers/FramesController/frames.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Frames } from "src/entities/Frames/frames.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Frames])],
    controllers: [FramesController],
    providers: [FramesService],
})
export class FramesModule {}
