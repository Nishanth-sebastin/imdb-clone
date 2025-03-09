import { prisma } from '@repo/db';

export async function getMovies() {
    return await prisma.movie.findMany();
}

export async function createMovie(data: { title: string; releaseYear: number }) {
    return await prisma.movie.create({ data });
}
