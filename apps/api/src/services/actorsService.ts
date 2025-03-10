import { prisma } from '@repo/db';

export async function getActors() {
    return await prisma.actor.findMany();
}

export async function createActor(data: { title: string; releaseYear: number }) {
    return await prisma.actor.create({ data });
}
