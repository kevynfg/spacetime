import { FastifyInstance } from 'fastify'
import { z } from 'zod';
import { prisma } from "../lib/prisma";
import axios from "axios";

export async function authRoutes (app: FastifyInstance) {
    app.post('/register', async (request, reply) => {
        try {
            console.log('entrou', request.body);

            const bodySchema = z.object({
                code: z.string()
            })
            const parsed = bodySchema.parse(request.body)
            console.log('code ==========', parsed);
            
            const accessTokenResponse = await axios.post(
                `https://github.com/login/oauth/access_token`,
            null, {
                params: {
                    client_id: process.env.GITHUB_CLIENT_ID,
                    client_secret: process.env.GITHUB_CLIENT_SECRET,
                    code: parsed.code
                },
                headers: {
                    Accept: 'application/json'
                }
            })
            const { access_token } = accessTokenResponse.data;
            const userSchema = z.object({
                id: z.number(),
                login: z.string(),
                name: z.string(),
                avatar_url: z.string().url(),
            })
            const userResponse = await axios.get('https://api.github.com/user', {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            });
            const userInfo = userSchema.parse(userResponse.data);
            let user = await prisma.user.findUnique({
                where: {
                    githubId: userInfo.id
                }
            })
            console.log('chegou aqui 1', userInfo);
            if (!user) {
                user = await prisma.user.create({
                    data: {
                        githubId: userInfo.id,
                        login: userInfo.login,
                        name: userInfo.name,
                        avatarUrl: userInfo.avatar_url,
                    }
                })
            }
            console.log('chegou aqui');

            const token = app.jwt.sign({
                name: user.name,
                avatarUrl: user.avatarUrl,
            }, {
                sub: user.id,
                expiresIn: '1d',
            })
            return { token };
        } catch (error) {
            console.log(error);
            reply.send(error)
        }
    })
}