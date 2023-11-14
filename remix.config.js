import { visit } from "unist-util-visit";
import rh from "rehype-highlight";
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
        enhancedRehypHighlight,
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

function enhancedRehypHighlight(options) {
  const _rh = rh(options);

  return (tree, file) => {
    visit(tree, (node) => {
      if (node?.type === "element" && node?.tagName === "pre") {
        const [codeElement] = node.children;

        if (codeElement.tagName !== "code") {
          return;
        }

        node.properties.code = codeElement.children[0].value;

        if (!codeElement.properties.className) {
          return;
        }

        node.properties.language = codeElement.properties.className[0].slice(
          "language-".length
        );
      }
    });
    _rh(tree, file);
    visit(tree, (node) => {
      if (node?.type === "element" && node?.tagName === "pre") {
        node.tagName = "Pre";
        // node.properties.raw = node.raw;
        // node.properties.language = node.language;
      }
    });
    tree.children.push(preComponentImport);
  };
}

const preComponentImport = {
  type: "mdxjsEsm",
  data: {
    estree: {
      type: "Program",
      body: [
        {
          type: "ImportDeclaration",
          specifiers: [
            {
              type: "ImportDefaultSpecifier",
              local: {
                type: "Identifier",
                name: "Pre",
              },
            },
          ],
          source: {
            type: "Literal",
            value: "~/components/pre",
            raw: '"~/components/pre"',
          },
        },
      ],
      sourceType: "module",
    },
  },
};
// {
//   type: "mdxjsEsm",
//   data: {
//     estree: {
//       type: "Program",
//       body: [
//         {
//           type: "ImportDeclaration",
//           specifiers: [
//             {
//               type: "ImportSpecifier",
//               imported: {
//                 type: "Identifier",
//                 name: "Button",
//               },
//               local: {
//                 type: "Identifier",
//                 name: "Button",
//               },
//             },
//           ],
//           source: {
//             type: "Literal",
//             value: "~/components/ui/button",
//           },
//         },
//       ],
//       sourceType: "module",
//     },
//   },
// };
