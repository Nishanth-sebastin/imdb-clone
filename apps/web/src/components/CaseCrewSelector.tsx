import React, { useState } from 'react';
import { CastMember } from '@/types/movie';
// import { fetchActors, fetchProducers, createActor, createProducer } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, UserPlus, Trash2, Search, Plus } from 'lucide-react';
import { toast } from 'sonner';
import FileUploader from './FileUploader';
import { FileUploadResult } from '@/types/movie';

interface CastCrewSelectorProps {
  cast: CastMember[];
  onChange: (cast: CastMember[]) => void;
}

export default function CastCrewSelector({ cast, onChange }: CastCrewSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMemberIndex, setSelectedMemberIndex] = useState<number | null>(null);

  const hasProducer = cast.some((member) => member.role === 'producer');

  const handleAddCastMember = () => {
    const newMember: CastMember = {
      id: `temp-${Date.now()}`,
      name: '',
      role: 'actor',
      imageUrl: '',
    };
    onChange([...cast, newMember]);
  };

  const handleRemoveCastMember = (index: number) => {
    const newCast = [...cast];
    newCast.splice(index, 1);
    onChange(newCast);
  };

  const handleRoleChange = (index: number, role: 'actor' | 'producer') => {
    // If switching to producer and we already have one
    if (role === 'producer' && hasProducer && cast[index].role !== 'producer') {
      toast.error('Only one producer is allowed');
      return;
    }

    const newCast = [...cast];
    newCast[index] = { ...newCast[index], role };
    onChange(newCast);

    // Clear search when role changes
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleNameChange = (index: number, name: string) => {
    const newCast = [...cast];
    newCast[index] = { ...newCast[index], name };
    onChange(newCast);
  };

  const handleImageChange = (index: number, result: FileUploadResult) => {
    const newCast = [...cast];
    newCast[index] = { ...newCast[index], imageUrl: result.url };
    onChange(newCast);
  };

  const handleSearch = async (index: number, query: string) => {
    setSelectedMemberIndex(index);
    setSearchQuery(query);

    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const memberRole = cast[index].role;
      // const results = memberRole === 'actor' ? await fetchActors(query) : await fetchProducers(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search for cast members');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectPerson = (person: any) => {
    if (selectedMemberIndex === null) return;

    const newCast = [...cast];
    newCast[selectedMemberIndex] = {
      ...newCast[selectedMemberIndex],
      id: person.id,
      name: person.name,
      imageUrl: person.imageUrl || newCast[selectedMemberIndex].imageUrl,
    };
    onChange(newCast);

    // Clear search
    setSearchQuery('');
    setSearchResults([]);
    setSelectedMemberIndex(null);
  };

  const handleCreateNewPerson = async (index: number) => {
    if (!searchQuery) return;

    const memberRole = cast[index].role;
    const name = searchQuery;
    const imageUrl = cast[index].imageUrl;

    try {
      // const newPerson =
      //   memberRole === 'actor' ? await createActor(name, imageUrl) : await createProducer(name, imageUrl);

      // const newCast = [...cast];
      // newCast[index] = {
      //   ...newCast[index],
      //   id: newPerson.id,
      //   name: newPerson.name,
      // };
      // onChange(newCast);

      toast.success(`New ${memberRole} created successfully`);

      // Clear search
      setSearchQuery('');
      setSearchResults([]);
      setSelectedMemberIndex(null);
    } catch (error) {
      console.error('Error creating new person:', error);
      toast.error(`Failed to create new ${memberRole}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-lg font-medium">Cast & Crew</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddCastMember}
          disabled={cast.length >= 5}
          className="text-gold border-gold hover:bg-gold/10"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add Cast/Crew
        </Button>
      </div>

      {cast.length === 0 && (
        <div className="text-cinema-400 text-center py-4 border border-dashed border-cinema-700 rounded-md">
          No cast or crew members added yet
        </div>
      )}

      {cast.map((member, index) => (
        <div key={index} className="p-4 border border-cinema-800 rounded-md space-y-3 bg-cinema-900/50">
          <div className="flex justify-between items-center">
            <div className="flex space-x-3 items-center">
              <User className="text-cinema-400" size={18} />
              <span className="font-medium">Member #{index + 1}</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveCastMember(index)}
              className="h-8 w-8 p-0 text-cinema-400 hover:text-red-500 hover:bg-red-500/10"
            >
              <Trash2 size={16} />
            </Button>
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-3 items-start">
            <div className="space-y-3">
              <div>
                <Label htmlFor={`role-${index}`}>Role</Label>
                <div className="flex mt-1 space-x-2">
                  <Button
                    type="button"
                    variant={member.role === 'actor' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleRoleChange(index, 'actor')}
                    className={member.role === 'actor' ? 'bg-gold text-cinema-950' : ''}
                  >
                    Actor
                  </Button>
                  <Button
                    type="button"
                    variant={member.role === 'producer' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleRoleChange(index, 'producer')}
                    className={member.role === 'producer' ? 'bg-gold text-cinema-950' : ''}
                    disabled={hasProducer && member.role !== 'producer'}
                  >
                    Producer
                  </Button>
                </div>
              </div>

              <div className="relative">
                <Label htmlFor={`name-${index}`}>Name</Label>
                <div className="flex mt-1">
                  <div className="relative flex-1">
                    <Input
                      id={`name-${index}`}
                      placeholder={`Enter ${member.role} name`}
                      value={selectedMemberIndex === index ? searchQuery : member.name}
                      onChange={(e) => handleSearch(index, e.target.value)}
                      onFocus={() => {
                        setSelectedMemberIndex(index);
                        setSearchQuery(member.name);
                      }}
                      className="pr-10"
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cinema-400" size={16} />
                  </div>

                  {searchQuery && selectedMemberIndex === index && (
                    <Button
                      type="button"
                      variant="outline"
                      className="ml-2 whitespace-nowrap"
                      onClick={() => handleCreateNewPerson(index)}
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      Add New
                    </Button>
                  )}
                </div>

                {/* Search results dropdown */}
                {searchResults.length > 0 && selectedMemberIndex === index && (
                  <div className="absolute z-10 mt-1 w-full bg-cinema-800 border border-cinema-700 rounded-md max-h-56 overflow-y-auto">
                    {searchResults.map((result) => (
                      <div
                        key={result.id}
                        className="flex items-center p-2 hover:bg-cinema-700 cursor-pointer"
                        onClick={() => handleSelectPerson(result)}
                      >
                        {result.imageUrl && (
                          <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                            <img src={result.imageUrl} alt={result.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div>{result.name}</div>
                      </div>
                    ))}
                  </div>
                )}

                {isSearching && <div className="text-xs text-cinema-400 mt-1">Searching...</div>}

                {searchQuery && searchResults.length === 0 && !isSearching && selectedMemberIndex === index && (
                  <div className="text-xs text-cinema-400 mt-1">No results found. Click "Add New" to create.</div>
                )}
              </div>
            </div>

            {/* Image uploader */}
            <div className="w-24">
              <Label className="sr-only">Profile Image</Label>
              <FileUploader
                value={member.imageUrl}
                onChange={(result) => handleImageChange(index, result)}
                className="w-24 h-24"
                aspectRatio="aspect-square"
              />
            </div>
          </div>
        </div>
      ))}

      {cast.length >= 5 && <p className="text-xs text-cinema-400">Maximum of 5 cast and crew members allowed</p>}
    </div>
  );
}
