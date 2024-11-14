import { IFrame } from "@/shared/types/frames";
import Link from "next/link";
import React, { ReactElement } from "react";
import styles from "./index.module.scss";
import Chevron from "@/public/icons/chevron-down.svg";
import DeleteIcon from "@/public/icons/delete.svg";
import Button from "../Button";
import { useDispatch } from "@/shared/store/store";
import { deleteFrame } from "@/shared/store/slices/frames/thunks";

const Frame = (props: { frame: IFrame; isDelete?: boolean }): ReactElement => {
    const dispatch = useDispatch();
    const { frame, isDelete = false } = props;

    const deleteFrameHandler = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(deleteFrame(String(frame.id)));
    };

    return (
        <Link
            href={
                isDelete ? `/admin/create/${frame.id}/` : `/frames/${frame.id}/`
            }
            className={styles["frame"]}
        >
            <div className={styles["frame-text"]}>
                <span className={styles["frame-text_name"]}>{frame.name}</span>
                <span className={styles["frame-text_id"]}>ID: {frame.id}</span>
            </div>
            <div className={styles["frame-icons"]}>
                {isDelete ? (
                    <Button onClick={deleteFrameHandler}>
                        <DeleteIcon />
                    </Button>
                ) : null}
                <Chevron className={styles["frame-icon"]} />
            </div>
        </Link>
    );
};

export default Frame;
