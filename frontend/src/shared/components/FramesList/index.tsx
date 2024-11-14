import React, { ReactElement } from "react";
import { IFrame } from "@/shared/types/frames";
import Frame from "../Frame";

const FramesList = (props: { frames: Array<IFrame>; isDelete?: boolean }) => {
    const { frames, isDelete } = props;
    return (
        <div>
            {frames.map((frame, i) => (
                <Frame
                    frame={frame}
                    key={`${frame.url}-${i}`}
                    isDelete={isDelete}
                />
            ))}
        </div>
    );
};

export default FramesList;
