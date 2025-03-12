import React, { useState } from 'react';
import { CastMember } from '@/types/movie';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, UserPlus, Trash2, Search, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import FileUploader from './FileUploader';
import { FileUploadResult } from '@/types/movie';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { useQueryEvents } from '@/helpers/useQueryEvents';
import { FETCH_ACTORS, FETCH_PRODUCERS } from '@/constants';
import { fetchActors, fetchProducers, fetchSingleActor, fetchSingleProducer } from './action';

interface CastCrewSelectorProps {
  cast: CastMember[];
  onChange: (cast: CastMember[]) => void;
}

export default function CastCrewSelector({ cast, onChange }: CastCrewSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMemberIndex, setSelectedMemberIndex] = useState<number | null>(null);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const hasProducer = cast.some((member) => member.role === 'producer');

  const handleAddCastMember = () => {
    const newMember: CastMember = {
      id: ``,
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
    const newCast = [...cast];
    newCast[index] = {
      ...newCast[index],
      role,
      name: '',
      imageUrl: '',
    };
    onChange(newCast);
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

  const { data, isFetching } = useQueryEvents(
    useQuery({
      queryKey: [cast[selectedMemberIndex || 0]?.role === 'producer' ? FETCH_PRODUCERS : FETCH_ACTORS, searchQuery],
      queryFn: () => {
        const role = cast[selectedMemberIndex || 0]?.role;
        return role === 'producer' ? fetchProducers(searchQuery) : fetchActors(searchQuery);
      },
      enabled: !!searchQuery && searchQuery.length >= 2, // Only fetch if searchQuery has at least 2 characters
    }),
    {
      onSuccess: (data) => {
        setSearchResults(data);
      },
      onError: (error) => {
        console.error('Search error:', error);
      },
    }
  );

  useQueryEvents(
    useQuery({
      queryKey: ['person', selectedPersonId],
      queryFn: async () => {
        if (!selectedPersonId || !cast[selectedMemberIndex || 0]?.role) return null;
        return cast[selectedMemberIndex || 0]?.role === 'actor'
          ? fetchSingleActor(selectedPersonId)
          : fetchSingleProducer(selectedPersonId);
      },
      enabled: !!selectedPersonId, // Only fetch when selectedPersonId is set
    }),
    {
      onError: (error) => {
        console.error('Person fetch error:', error);
      },
      onSuccess: (data) => {
        const newCast = [...cast];
        newCast[selectedMemberIndex] = {
          ...newCast[selectedMemberIndex],
          id: data.id,
          name: data.name,
          imageUrl: data.imageUrl,
        };
        onChange(newCast);

        setSearchQuery('');
        setSearchResults([]);
        setSelectedMemberIndex(null);
      },
    }
  );

  const handleSearch = async (index: number, query: string) => {
    setSelectedMemberIndex(index);
    setSearchQuery(query);
  };

  const handleSelectPerson = (person: any) => {
    setSelectedPersonId(person.id);
  };

  const handleRemoveImage = (index: number) => {
    const newCast = [...cast];
    newCast[index] = {
      ...newCast[index],
      imageUrl: '',
    };
    onChange(newCast);
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

      {cast.map((member, index) => {
        return (
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
                      onClick={() => {
                        handleRoleChange(index, 'actor');
                      }}
                      className={member.role === 'actor' ? 'bg-gold text-cinema-950' : ''}
                    >
                      Actor
                    </Button>
                    <Button
                      type="button"
                      variant={member.role === 'producer' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        handleRoleChange(index, 'producer');
                      }}
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
                    {searchQuery.length > 2 &&
                    searchResults.length === 0 &&
                    !isSearching &&
                    selectedMemberIndex === index ? (
                      <div className="relative flex-1">
                        <Input
                          id={`name-${index}`}
                          placeholder={`Enter ${member.role} name`}
                          value={searchQuery}
                          onChange={(e) => {
                            handleSearch(index, e.target.value);
                            handleNameChange(index, e.target.value);
                          }}
                          onFocus={(e) => {
                            handleSearch(index, e.target.value);
                            handleNameChange(index, e.target.value);
                          }}
                          onBlur={() => {
                            setSearchResults([]);
                          }}
                          className="pr-10"
                        />
                        <Search
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cinema-400"
                          size={16}
                        />
                      </div>
                    ) : (
                      <div className="relative flex-1">
                        <Input
                          id={`name-${index}`}
                          placeholder={`Enter ${member.role} name`}
                          value={selectedMemberIndex === index ? searchQuery : member.name}
                          onChange={(e) => {
                            handleSearch(index, e.target.value);
                          }}
                          onFocus={() => {
                            setSelectedMemberIndex(index);
                            setSearchQuery(member.name);
                          }}
                          // onBlur={() => {
                          //   setSearchResults([]);
                          // }}
                          className="pr-10"
                        />
                        <Search
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cinema-400"
                          size={16}
                        />
                      </div>
                    )}
                  </div>

                  {/* Search results dropdown */}
                  {searchResults.length > 0 && selectedMemberIndex === index && (
                    <div className="absolute z-10 mt-1 w-full bg-cinema-800 border border-cinema-700 rounded-md max-h-56 overflow-y-auto">
                      {searchResults.map((result, index) => (
                        <div
                          key={index}
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

                  {searchQuery.length > 2 &&
                    searchResults.length === 0 &&
                    !isSearching &&
                    selectedMemberIndex === index && (
                      <div className="text-xs text-cinema-400 mt-1">
                        No results found. Creating a new {member.role} .
                      </div>
                    )}
                </div>
              </div>

              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {member.imageUrl ? (
                  <div
                    key={index}
                    className="relative group shrink-0 w-20 aspect-[2/3] rounded-md overflow-hidden border border-cinema-800"
                  >
                    <img src={member.imageUrl} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveImage(index)}
                        className="h-8 w-8 p-0 text-white hover:text-red-500 hover:bg-black/50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  !member.imageUrl &&
                  selectedPersonId === member.id &&
                  cast[index].id && (
                    <div
                      key={index}
                      className="relative group shrink-0 w-20 aspect-[2/3] rounded-md overflow-hidden border border-cinema-800 bg-gray-200 flex items-center justify-center"
                    >
                      <img
                        src={'https://via.placeholder.com/100x150?text=No+Image'} // Dynamically using a live placeholder URL
                        alt="Placeholder"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )
                )}
                {!cast[index].id &&
                  !member.imageUrl &&
                  searchQuery.length > 2 &&
                  searchResults.length === 0 &&
                  !isSearching &&
                  selectedMemberIndex === index && (
                    <div className="w-24">
                      <Label className="sr-only">Profile Image</Label>
                      <FileUploader
                        onChange={(result: any) => handleImageChange(index, result)}
                        className="w-full"
                        aspectRatio="aspect-[2/3] max-h-[300px]"
                        multiple={false}
                      />
                    </div>
                  )}
              </div>
            </div>
          </div>
        );
      })}

      {cast.length >= 5 && <p className="text-xs text-cinema-400">Maximum of 5 cast and crew members allowed</p>}
    </div>
  );
}
