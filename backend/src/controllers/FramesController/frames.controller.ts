import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Patch,
    Post,
    UseGuards,
} from "@nestjs/common";
import { FramesService } from "../../services/FramesService/frames.service";
import { Frames } from "src/entities/Frames/frames.entity";
import { AuthGuard } from "../../guards/AuthGuard/auth.guard";

@Controller()
export class FramesController {
    constructor(private readonly framesService: FramesService) {}

    @Get("frames/get")
    getAllDeals() {
        return this.framesService.getAllFrames();
    }

    @Get("frames/get/:id")
    getFrame(@Param() params: { id: string }) {
        if (params.id) {
            return this.framesService.getFrame(params.id);
        } else {
            throw new HttpException("eror", HttpStatus.NOT_ACCEPTABLE);
        }
    }

    // @UseGuards(AuthGuard)
    @Post("frames/create")
    createFrame(
        @Body()
        {
            name,
            url,
            config,
            config_viewer,
        }: {
            name: string;
            url: string;
            config: Record<string, any>;
            config_viewer: Record<string, any>;
        },
    ) {
        if (name.trim()) {
            return this.framesService.createFrame(
                name,
                url,
                config,
                config_viewer,
            );
        } else {
            throw new HttpException("eror", HttpStatus.NOT_ACCEPTABLE);
        }
    }

    // @UseGuards(AuthGuard)
    @Delete("frames/delete/:id")
    deleteDeal(@Param() params: any) {
        if (params.id) {
            return this.framesService.deleteFrame(params.id);
        } else {
            throw new HttpException("eror", HttpStatus.NOT_ACCEPTABLE);
        }
    }

    @Patch("frames/change/:id")
    changeFrame(
        @Param() params: { id: string },
        @Body() { data }: { data: Frames },
    ) {
        if (params.id) {
            return this.framesService.changeFrame(params.id, data);
        } else {
            throw new HttpException("eror", HttpStatus.NOT_ACCEPTABLE);
        }
    }
}
