import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

export default const authOptions({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
});
