import { getUser, supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import { Auth, Typography, Button } from "@supabase/ui";
import { GetServerSidePropsContext } from "next";
import React from "react";

const Container = ({ children }: { children: React.ReactNode }) => {
    const { user } = useUser();

    if (user)
        return (
            <div className="max-w-3xl mx-auto">
                <Typography.Text>Signed in: {user.email}</Typography.Text>

                <Button block onClick={() => supabaseClient.auth.signOut()}>
                    Sign out
                </Button>
            </div>
        );

    return <div className="max-w-3xl mx-auto">{children}</div>;
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const { user } = await getUser(ctx);

    if (user)
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
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
