import { getUser, supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import { Auth, Typography, Button } from "@supabase/ui";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import * as React from "react";

const Container = ({ children }: { children: React.ReactNode }) => {
    const { user } = useUser();

    const router = useRouter();

    React.useEffect(() => {
        if (user) {
            router.reload();
        }
    }, [user]);

    if (user)
        return (
            <div className="max-w-xl mt-24 text-center px-5 h-full lg:px-0 lg:max-w-3xl mx-auto my-auto">
                Welcome {user.email}
            </div>
        );

    return (
        <div className="max-w-xl px-5 lg:px-0 lg:max-w-3xl mx-auto">
            {children}
        </div>
    );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const { user, error } = await getUser(ctx);

    if (user)
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    else {
        return {
            props: {},
        };
    }
};

const Login = () => {
    return (
        <Auth.UserContextProvider supabaseClient={supabaseClient}>
            <Container>
                <Auth magicLink supabaseClient={supabaseClient} />
            </Container>
        </Auth.UserContextProvider>
    );
};

export default Login;
