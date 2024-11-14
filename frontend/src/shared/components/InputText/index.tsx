import React, { ReactElement, forwardRef } from "react";
import styles from "./index.module.scss";
import clsx from "clsx";

export type Ref = HTMLInputElement;

interface IInputText extends React.TextareaHTMLAttributes<HTMLInputElement> {
    a?: boolean;
    placeholder?: string;
    name?: string;
    type?: string;
}

const InputText = React.forwardRef<Ref, IInputText>(
    (props: IInputText, realRef): ReactElement => {
        const { className = "", type = "text", ...rest } = props;
        return (
            <input
                {...rest}
                ref={realRef}
                className={clsx(styles["input"], className)}
                type={type}
            />
        );
    },
);

export default InputText;
