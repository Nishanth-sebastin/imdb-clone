import MovieFeedback from '../models/movieFeedback.model.js';

export async function createFeedback(data: {
    rating: number;
    review: string;
    user_id: string;
    movie_id: string;
}) {
    try {
        return await MovieFeedback.create(data);
    } catch (error) {
        throw new Error(`Error creating feedback: ${(error as Error).message}`);
    }
}

export async function updateFeedback(movieId: string, userId: string, updateData: any) {
    try {
        return await MovieFeedback.findOneAndUpdate(
            { movie_id: movieId, user_id: userId },
            updateData,
            { new: true }
        );
    } catch (error) {
        throw new Error(`Error updating feedback: ${(error as Error).message}`);
    }
}

export async function findFeedbackByMovieAndUser(movieId: string, userId: string) {
    try {
        return await MovieFeedback.findOne({ movie_id: movieId, user_id: userId })
            .populate("user_id", "name email")
            .lean();
    } catch (error) {
        throw new Error(`Error finding feedback: ${(error as Error).message}`);
    }
}

export async function getMovieFeedbacks(movieId: string) {
    try {
        return await MovieFeedback.find({ movie_id: movieId })
            .populate("user_id", "name email")
            .select("rating review user_id")
            .lean();
    } catch (error) {
        throw new Error(`Error fetching feedbacks: ${(error as Error).message}`);
    }
}