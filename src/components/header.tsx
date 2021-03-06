import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>scoreboard</title>
        <meta name="description" content="some kinda board with scores" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="w-screen fixed inset-0 h-16">
        <div className="h-full max-w-3xl mx-auto flex">
          <div className="my-auto mx-2 underline transition-colors decoration-transparent hover:decoration-black">
            <Link href="/">
              <a>Dashboard</a>
            </Link>
          </div>
          <div className="my-auto mx-2">Random</div>
          <div className="my-auto mx-2">Links</div>
          <div className="flex-grow"></div>
        </div>
      </header>
    </>
  );
};
export default Header;
