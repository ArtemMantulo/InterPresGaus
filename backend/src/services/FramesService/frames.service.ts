import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Frames } from "src/entities/Frames/frames.entity";
import { Repository } from "typeorm";

@Injectable()
export class FramesService {
    constructor(
        @InjectRepository(Frames)
        private readonly framesRepository: Repository<Frames>,
    ) {}

    async createFrame(data: Frames): Promise<Frames> {
        const deal = this.framesRepository.create({
            ...data,
        });
        return this.framesRepository.save(deal);
    }

    async getAllFrames(): Promise<Array<Frames>> {
        return (await this.framesRepository.find()).reverse();
    }

    async getFrame(id: string): Promise<Frames> {
        return (
            await this.framesRepository.find({
                where: { id: Number(id) },
            })
        )[0];
    }

    async deleteFrame(id: string): Promise<Array<Frames>> {
        await this.framesRepository.delete({ id: Number(id) });
        return this.framesRepository.find();
    }

    async changeFrame(id: string, data: Frames): Promise<Frames> {
        await this.framesRepository.update(id, data);
        return (
            await this.framesRepository.find({ where: { id: Number(id) } })
        )[0];
    }
}
