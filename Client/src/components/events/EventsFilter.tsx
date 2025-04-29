
import { useState } from 'react';
import { CalendarIcon, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';

interface EventsFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  type: string;
  priceRange: [number, number];
  location: string;
  date: Date | undefined;
}

const eventTypes = [
  "All Types",
  "Concert",
  "Festival",
  "Conference",
  "Workshop",
  "Exhibition",
  "Sport",
  "Theater",
];

const locations = [
  "All Locations",
  "New York",
  "Los Angeles",
  "Chicago",
  "Miami",
  "Austin",
  "Seattle",
  "Boston",
  "Denver",
];

const EventsFilter = ({ onFilterChange }: EventsFilterProps) => {
  const [filters, setFilters] = useState<FilterOptions>({
    type: "All Types",
    priceRange: [0, 1000],
    location: "All Locations",
    date: undefined,
  });

  const handleFilterChange = (partialFilters: Partial<FilterOptions>) => {
    const newFilters = { ...filters, ...partialFilters };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const formatPriceRange = (range: [number, number]) => {
    return `$${range[0]} - $${range[1]}`;
  };

  return (
    <div className="bg-card rounded-md border border-border p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
          {/* Event Type */}
          <div>
            <label className="text-sm font-medium mb-1 block">Event Type</label>
            <Select 
              value={filters.type} 
              onValueChange={(value) => handleFilterChange({ type: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Event Types</SelectLabel>
                  {eventTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          {/* Location */}
          <div>
            <label className="text-sm font-medium mb-1 block">Location</label>
            <Select 
              value={filters.location} 
              onValueChange={(value) => handleFilterChange({ location: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Locations</SelectLabel>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          {/* Price Range */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium">Price Range</label>
              <span className="text-xs text-muted-foreground">
                {formatPriceRange(filters.priceRange)}
              </span>
            </div>
            <Slider 
              defaultValue={[0, 1000]} 
              max={1000} 
              step={10} 
              value={filters.priceRange}
              onValueChange={(value) => handleFilterChange({ priceRange: value as [number, number] })}
              className="my-2"
            />
          </div>
          
          {/* Date */}
          <div>
            <label className="text-sm font-medium mb-1 block">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.date ? (
                    filters.date.toLocaleDateString()
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filters.date}
                  onSelect={(date) => handleFilterChange({ date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="flex justify-end items-end">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => {
              const resetFilters = {
                type: "All Types",
                priceRange: [0, 1000],
                location: "All Locations",
                date: undefined,
              };
              setFilters(resetFilters);
              onFilterChange(resetFilters);
            }}
          >
            <Filter className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventsFilter;
