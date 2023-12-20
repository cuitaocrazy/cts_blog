import { cssBundleHref } from "@remix-run/css-bundle";
import { json } from "@remix-run/node";
import type {
  ActionFunctionArgs,
  LinksFunction,
  LoaderFunctionArgs,
} from "@remix-run/node";
import styles from "./globals.css";
import { z } from "zod";
import { parse } from "@conform-to/zod";
import { conform, useForm } from "@conform-to/react";

import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useFetcher,
  useLoaderData,
} from "@remix-run/react";
import { userPrefs } from "./cookies.server";
import type { Theme } from "./utils/typs";
import { useMemo } from "react";
import { ThemeProvider } from "./context/theme";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

const themeSchema = z.object({ theme: z.enum(["light", "dark"]) });

function useTheme(theme: Theme) {
  const fetcher = useFetcher();

  const Form = fetcher.Form;
  const optimisticTheme = fetcher.formData
    ? (fetcher.formData.get("theme") as Theme)
    : theme;

  const [form, { theme: themeField }] = useForm({ id: "theme-form" });

  const ThemeSwitcher = useMemo(() => {
    return function ThemeSwitcher() {
      return (
        <Form method="post" {...form.props}>
          <button
            type="submit"
            className=""
            {...conform.fieldset(themeField)}
            value={optimisticTheme === "dark" ? "light" : "dark"}
          >
            {optimisticTheme === "light" ? "🌙" : "🌞"}
          </button>
        </Form>
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Form, optimisticTheme]);

  return { optimisticTheme, ThemeSwitcher };
}

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = await userPrefs.parse(cookieHeader);
  return json({
    theme: (cookie?.theme === "light" ? "light" : "dark") as Theme,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = parse(formData, { schema: themeSchema });
  if (submission.intent !== "submit" || !submission.value) {
    return null;
  }

  const theme = submission.value.theme;
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await userPrefs.parse(cookieHeader)) || {};

  if (cookie.theme === theme) {
    return null;
  }

  cookie.theme = theme;

  return new Response(null, {
    headers: {
      "Set-Cookie": await userPrefs.serialize(cookie),
    },
  });
}

export default function App() {
  const { optimisticTheme: theme, ThemeSwitcher } = useTheme(
    useLoaderData<typeof loader>().theme
  );

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
          <ThemeProvider value={theme}>
            <Outlet />
          </ThemeProvider>
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
