import InputText from "@/shared/components/InputText";
import React, { ReactElement, useEffect, useState } from "react";
import styles from "./index.module.scss";
import Button from "@/shared/components/Button";
import { useDispatch } from "@/shared/store/store";
import { createFrame, getFrames } from "@/shared/store/slices/frames/thunks";
import { useSelector } from "react-redux";
import { selectFrames } from "@/shared/store/slices/frames";
import Textarea from "@/shared/components/Textarea";
import FramesList from "@/shared/components/FramesList";

const Create = (): ReactElement => {
    const dispatch = useDispatch();
    const frames = useSelector(selectFrames);
    const [data, setData] = useState({
        url: "",
        name: "",
        config: "",
        config_viewer: "",
    });

    const change = (e: any) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    };

    const create = () => {
        dispatch(
            createFrame({
                ...data,
                config: eval(
                    "(" +
                        data.config
                            ?.replace(/,\s*}$/, "}")
                            .replace(/^"|"$/g, "") +
                        ")",
                ),
                config_viewer: eval(
                    "(" +
                        data.config_viewer
                            ?.replace(/,\s*}$/, "}")
                            .replace(/^"|"$/g, "") +
                        ")",
                ),
            }),
        );
    };

    useEffect(() => {
        dispatch(getFrames());
    }, []);

    return (
        <div className={styles["create"]}>
            <div className={styles["create-block"]}>
                <h2>Создать запись</h2>
                <InputText
                    placeholder="Название"
                    name="name"
                    onChange={change}
                />
                <InputText placeholder="URL" name="url" onChange={change} />
                {/* <Textarea
                    onChange={change}
                    name="config"
                    rows={10}
                    placeholder="Конфиг Viewer (шаблон: { {sharedMemoryForWorkers: false,cameraUp: [0, -1, 0],initialCameraPosition: [-2, -2, 4],initialCameraLookAt: [0, 1.65, 0]} })"
                />
                <Textarea
                    onChange={change}
                    name="config_viewer"
                    rows={10}
                    placeholder="Конфиг addSplatScene (шаблон: { {showLoadingUI: true,progressiveLoad: true,position: [0, 1, 0],rotation: [0, 0, 0, 1],scale: [1.0, 1.0, 1.0],} })"
                /> */}
                <Button types="primary" onClick={create}>
                    Создать запись
                </Button>
            </div>
            <div className={styles["create-block"]}>
                <h2>Удалить запись</h2>
                <FramesList isDelete frames={frames} />
            </div>
        </div>
    );
};

export default Create;
