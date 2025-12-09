import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { createClient } from "./lib/supabase/server";

export const authConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const supabase = await createClient();
          
          // Find user by email
          const { data: users, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", credentials.email)
            .limit(1)
            .single();

          if (error || !users) {
            console.error("User not found:", error);
            return null;
          }

          // Verify password
          const isValid = await bcrypt.compare(
            credentials.password,
            users.password
          );

          if (!isValid) {
            console.error("Invalid password");
            return null;
          }

          // Return user data (excluding password)
          return {
            id: users.id,
            email: users.email,
            name: users.name,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};