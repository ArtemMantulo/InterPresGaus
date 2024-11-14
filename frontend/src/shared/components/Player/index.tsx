import React, { ReactElement } from "react";
import Button from "@/components/Button";
import styles from "./index.module.scss";
import Play from "@/public/icons/play.svg";
import PlayerIcon from "@/public/icons/player.svg";
import Donate from "@/public/icons/donate.svg";
import Like from "@/public/icons/like.svg";
import Dislike from "@/public/icons/dislike.svg";
import clsx from "clsx";

const Player = (): ReactElement => {
    return (
        <div className={styles["player"]}>
            <Play />

            <div className={styles["song"]}>
                <img
                    src="/images/song_gag.png"
                    alt=""
                    className={styles["song-poster"]}
                />

                <div className={styles["song-text"]}>
                    <span>Boxplot - Welcome Home</span>
                </div>
            </div>

            <div className={styles["btns"]}>
                <div
                    className={clsx(
                        styles["btns-wrap"],
                        styles["btns-wrap-left"],
                    )}
                >
                    <Button>
                        Cлушать в плеере <PlayerIcon />
                    </Button>
                    <Button>
                        Поддержать проект <Donate />
                    </Button>
                </div>

                <div
                    className={clsx(
                        styles["btns-wrap"],
                        styles["btns-wrap-right"],
                    )}
                >
                    <Button>
                        <Like />
                    </Button>
                    <Button>
                        <Dislike />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Player;
