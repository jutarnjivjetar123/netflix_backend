// import NextAuth, { Awaitable, RequestInternal, User } from "next-auth";
// import Credentials from "next-auth/providers/credentials";
// import GithubProvider from "next-auth/providers/github";
// import GoogleProvider from "next-auth/providers/google";
// import { Adapter } from "@next-auth/typeorm-adapter";
// import { compare } from "bcrypt";
// import UserService from "service/user.service";
// export default NextAuth({
//   providers: [
//     GithubProvider({
//       clientId: process.env.GITHUB_ID || "",
//       clientSecret: process.env.GITHUB_SECRET || "",
//     }),
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID || "",
//       clientSecret: process.env.GOOGLE_CLIENT_ID_SECRET || "",
//     }),

//     Credentials({
//       id: "Credentials",
//       name: "Credentials",
//       credentials: {
//         email: {
//           label: "Email",
//           type: "text",
//         },
//         password: {
//           label: "Password",
//           type: "password",
//         },
//       },
//       async authorize(credentials): Promise<User | null> {
//         if (!credentials?.email || !credentials.password) {
//           throw new Error("Email and password are required");
//         }
//         const user = await UserService.getUserByEmail(credentials.email);

//         if (!user || !user.hashedPassword) {
//           throw new Error("Email does not exist");
//         }

//         const isCorrectPassword = await compare(
//           credentials.password,
//           user.hashedPassword
//         );

//         if (!isCorrectPassword) {
//           throw new Error("Incorrect password");
//         }

//         return user;
//       },
//     }),
//   ],
//   pages: {
//     signIn: "/auth",
//   },
//   debug: process.env.NODE_ENV === "development",
//   adapter: Adapter({
//     type: "postgresql",
//     database: ":netflix_clone:",
//     synchronize: true,
//   }),
//   session: {
//     strategy: "jwt",
//   },
//   jwt: {
//     secret: process.env.NEXTAUTH_JWT_SECRET,
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// });
// function authOptions(arg0: {
//   providers: (
//     | import("next-auth/providers/oauth").OAuthConfig<
//         import("next-auth/providers/github").GithubProfile
//       >
//     | import("next-auth/providers/oauth").OAuthConfig<
//         import("next-auth/providers/google").GoogleProfile
//       >
//     | import("next-auth/providers/credentials").CredentialsConfig<{
//         email: { label: string; type: string };
//         password: { label: string; type: string };
//       }>
//   )[];
//   pages: { signIn: string };
//   debug: boolean;
//   adapter: any;
//   session: { strategy: string };
//   jwt: { secret: string };
//   secret: string;
// }) {
//   throw new Error("Function not implemented.");
// }

import NextAuth from "next-auth";
import Providers from "next-auth/providers/github";

const providers = [
  Providers.Github();
];
