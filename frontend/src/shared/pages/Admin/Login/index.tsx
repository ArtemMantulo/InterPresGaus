import React from "react";
import styles from "./index.module.scss";
import InputText from "@/components/InputText";
import Button from "@/components/Button";
import { useRouter } from "next/router";
import { useDispatch } from "@/shared/store/store";
import { login } from "@/shared/store/slices/auth/thunks";

const Login = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [state, setState] = React.useState({
        username: "",
        password: "",
    });

    const changeValue = (e: any) => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    const submit = () => {
        dispatch(login(state)).then((res) => {
            if (res.payload?.access_token) {
                router.push("/admin/create");
            }
        });
    };

    return (
        <div className={styles["login_wrapper"]}>
            <div className={styles["login"]}>
                <h2>Войти</h2>
                <div className={styles["login_form"]}>
                    <InputText
                        onChange={changeValue}
                        name="username"
                        value={state.username}
                        placeholder="login"
                    />
                    <InputText
                        onChange={changeValue}
                        name="password"
                        value={state.password}
                        type="password"
                        placeholder="password"
                    />
                    <Button onClick={submit} types={"primary"}>
                        Войти
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Login;
