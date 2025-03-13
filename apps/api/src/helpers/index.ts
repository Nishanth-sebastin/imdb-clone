import Actor from 'src/models/actors.model';
import Producer from 'src/models/producer.model';

export const processCastMembers = async (cast: any) => {
  const processedCast = [];
  const newMemberIds = new Set();

  for (const member of cast) {
    if (member.id) {
      processedCast.push({ id: member.id, role: member.role });
      continue;
    }

    const Model = member.role === 'actor' ? Actor : Producer;
    const newMember = await Model.create({
      name: member.name,
      imageUrl: member.imageUrl,
      movies: [],
    });

    processedCast.push({ id: newMember._id, role: member.role });
    newMemberIds.add(newMember._id);
  }

  return { processedCast, newMemberIds };
};

export const updateExistingMemberReferences = async (processedCast: any[], newMemberIds: any[], movieId: string) => {
  await Promise.all(
    processedCast.map(({ id, role }) => {
      const Model = role === 'actor' ? Actor : Producer;
      return Model.findByIdAndUpdate(id, { $addToSet: { movies: movieId } }, { new: true });
    })
  );
};
