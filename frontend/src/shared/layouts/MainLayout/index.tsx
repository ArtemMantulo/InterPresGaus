import React, { ReactElement } from "react";
import Header from "@/shared/components/Header";
import Footer from "@/components/Footer";
import styles from "./index.module.scss";

interface IMainLayout {
    children: ReactElement;
}

const MaiLayout = (props: IMainLayout): ReactElement => {
    const { children } = props;

    return (
        <div>
            <Header />
            {children}
            <Footer />
        </div>
    );
};

export default MaiLayout;
