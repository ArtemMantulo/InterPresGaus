import React, { ReactElement, TextareaHTMLAttributes } from "react";
import styles from "./index.module.scss";

interface ITextarea extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export type Ref = HTMLTextAreaElement;

const Textarea = React.forwardRef<Ref, ITextarea>(
    (props: ITextarea, realRef): ReactElement => {
        const { ...rest } = props;
        return <textarea {...rest} ref={realRef} className={styles["text"]} />;
    },
);

export default Textarea;
