declare module "*.svg" {
    import { FC, SVGProps } from "react";
    const content: FC<SVGProps<SVGElement>>;
    export default content;
}

declare module "@mkkellogg/gaussian-splats-3d";
declare global {
    interface Window {
        token: string;
    }
}

export {};
