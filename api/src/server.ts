import fastify from 'fastify';
import { memoriesRoutes } from "./routes/memories";
import cors from '@fastify/cors';

const app = fastify();

app.register(cors, {
    origin: true //todas urls do front podem acessar o back-end
})

app.register(memoriesRoutes)

app.listen({
    port: 3333
}).then(() => {
    console.log(`🚀 Server running on port: ${3333}`);
})