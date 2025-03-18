import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/server/db";
import { env } from "@/env";
import bcrypt from "bcryptjs";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    }),
    GitHubProvider({
      clientId: env.AUTH_GITHUB_ID,
      clientSecret: env.AUTH_GITHUB_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        type: { label: "Type", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        // Đăng ký người dùng mới
        if (credentials.type === "signup") {
          if (!credentials.name) {
            throw new Error("Name is required for signup");
          }

          const existingUser = await db.user.findUnique({
            where: { email: credentials.email }
          });

          if (existingUser) {
            throw new Error("Email already in use");
          }

          const hashedPassword = await bcrypt.hash(credentials.password, 10);
          
          const user = await db.user.create({
            data: {
              email: credentials.email,
              name: credentials.name,
              // Lưu mật khẩu đã hash vào một field mới trong model User
              // Bạn cần thêm field này vào schema Prisma
            }
          });

          // Lưu mật khẩu vào bảng riêng để tránh lộ thông tin
          await db.userCredential.create({
            data: {
              userId: user.id,
              password: hashedPassword
            }
          });

          return user;
        }
        
        // Đăng nhập
        const user = await db.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          throw new Error("No user found with this email");
        }

        // Lấy thông tin credential
        const userCredential = await db.userCredential.findUnique({
          where: { userId: user.id }
        });

        if (!userCredential || !userCredential.password) {
          throw new Error("Please sign in with the provider you used to register");
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          userCredential.password
        );

        if (!passwordMatch) {
          throw new Error("Incorrect password");
        }

        return user;
      }
    })
  ],
  session: { strategy: "jwt" },
  secret: env.AUTH_SECRET,
  adapter: PrismaAdapter(db),
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
      },
    }),
    jwt: ({ token, user }) => {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  }
} satisfies NextAuthConfig;
