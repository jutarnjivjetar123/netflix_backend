import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import authOptions from '../../../../.history/src/pages/api/auth/[...nextauth]_20240502115816';

export default authOptions({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
});
