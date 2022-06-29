import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { User } from "@supabase/supabase-js";
import { Button } from "@supabase/ui";
import Link from "next/link";
import { useRouter } from "next/router";

const Header = ({ user }: { user: User | null }) => {
    const router = useRouter();
    return (
        <header className="w-screen fixed inset-0 h-16">
            <div className="h-full max-w-3xl mx-auto flex">
                <div className="my-auto mx-2 underline transition-colors decoration-transparent hover:decoration-black">
                    <Link href="/">
                        <a>Dashboard</a>
                    </Link>
                </div>
                <div className="my-auto mx-2">Random</div>
                <div className="my-auto mx-2">Links</div>
                <div className="w-full"></div>
                <div className="my-auto mx-2">{user?.email}</div>
                <Button
                    block
                    onClick={async () => {
                        await supabaseClient.auth.signOut();
                        router.push("/login");
                    }}
                >
                    Sign out
                </Button>
            </div>
        </header>
    );
};
export default Header;
