import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import z from 'zod'

const paramsSchema = z.object({
    id: z.string().uuid()
});

const bodySchema = z.object({
    content: z.string(),
    coverUrl: z.string(),
    isPublic: z.coerce.boolean().default(false)
})

export async function memoriesRoutes(app: FastifyInstance) {
    app.addHook('preHandler', async (request) => {
        await request.jwtVerify();
    })
    
    app.get('/memories',  async (request) => {
        const memories = await prisma.memory.findMany({
            where: {
                userId: request.user.sub,
            },
            orderBy: {
                createdAt: 'asc'
            }
        })
        return memories.map(memory => {
            return {
                id: memory.id,
                coverUrl: memory.coverUrl,
                excerpt: memory.content.substring(0, 115).concat('...'),
            }
        });
    })
    
    app.get('/memories/:id',  async (request, reply) => {
        const { id } = paramsSchema.parse(request.params);
        const memoryExists = await prisma.memory.findUniqueOrThrow({
            where: {
                id
            }
        });

        if (!memoryExists.isPublic && memoryExists.userId !== request.user.sub) {
            return reply.status(401).send('Unauthorized')
        }

        return memoryExists;
    })
    
    app.post('/memories',  async (request) => {
        const {content, isPublic, coverUrl} = bodySchema.parse(request.body)
        const memory = await prisma.memory.create({
            data: {
                content,
                coverUrl,
                isPublic,
                userId: request.user.sub,
            }
        })

        return memory;
    })
    
    app.put('/memories/:id',  async (request, reply) => {
        const { id } = paramsSchema.parse(request.params);
        const {content, isPublic, coverUrl} = bodySchema.parse(request.body)
        let memory = await prisma.memory.findUniqueOrThrow({
            where: {
                id,
            }
        })
        
        if (memory.userId !== request.user.sub) {
            return reply.status(401).send('Unauthorized')
        }
        
        memory = await prisma.memory.update({
            where: {
                id
            },
            data: {
                content,
                isPublic,
                coverUrl,
            }
        })

        return memory
    })
    
    app.delete('/memories/:id',  async (request, reply) => {
        const { id } = paramsSchema.parse(request.params);
        const memory = await prisma.memory.findUniqueOrThrow({
            where: {
                id,
            }
        })
        
        if (memory.userId !== request.user.sub) {
            return reply.status(401).send('Unauthorized')
        }
        
        await prisma.memory.delete({
            where: {
                id
            }
        });
    })
}