export interface IFrames {
    frames: Array<IFrame>;
}

export interface IFrame {
    url: string;
    id: number;
    name: string;
    renderer_id: number;
    // config: string;
    // config_viewer: string;
}
