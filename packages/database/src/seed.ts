/* eslint-disable no-console */
import { PrismaClient } from "../generated/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding database...");

    // Create producers
    const producer1 = await prisma.producer.create({
        data: {
            name: "Christopher Nolan",
        },
    });

    const producer2 = await prisma.producer.create({
        data: {
            name: "Quentin Tarantino",
        },
    });

    // Create actors
    const actor1 = await prisma.actor.create({
        data: {
            name: "Leonardo DiCaprio",
        },
    });

    const actor2 = await prisma.actor.create({
        data: {
            name: "Christian Bale",
        },
    });

    const actor3 = await prisma.actor.create({
        data: {
            name: "Brad Pitt",
        },
    });

    // Create movies and connect producers and actors
    const movie1 = await prisma.movie.create({
        data: {
            name: "Inception",
            year: 2010,
            producerId: producer1.id,
            actors: {
                connect: [{ id: actor1.id }, { id: actor3.id }],
            },
        },
    });

    const movie2 = await prisma.movie.create({
        data: {
            name: "The Dark Knight",
            year: 2008,
            producerId: producer1.id,
            actors: {
                connect: [{ id: actor2.id }],
            },
        },
    });

    const movie3 = await prisma.movie.create({
        data: {
            name: "Once Upon a Time in Hollywood",
            year: 2019,
            producerId: producer2.id,
            actors: {
                connect: [{ id: actor1.id }, { id: actor3.id }],
            },
        },
    });

    console.log("Seeding completed successfully!");
}

main()
    .catch((error) => {
        console.error("Error seeding database:", error);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
