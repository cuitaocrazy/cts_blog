import type { MetaFunction } from "@remix-run/node";
// import posts from "../../tools/posts.json";
// import { Link } from "@remix-run/react";
// import { buttonVariants } from "~/components/ui/button";
// import { cn } from "~/lib/utils";
import Sidebar from "~/components/sidebar";

export const meta: MetaFunction = () => {
  return [{ title: "Cuitao's Blogs" }];
};

// export default function Index() {
//   return (
//     <div>
//       <ul>
//         {posts.map((post: any) => (
//           <li key={post.slug}>
//             <Link
//               className={cn(buttonVariants({ variant: "link" }), "space-x-2")}
//               to={`/posts/${post.slug}`}
//             >
//               <span>{post.title}</span>
//               <span className="text-muted-foreground text-xs">{post.date}</span>
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

export default function Index() {
  return (
    <div className="flex">
      <div className="min-w-[200px]" />
      <Sidebar className="min-w-max w-64 bg-slate-600" />
      <div>a</div>
    </div>
  );
}
