import { Outlet } from "@remix-run/react";
import highlightStyles from "highlight.js/styles/github.min.css";
import katexStyles from "katex/dist/katex.css";
import markdownStyles from "github-markdown-css/github-markdown-light.css";

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
    {
      rel: "stylesheet",
      href: markdownStyles,
    },
  ];
};

export default function Posts() {
  return (
    <div className="markdown-body">
      <Outlet />
    </div>
  );
}
