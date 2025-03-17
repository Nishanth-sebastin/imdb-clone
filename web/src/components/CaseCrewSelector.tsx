"use client";

import { useState, useRef, useEffect } from "react";
import type { CastMember } from "@/types/movie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, UserPlus, Trash2, Search, Plus, X } from "lucide-react";
import { toast } from "sonner";
import FileUploader from "./FileUploader";
import type { FileUploadResult } from "@/types/movie";
import { useQuery } from "@tanstack/react-query";
import { useQueryEvents } from "@/helpers/useQueryEvents";
import { FETCH_ACTORS, FETCH_PRODUCERS } from "@/constants";
import {
  fetchActors,
  fetchProducers,
  fetchSingleActor,
  fetchSingleProducer,
} from "./action";

interface CastCrewSelectorProps {
  cast: CastMember[];
  onChange: (cast: CastMember[]) => void;
}

export default function CastCrewSelector({
  cast,
  onChange,
}: CastCrewSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMemberIndex, setSelectedMemberIndex] = useState<number | null>(
    null
  );
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [inputValues, setInputValues] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const hasProducer = cast.some((member) => member.role === "producer");

  // Ensure inputValues array is always synced with cast array length
  useEffect(() => {
    if (inputValues.length !== cast.length) {
      setInputValues(cast.map((member) => member.name || ""));
    }
  }, [cast.length]);

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchResults([]);
        setShowCreateNew(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddCastMember = () => {
    const newMember: CastMember = {
      id: "",
      name: "",
      role: "actor",
      imageUrl: "",
    };
    const newCast = [...cast, newMember];
    onChange(newCast);
    setInputValues([...inputValues, ""]);
  };

  const handleRemoveCastMember = (index: number) => {
    const newCast = [...cast];
    newCast.splice(index, 1);
    onChange(newCast);

    const newInputValues = [...inputValues];
    newInputValues.splice(index, 1);
    setInputValues(newInputValues);

    // Reset selected index if the removed item was selected
    if (selectedMemberIndex === index) {
      setSelectedMemberIndex(null);
      setSearchQuery("");
      setSearchResults([]);
    } else if (selectedMemberIndex !== null && selectedMemberIndex > index) {
      // Adjust the selected index if a member before it was removed
      setSelectedMemberIndex(selectedMemberIndex - 1);
    }
  };

  const handleRoleChange = (index: number, role: "actor" | "producer") => {
    const newCast = [...cast];
    newCast[index] = {
      ...newCast[index],
      role,
      name: "",
      id: "",
      imageUrl: "",
    };
    onChange(newCast);

    // Reset search state and input value when role changes
    const newInputValues = [...inputValues];
    newInputValues[index] = "";
    setInputValues(newInputValues);

    if (selectedMemberIndex === index) {
      setSearchQuery("");
      setSearchResults([]);
      setSelectedPersonId(null);
    }
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

  const handleSearch = (index: number, query: string) => {
    setSelectedMemberIndex(index);
    setSearchQuery(query);

    // Update the input value for this index
    const newInputValues = [...inputValues];
    newInputValues[index] = query;
    setInputValues(newInputValues);

    if (query.length >= 2) {
      setIsSearching(true);
    } else {
      setSearchResults([]);
      setShowCreateNew(false);
    }
  };

  // Search query for actors or producers
  const { data, isFetching } = useQueryEvents(
    useQuery({
      queryKey: [
        cast[selectedMemberIndex !== null ? selectedMemberIndex : 0]?.role ===
        "producer"
          ? FETCH_PRODUCERS
          : FETCH_ACTORS,
        searchQuery,
      ],
      queryFn: () => {
        if (selectedMemberIndex === null) return [];
        const role = cast[selectedMemberIndex]?.role;
        return role === "producer"
          ? fetchProducers(searchQuery)
          : fetchActors(searchQuery);
      },
      enabled:
        !!searchQuery &&
        searchQuery.length >= 2 &&
        selectedMemberIndex !== null,
    }),
    {
      onSuccess: (data) => {
        setSearchResults(data);
        setIsSearching(false);
        setShowCreateNew(data.length === 0 && searchQuery.length >= 2);
      },
      onError: (error) => {
        console.error("Search error:", error);
        setIsSearching(false);
      },
    }
  );

  // Query to fetch a single actor or producer when selected
  useQueryEvents(
    useQuery({
      queryKey: [
        "person",
        selectedPersonId,
        selectedMemberIndex !== null ? cast[selectedMemberIndex]?.role : null,
      ],
      queryFn: async () => {
        if (
          !selectedPersonId ||
          selectedMemberIndex === null ||
          !cast[selectedMemberIndex]?.role
        ) {
          return null;
        }

        return cast[selectedMemberIndex]?.role === "actor"
          ? fetchSingleActor(selectedPersonId)
          : fetchSingleProducer(selectedPersonId);
      },
      enabled: !!selectedPersonId && selectedMemberIndex !== null,
    }),
    {
      onError: (error) => {
        console.error("Person fetch error:", error);
        toast.error("Failed to fetch person details");
      },
      onSuccess: (data) => {
        if (data && selectedMemberIndex !== null) {
          const newCast = [...cast];
          newCast[selectedMemberIndex] = {
            ...newCast[selectedMemberIndex],
            id: data.id,
            name: data.name,
            imageUrl: data.imageUrl || "",
          };
          onChange(newCast);

          // Update the input value when we get data
          const newInputValues = [...inputValues];
          newInputValues[selectedMemberIndex] = data.name;
          setInputValues(newInputValues);

          setSearchQuery("");
          setSearchResults([]);
          setSelectedPersonId(null);
          toast.success(`${data.name} added successfully`);
        }
      },
    }
  );

  // This is a completely new implementation of handleSelectPerson
  const handleSelectPerson = (person: any) => {
    console.log("handleSelectPerson called", person);

    if (selectedMemberIndex === null) {
      console.error("No member selected");
      return;
    }

    // Immediately update the UI for better UX
    const newCast = [...cast];

    // Make sure we're working with a valid index
    if (selectedMemberIndex >= 0 && selectedMemberIndex < newCast.length) {
      newCast[selectedMemberIndex] = {
        ...newCast[selectedMemberIndex],
        name: person.name,
        id: person.id,
        imageUrl: person.imageUrl || "",
      };

      // Update the state directly
      onChange(newCast);

      // Update input values
      const newInputValues = [...inputValues];
      newInputValues[selectedMemberIndex] = person.name;
      setInputValues(newInputValues);

      // Set the ID to trigger the fetch query
      setSelectedPersonId(person.id);

      // Clear search UI
      setSearchResults([]);
      setShowCreateNew(false);

      // Show toast confirmation
      toast.success(`${person.name} selected`);
    } else {
      console.error("Invalid member index:", selectedMemberIndex);
    }
  };

  const handleCreateNew = () => {
    if (selectedMemberIndex !== null && searchQuery) {
      // Create a new entry with the current search query as name
      const newCast = [...cast];
      newCast[selectedMemberIndex] = {
        ...newCast[selectedMemberIndex],
        name: searchQuery,
        id: "", // Empty ID indicates this is a new entry
      };
      onChange(newCast);

      // Update the input value
      const newInputValues = [...inputValues];
      newInputValues[selectedMemberIndex] = searchQuery;
      setInputValues(newInputValues);

      setSearchResults([]);
      setShowCreateNew(false);
      toast.success(
        `Creating new ${newCast[selectedMemberIndex].role}: ${searchQuery}`
      );
    }
  };

  const handleRemoveImage = (index: number) => {
    const newCast = [...cast];
    newCast[index] = {
      ...newCast[index],
      imageUrl: "",
    };
    onChange(newCast);
  };

  const handleClearSelection = (index: number) => {
    const newCast = [...cast];
    newCast[index] = {
      ...newCast[index],
      id: "",
      name: "",
      imageUrl: "",
    };
    onChange(newCast);

    // Clear the input value too
    const newInputValues = [...inputValues];
    newInputValues[index] = "";
    setInputValues(newInputValues);

    setSearchQuery("");
  };

  // Handle direct input (without selection from dropdown)
  const handleInputBlur = (index: number) => {
    if (
      inputValues[index] &&
      (!cast[index].id || cast[index].name !== inputValues[index])
    ) {
      // If there's text in the input but no selection was made, use the input text as the name
      const newCast = [...cast];
      newCast[index] = {
        ...newCast[index],
        name: inputValues[index],
      };
      onChange(newCast);
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
        <div
          key={index}
          className="p-4 border border-cinema-800 rounded-md space-y-3 bg-cinema-900/50"
        >
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
                    variant={member.role === "actor" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleRoleChange(index, "actor")}
                    className={
                      member.role === "actor" ? "bg-gold text-cinema-950" : ""
                    }
                  >
                    Actor
                  </Button>
                  <Button
                    type="button"
                    variant={member.role === "producer" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleRoleChange(index, "producer")}
                    className={
                      member.role === "producer"
                        ? "bg-gold text-cinema-950"
                        : ""
                    }
                    disabled={hasProducer && member.role !== "producer"}
                  >
                    Producer
                  </Button>
                </div>
              </div>

              <div className="relative" ref={searchRef}>
                <Label htmlFor={`name-${index}`}>Name</Label>
                <div className="flex mt-1">
                  {member.id && member.name ? (
                    // Selected state with clear button
                    <div className="relative flex-1">
                      <div className="flex items-center border rounded-md px-3 py-2 bg-cinema-800">
                        {member.imageUrl && (
                          <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                            <img
                              src={member.imageUrl || "/placeholder.svg"}
                              alt={member.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <span className="flex-1">{member.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleClearSelection(index)}
                          className="h-6 w-6 p-0 ml-2 text-cinema-400 hover:text-red-500"
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Search input state
                    <div className="relative flex-1">
                      <Input
                        id={`name-${index}`}
                        placeholder={`Search for a ${member.role}`}
                        value={inputValues[index] || ""}
                        onChange={(e) => handleSearch(index, e.target.value)}
                        onFocus={() => {
                          setSelectedMemberIndex(index);
                          // Only update searchQuery if focusing on a field
                          setSearchQuery(inputValues[index] || "");
                        }}
                        onBlur={() => handleInputBlur(index)}
                        className="pr-10"
                      />
                      <Search
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cinema-400"
                        size={16}
                      />
                    </div>
                  )}
                </div>

                {/* Search results dropdown - COMPLETELY REDESIGNED */}
                {searchResults.length > 0 && selectedMemberIndex === index && (
                  <div className="absolute z-10 mt-1 w-full bg-cinema-800 border border-cinema-700 rounded-md max-h-56 overflow-y-auto">
                    {searchResults.map((result, resultIndex) => (
                      <div
                        key={resultIndex}
                        className="p-2 hover:bg-cinema-700 cursor-pointer"
                      >
                        <Button
                          type="button"
                          variant="ghost"
                          className="w-full justify-start p-0 h-auto text-left hover:bg-transparent"
                          onMouseDown={() => {
                            setSelectedPersonId(result.id);
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log("Select button clicked", result);
                            handleSelectPerson(result);
                          }}
                        >
                          <div className="flex items-center w-full">
                            {result.imageUrl && (
                              <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
                                <img
                                  src={result.imageUrl || "/placeholder.svg"}
                                  alt={result.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-grow">{result.name}</div>
                          </div>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Create new option */}
                {showCreateNew && selectedMemberIndex === index && (
                  <div className="absolute z-10 mt-1 w-full bg-cinema-800 border border-cinema-700 rounded-md p-3">
                    <p className="text-sm text-cinema-400 mb-2">
                      No results found. Create new?
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleCreateNew}
                      className="w-full bg-gold text-cinema-950 hover:bg-gold/90"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create "{searchQuery}"
                    </Button>
                  </div>
                )}

                {isSearching && (
                  <div className="text-xs text-cinema-400 mt-1">
                    Searching...
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {member.imageUrl ? (
                <div className="relative group shrink-0 w-20 aspect-[2/3] rounded-md overflow-hidden border border-cinema-800">
                  <img
                    src={member.imageUrl || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
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
                // Show image uploader when there's a name but no image or ID
                member.name &&
                !member.id && (
                  <div className="w-24">
                    <Label className="sr-only">Profile Image</Label>
                    <FileUploader
                      onChange={(result: FileUploadResult) =>
                        handleImageChange(index, result)
                      }
                      className="w-full"
                      aspectRatio="aspect-[2/3] max-h-[300px]"
                      multiple={false}
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      ))}

      {cast.length >= 5 && (
        <p className="text-xs text-cinema-400">
          Maximum of 5 cast and crew members allowed
        </p>
      )}
    </div>
  );
}
