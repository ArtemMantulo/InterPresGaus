import React, { ReactElement, useEffect } from "react";
import styles from "./index.module.scss";
import { useDispatch, useSelector } from "@/shared/store/store";
import { getFrames } from "@/shared/store/slices/frames/thunks";
import FramesList from "@/shared/components/FramesList";
import { selectFrames } from "@/shared/store/slices/frames";

const Main = (): ReactElement => {
    const dispatch = useDispatch();
    const frames = useSelector(selectFrames);

    useEffect(() => {
        dispatch(getFrames());
    }, []);

    return (
        <div className={styles["wrap"]}>
            <h2>Список созданных фреймов test</h2>
            <FramesList frames={frames} />
        </div>
    );
};

export default Main;
