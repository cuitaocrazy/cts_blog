import type { MetaFunction } from "@remix-run/node";
import postsSummaries from "../../tools/posts-summaries.json";
import type { FC } from "react";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [{ title: "CtCtkLfh's Blog" }];
};

type PostSummary = (typeof postsSummaries)[0];
type PostSummaryCardProps = PostSummary;

const PostSummaryCard: FC<PostSummaryCardProps> = (props) => {
  return (
    <Link
      className="rounded-sm overflow-hidden border-y shadow sm:border-x"
      to={`/posts/${props.slug}`}
    >
      <img className="aspect-video" src={props.image} alt="主题图片" />
      <div className="px-2 py-4 space-y-3">
        <div className="font-semibold leading-none tracking-tight">
          {props.title}
        </div>
        <div className="text-sm text-muted-foreground">{props.description}</div>
        <div className="text-sm text-muted-foreground">{props.date}</div>
      </div>
    </Link>
  );
};

export default function Index() {
  return (
    <div className="grid gap-x-4 gap-y-2 sm:grid-cols-2 lg:grid-cols-4 lg:container">
      {postsSummaries.map((ps) => (
        <PostSummaryCard key={ps.slug} {...ps} />
      ))}
    </div>
  );
}
