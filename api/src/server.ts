import 'dotenv/config';
import fastify from 'fastify';
import jwt from '@fastify/jwt'
import { memoriesRoutes } from "./routes/memories";
import cors from '@fastify/cors';
import { authRoutes } from "./routes/auth";

const app = fastify();

app.register(cors, {
    origin: true //todas urls do front podem acessar o back-end
})

app.register(jwt, {
    secret: 'kittycat'
})

app.register(authRoutes)
app.register(memoriesRoutes)

app.listen({
    port: 3333
}).then(() => {
    console.log(`🚀 Server running on port: ${3333}`);
})