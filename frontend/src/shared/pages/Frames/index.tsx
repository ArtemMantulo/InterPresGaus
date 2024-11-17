import React, { ReactElement, useEffect } from "react";
import { useDispatch } from "@/shared/store/store";
import { useSelector } from "react-redux";
import { getFrame } from "@/shared/store/slices/frame/thunks";
import { selectFrame } from "@/shared/store/slices/frame";
import { useParams } from "next/navigation";
// import { renderer } from "@/renderer";

const Frames = (): ReactElement => {
    const dispatch = useDispatch();
    const frame = useSelector(selectFrame);
    const params = useParams();

    useEffect(() => {
        if (params?.id) {
            dispatch(getFrame(params.id as string));
        }
    }, [params]);

    useEffect(() => {
        if (frame?.url) {
            // renderer(frame.url);
            import(
                `../../../renderer${frame.renderer_id ? `_${frame.renderer_id}` : ""}`
            ).then((mod) => mod.renderer(frame.url));
            return () => {
                document.querySelector("body > canvas")?.remove();
            };
        }
    }, [frame]);

    return <div></div>;
};

export default Frames;
