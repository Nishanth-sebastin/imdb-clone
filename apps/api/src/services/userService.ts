import { prisma } from '@repo/db';

export async function getUsers() {
    return await prisma.actor.findMany();
}

export async function createUser(data: { name: string; age: number }) {
    return await prisma.actor.create({ data });
}
