import crypto from "crypto";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const password = process.env.INIT_PASSWORD || "password";
const salt = crypto.randomBytes(16).toString("hex");
const hash = crypto
  .pbkdf2Sync(password, salt, 1000, 64, "sha256")
  .toString("hex");
await prisma.user.create({
  data: {
    name: "Cuitao",
    email: "ctllfh@gmail.com",
    password: {
      create: {
        secret: hash,
        salt: salt,
      },
    },
  },
});
