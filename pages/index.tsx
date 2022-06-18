import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useQuery } from "react-query";
import styles from "../styles/Home.module.css";
import { supabase } from "../utils";

const Home: NextPage = () => {
    // const { data, error, isLoading } = useQuery(["sessions"], getSessions, {
    //     onError: (err) => console.log(err),
    // });

    return (
        <div className={styles.container}>
            <Head>
                <title>scoreboard</title>
                <meta
                    name="description"
                    content="some kinda board with scores"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                {/* {data?.map((session) => (
                    <div>
                        {session.id} {session.isOpen ? "true" : "false"}{" "}
                        {session.value}
                    </div>
                ))} */}
            </main>
        </div>
    );
};

export default Home;
