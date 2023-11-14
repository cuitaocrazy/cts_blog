import { Outlet, useLoaderData } from "@remix-run/react";
import highlightStyles from "highlight.js/styles/github.min.css";
import katexStyles from "katex/dist/katex.css";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import posts from "../../tools/posts.json";

export const links = () => {
  return [
    {
      rel: "stylesheet",
      href: highlightStyles,
    },
    {
      rel: "stylesheet",
      href: katexStyles,
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const parts = url.pathname.split("/");
  const slug = parts[parts.length - 1];
  const post = posts.find((p) => p.slug === slug);
  return json(post);
}

export default function Posts() {
  const post = useLoaderData<typeof loader>();

  return (
    <section className="py-8 sm:py-16 lg:py-20">
      <article className="max-w-3xl mx-auto">
        <header className="text-center">
          <p className="text-muted-foreground">{`${post.date} ~ ${post.estimatedReadTime} min read`}</p>
          <h1 className="text-5xl font-bold mb-8">{post.title}</h1>
        </header>
        <div className="prose prose-xl prose-pre:p-0 prose-pre:border prose-pre:bg-inherit">
          <Outlet />
        </div>
      </article>
    </section>
  );
}