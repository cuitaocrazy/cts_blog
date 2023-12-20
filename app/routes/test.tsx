import { Button } from "~/components/ui/button";
import { PrismaClient } from "@prisma/client";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader() {
  const prisma = new PrismaClient();
  const users = await prisma.user.findMany({ include: { password: true } });
  return json(users);
}
export default function Home() {
  const users = useLoaderData<typeof loader>();
  return (
    <div>
      <Button>Click me</Button>
      {users.map((user) => {
        return (
          <div key={user.id}>
            <div>{user.name}</div>
            <div>{user.password.secret}</div>
            <div>{user.password.salt}</div>
          </div>
        );
      })}
    </div>
  );
}
