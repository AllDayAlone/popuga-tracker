import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import eventBus from '../../../helpers/eventBus'
import { UserEvent, UserStreamEvent } from '../../../../../shared/enums'

const prisma = new PrismaClient()

const options = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
  ],
  events: {
    async signIn(message) {
      /* on successful sign in */
      await eventBus.emit({
        name: UserEvent.SignedIn,
        data: { publicId: message.user.id }
      });
    },
    async signOut(message) { /* on signout */ },
    async createUser(message) {
      /* user created */

      await eventBus.emit({
        name: UserStreamEvent.Created,
        data: { user: message.user }
      });

      await eventBus.emit({
        name: UserEvent.Registered,
        data: { user: message.user }
      });
    },
    async updateUser(message) { /* user updated - e.g. their email was verified */ },
    async linkAccount(message) { /* account (e.g. Twitter) linked to a user */ },
    async session(message) { /* session is active */ },
  },
  debug: true
}

export default (req, res) => NextAuth(req, res, options)