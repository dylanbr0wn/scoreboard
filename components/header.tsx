import { User } from "@supabase/supabase-js";

const Header = ({ user }: { user: User | null }) => {
    return (
        <header className="w-screen fixed inset-0 h-16">
            <div className="h-full max-w-3xl mx-auto flex">
                <div className="my-auto mx-2">Some</div>
                <div className="my-auto mx-2">Random</div>
                <div className="my-auto mx-2">Links</div>
                <div className="w-full"></div>
                <div className="my-auto mx-2">{user?.email}</div>
            </div>
        </header>
    );
};
export default Header;
