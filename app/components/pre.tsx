import type { PropsWithChildren } from "react";

type PreProps = PropsWithChildren<{ code: string; language?: string }>;

export default function Pre({
  children,
  code,
  language = "",
  ...other
}: PreProps) {
  console.log(language);
  return (
    <pre {...other}>
      <div className="border-b h-8 flex bg-muted items-center">
        <span className="text-muted-foreground text-sm pl-4">{language}</span>
      </div>
      {children}
    </pre>
  );
}
