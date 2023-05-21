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
    app.get('/memories',  async () => {
        const memories = await prisma.memory.findMany({
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
    
    app.get('/memories/:id',  async (request) => {
        const { id } = paramsSchema.parse(request.params);
        const memoryExists = await prisma.memory.findUniqueOrThrow({
            where: {
                id
            }
        });

        return memoryExists;
    })
    
    app.post('/memories',  async (request) => {
        const {content, isPublic, coverUrl} = bodySchema.parse(request.body)
        const memory = await prisma.memory.create({
            data: {
                content,
                coverUrl,
                isPublic,
                userId: '4907a9c8-9d69-4f09-abae-baa1b9b06119'
            }
        })

        return memory;
    })
    
    app.put('/memories/:id',  async (request) => {
        const { id } = paramsSchema.parse(request.params);
        const {content, isPublic, coverUrl} = bodySchema.parse(request.body)
        const updatedMemory = await prisma.memory.update({
            where: {
                id
            },
            data: {
                content,
                isPublic,
                coverUrl,
            }
        })

        return updatedMemory
    })
    
    app.delete('/memories/:id',  async (request) => {
        const { id } = paramsSchema.parse(request.params);
        await prisma.memory.delete({
            where: {
                id
            }
        });
    })
}