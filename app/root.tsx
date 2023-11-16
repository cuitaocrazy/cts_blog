import { cssBundleHref } from "@remix-run/css-bundle";
import { json } from "@remix-run/node";
import type {
  ActionFunctionArgs,
  LinksFunction,
  LoaderFunctionArgs,
} from "@remix-run/node";
import styles from "./globals.css";

import {
  Form,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { userPrefs } from "./cookies.server";
import type { Theme } from "./utils/typs";
import { useTheme } from "./utils/hooks";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

function ThemeSwitcher() {
  const theme = useTheme();
  return (
    <Form method="post">
      <input
        type="hidden"
        name="theme"
        value={theme === "dark" ? "light" : "dark"}
      />
      <button type="submit" className="">
        {theme === "light" ? "🌙" : "🌞"}
      </button>
    </Form>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userPrefs.parse(cookieHeader)) || {};

  console.log("loader", cookie.theme);
  return json({ theme: (cookie.theme as Theme) || "dark" });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const theme = formData.get("theme") as Theme;
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userPrefs.parse(cookieHeader)) || {};
  cookie.theme = theme;
  console.log(theme);

  console.log(await userPrefs.serialize(cookie));
  return json(undefined, {
    headers: {
      "Set-Cookie": await userPrefs.serialize(cookie),
    },
  });
}

export default function App() {
  const theme = useTheme();
  return (
    <html lang="en" className={theme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <header className="w-full p-4 text-5xl flex content-between">
          CtCtkLfh's Blog
          <ThemeSwitcher />
        </header>
        <main>
          <Outlet />
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
