import { prisma } from '@repo/db';

export async function getProducers() {
    return await prisma.producer.findMany();
}

export async function addProducer(data: { title: string; releaseYear: number }) {
    return await prisma.producer.create({ data });
}
