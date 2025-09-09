import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { getConnection } from "@/lib/db";

// helper to fetch user by email
async function getUserByEmail(email) {
  const db = await getConnection();
  const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return rows.length > 0 ? rows[0] : null;
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
  const db = await getConnection();

  if (account?.provider === "google") {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [user.email]);

    let dbUser;
    if (rows.length === 0) {
      const [result] = await db.execute(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [user.name || "Google User", user.email, null, "customer"]
      );
      dbUser = { id: result.insertId, name: user.name, email: user.email, role: "customer" };
    } else {
      dbUser = rows[0];
    }

    user.id = dbUser.id;
    user.role = dbUser.role;
  }

  return user; // ⬅️ ye important hai
},


    async jwt({ token, user }) {
      // attach user info to token at login
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
