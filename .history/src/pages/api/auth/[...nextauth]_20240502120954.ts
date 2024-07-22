import NextAuth from "next-auth";
import * as emailProvider from "next-auth/providers/email";

export default NextAuth({
    providers: [
      emailProvider.default
  ],
});
