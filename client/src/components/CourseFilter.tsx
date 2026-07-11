import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Filter, X } from "lucide-react";

interface CourseFilterProps {
  onFilterChange?: (filters: FilterState) => void;
  categories?: string[];
  difficulties?: string[];
}

interface FilterState {
  categories: string[];
  difficulties: string[];
}

const CATEGORIES = [
  "Programming",
  "Web Development",
  "Data Science",
  "Mathematics",
  "Algorithms",
  "Databases",
  "DevOps",
  "AI/ML",
];

const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

export default function CourseFilter({
  onFilterChange,
  categories = [],
  difficulties = [],
}: CourseFilterProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categories);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>(difficulties);
  const [isOpen, setIsOpen] = useState(false);

  const handleCategoryToggle = (category: string) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(updated);
    onFilterChange?.({ categories: updated, difficulties: selectedDifficulties });
  };

  const handleDifficultyToggle = (difficulty: string) => {
    const updated = selectedDifficulties.includes(difficulty)
      ? selectedDifficulties.filter((d) => d !== difficulty)
      : [...selectedDifficulties, difficulty];
    setSelectedDifficulties(updated);
    onFilterChange?.({ categories: selectedCategories, difficulties: updated });
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedDifficulties([]);
    onFilterChange?.({ categories: [], difficulties: [] });
  };

  const activeFilterCount = selectedCategories.length + selectedDifficulties.length;

  return (
    <div className="space-y-4">
      {/* Filter Toggle Button */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2 w-full sm:w-auto"
      >
        <Filter className="w-4 h-4" />
        Filters
        {activeFilterCount > 0 && (
          <Badge variant="secondary" className="ml-2">
            {activeFilterCount}
          </Badge>
        )}
      </Button>

      {/* Filter Panel */}
      {isOpen && (
        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Filter Courses</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="gap-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Categories */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Categories</h3>
              <div className="space-y-2">
                {CATEGORIES.map((category) => (
                  <label
                    key={category}
                    className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-slate-50"
                  >
                    <Checkbox
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => handleCategoryToggle(category)}
                    />
                    <span className="text-sm text-slate-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Difficulties */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Difficulty Level</h3>
              <div className="space-y-2">
                {DIFFICULTIES.map((difficulty) => (
                  <label
                    key={difficulty}
                    className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-slate-50"
                  >
                    <Checkbox
                      checked={selectedDifficulties.includes(difficulty)}
                      onCheckedChange={() => handleDifficultyToggle(difficulty)}
                    />
                    <span className="text-sm text-slate-700">{difficulty}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Active Filters */}
            {activeFilterCount > 0 && (
              <div className="pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-600 mb-2">Active filters:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.map((category) => (
                    <Badge
                      key={category}
                      variant="secondary"
                      className="gap-1 cursor-pointer"
                      onClick={() => handleCategoryToggle(category)}
                    >
                      {category}
                      <X className="w-3 h-3" />
                    </Badge>
                  ))}
                  {selectedDifficulties.map((difficulty) => (
                    <Badge
                      key={difficulty}
                      variant="secondary"
                      className="gap-1 cursor-pointer"
                      onClick={() => handleDifficultyToggle(difficulty)}
                    >
                      {difficulty}
                      <X className="w-3 h-3" />
                    </Badge>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                  className="mt-3 w-full"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
