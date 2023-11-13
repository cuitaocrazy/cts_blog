/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],
  tailwind: true,
  postcss: true,
  watchPaths: ["tools"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
  mdx: async (filename) => {
    const [rehypeHighlight, remarkToc, remarkMath, rehypeKatex] =
      await Promise.all([
        import("rehype-highlight").then((mod) => mod.default),
        import("remark-toc").then((mod) => mod.default),
        import("remark-math").then((mod) => mod.default),
        import("rehype-katex").then((mod) => mod.default),
      ]);

    return {
      remarkPlugins: [remarkToc, remarkMath],
      rehypePlugins: [rehypeHighlight, rehypeKatex],
    };
  },
};
