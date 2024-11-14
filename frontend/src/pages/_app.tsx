import "@/styles/globals.scss";
import React, { FC } from "react";
import type { AppProps } from "next/app";
import { wrapper } from "@/shared/store/store";
import { Provider } from "react-redux";
import MaiLayout from "@/shared/layouts/MainLayout";

const App: FC<AppProps> = ({ Component, ...rest }) => {
    const { store, props } = wrapper.useWrappedStore(rest);
    return (
        <Provider store={store}>
            <MaiLayout>
                <Component {...props.pageProps} />
            </MaiLayout>
        </Provider>
    );
};
export default App;
