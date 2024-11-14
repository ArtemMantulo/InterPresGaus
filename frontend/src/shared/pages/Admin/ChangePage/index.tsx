import InputText from "@/shared/components/InputText";
import React, { ReactElement, useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import Button from "@/shared/components/Button";
import { useDispatch } from "@/shared/store/store";
import { createFrame, getFrames } from "@/shared/store/slices/frames/thunks";
import { useSelector } from "react-redux";
import { selectFrames } from "@/shared/store/slices/frames";
import Textarea from "@/shared/components/Textarea";
import FramesList from "@/shared/components/FramesList";
import { useParams } from "next/navigation";
import { changeFrame, getFrame } from "@/shared/store/slices/frame/thunks";
import { selectFrame } from "@/shared/store/slices/frame";

const CreatePage = (): ReactElement => {
    const dispatch = useDispatch();
    const frame = useSelector(selectFrame);
    const ref = useRef(null);
    const [data, setData] = useState({
        name: "",
        url: "",
        config: "",
        config_viewer: "",
    });
    const params = useParams();

    const change = (e: any) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    };

    const changeHandler = () => {
        dispatch(
            changeFrame({
                id: params.id as string,
                data: {
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
                },
            }),
        );
    };

    useEffect(() => {
        if (params?.id) {
            dispatch(getFrame(params.id as string));
        }
    }, [params]);

    useEffect(() => {
        if (frame) {
            setData({
                name: frame.name,
                config: frame.config,
                url: frame.url,
                config_viewer: frame.config_viewer,
            });
        }
    }, [frame]);

    return (
        <div className={styles["change"]}>
            <div className={styles["change-block"]}>
                <h2>Изменить запись</h2>
                <InputText
                    placeholder="Название"
                    name="name"
                    defaultValue={data.name}
                    onChange={change}
                />
                <InputText
                    defaultValue={data.url}
                    placeholder="URL"
                    name="url"
                    onChange={change}
                />
                <Textarea
                    rows={10}
                    placeholder="Конфиг Viewer (шаблон: { {sharedMemoryForWorkers: false,cameraUp: [0, -1, 0],initialCameraPosition: [-2, -2, 4],initialCameraLookAt: [0, 1.65, 0]} })"
                    onChange={change}
                    name="config"
                    defaultValue={data.config}
                    ref={ref}
                />
                <Textarea
                    onChange={change}
                    name="config_viewer"
                    defaultValue={data.config_viewer}
                    rows={10}
                    placeholder="Конфиг addSplatScene (шаблон: { {showLoadingUI: true,progressiveLoad: true,position: [0, 1, 0],rotation: [0, 0, 0, 1],scale: [1.0, 1.0, 1.0],} })"
                />
                <Button types="primary" onClick={changeHandler}>
                    Сохранить
                </Button>
            </div>
        </div>
    );
};

export default CreatePage;
