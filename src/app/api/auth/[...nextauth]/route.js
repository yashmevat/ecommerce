import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { getConnection } from "../../../../lib/db";

// helper to fetch user by email
async function getUserByEmail(email) {
  const db = getConnection();
  const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows.length > 0 ? result.rows[0] : null;
}

const handler = NextAuth({
  providers: [
    // ✅ Credentials login
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await getUserByEmail(credentials.email);
        if (!user) throw new Error("No user found");

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) throw new Error("Invalid password");

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),

    // ✅ Google login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      const db = getConnection();

      if (account?.provider === "google") {
        const result = await db.query("SELECT * FROM users WHERE email = $1", [user.email]);
        let dbUser;

        if (result.rows.length === 0) {
          const insertResult = await db.query(
            "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
            [user.name || "Google User", user.email, null, "customer"]
          );
          dbUser = insertResult.rows[0];
        } else {
          dbUser = result.rows[0];
        }

        user.id = dbUser.id;
        user.role = dbUser.role;
      }

      return user; // ⬅️ important
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "customer";
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },

  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
