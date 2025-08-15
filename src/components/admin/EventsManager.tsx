import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { eventsApi } from "@/lib/api";
import { toast } from "sonner";
import RichTextEditor from "@/components/ui/RichTextEditor";

interface Event {
  id?: string;
  title: { en: string; mn: string };
  description: { en: string; mn: string };
  date: string;
  time: string;
  location: { en: string; mn: string };
  category: string;
  imageUrl?: string;
  participants?: number;
  createdAt?: string;
  updatedAt?: string;
}

const categories = [
  "competition",
  "workshop",
  "conference",
  "meetup",
  "training",
  "ceremony",
];

export default function EventsManager() {
  const { language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    upcoming: false,
  });

  const isEditMode = location.pathname.includes("/edit/");
  const isCreateMode = location.pathname.includes("/new");
  const eventId = params.id;

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  useEffect(() => {
    if (isCreateMode) {
      setIsCreating(true);
      setEditingEvent({
        title: { en: "", mn: "" },
        description: { en: "", mn: "" },
        date: "",
        time: "",
        location: { en: "", mn: "" },
        category: "workshop",
        participants: 0,
      });
    } else if (isEditMode && eventId) {
      fetchEvent(eventId);
    }
  }, [isCreateMode, isEditMode, eventId]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await eventsApi.getEvents({
        search: filters.search,
        category: filters.category === "all" ? undefined : filters.category,
        upcoming: filters.upcoming,
        limit: 50,
      });

      if (response.error) {
        toast.error(response.error);
      } else {
        setEvents(response.data || []);
      }
    } catch (error) {
      toast.error("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  const fetchEvent = async (id: string) => {
    try {
      const response = await eventsApi.getEvent(id);
      if (response.error) {
        toast.error(response.error);
      } else {
        setEditingEvent(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch event");
    }
  };

  const handleSave = async () => {
    if (!editingEvent) return;

    try {
      let response;

      if (isCreating) {
        response = await eventsApi.createEvent(
          editingEvent,
          imageFile || undefined
        );
      } else {
        response = await eventsApi.updateEvent(
          editingEvent.id!,
          editingEvent,
          imageFile || undefined
        );
      }

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success(
          isCreating
            ? "Event created successfully"
            : "Event updated successfully"
        );
        // Reset editing state instead of navigating
        setEditingEvent(null);
        setIsCreating(false);
        setImageFile(null);
        fetchEvents();
      }
    } catch (error) {
      toast.error("Failed to save event");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const response = await eventsApi.deleteEvent(id);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Event deleted successfully");
        fetchEvents();
      }
    } catch (error) {
      toast.error("Failed to delete event");
    }
  };

  const handleCancel = () => {
    setEditingEvent(null);
    setIsCreating(false);
    setImageFile(null);
    // Don't navigate, just reset state
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isCreating || editingEvent) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {isCreating
              ? language === "en"
                ? "Create New Event"
                : "Шинэ арга хэмжээ үүсгэх"
              : language === "en"
              ? "Edit Event"
              : "Арга хэмжээ засах"}
          </h2>
          <div className="space-x-2">
            <Button onClick={handleCancel} variant="outline">
              <X className="h-4 w-4 mr-2" />
              {language === "en" ? "Cancel" : "Цуцлах"}
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              {language === "en" ? "Save" : "Хадгалах"}
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-6 space-y-6">
            {/* Title */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title-en">Title (English)</Label>
                <Input
                  id="title-en"
                  value={editingEvent?.title.en || ""}
                  onChange={(e) =>
                    setEditingEvent((prev) =>
                      prev
                        ? {
                            ...prev,
                            title: { ...prev.title, en: e.target.value },
                          }
                        : null
                    )
                  }
                />
              </div>
              <div>
                <Label htmlFor="title-mn">Title (Mongolian)</Label>
                <Input
                  id="title-mn"
                  value={editingEvent?.title.mn || ""}
                  onChange={(e) =>
                    setEditingEvent((prev) =>
                      prev
                        ? {
                            ...prev,
                            title: { ...prev.title, mn: e.target.value },
                          }
                        : null
                    )
                  }
                />
              </div>
            </div>

            {/* Description */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="description-en">Description (English)</Label>
                <RichTextEditor
                  content={editingEvent?.description.en || ""}
                  onChange={(content) =>
                    setEditingEvent((prev) =>
                      prev
                        ? {
                            ...prev,
                            description: { ...prev.description, en: content },
                          }
                        : null
                    )
                  }
                  placeholder="Enter event description in English..."
                />
              </div>
              <div>
                <Label htmlFor="description-mn">Description (Mongolian)</Label>
                <RichTextEditor
                  content={editingEvent?.description.mn || ""}
                  onChange={(content) =>
                    setEditingEvent((prev) =>
                      prev
                        ? {
                            ...prev,
                            description: { ...prev.description, mn: content },
                          }
                        : null
                    )
                  }
                  placeholder="Enter event description in Mongolian..."
                />
              </div>
            </div>

            {/* Event Details */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={editingEvent?.date || ""}
                  onChange={(e) =>
                    setEditingEvent((prev) =>
                      prev
                        ? {
                            ...prev,
                            date: e.target.value,
                          }
                        : null
                    )
                  }
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={editingEvent?.time || ""}
                  onChange={(e) =>
                    setEditingEvent((prev) =>
                      prev
                        ? {
                            ...prev,
                            time: e.target.value,
                          }
                        : null
                    )
                  }
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={editingEvent?.category || "workshop"}
                  onValueChange={(value) =>
                    setEditingEvent((prev) =>
                      prev
                        ? {
                            ...prev,
                            category: value,
                          }
                        : null
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location-en">Location (English)</Label>
                <Input
                  id="location-en"
                  value={editingEvent?.location.en || ""}
                  onChange={(e) =>
                    setEditingEvent((prev) =>
                      prev
                        ? {
                            ...prev,
                            location: { ...prev.location, en: e.target.value },
                          }
                        : null
                    )
                  }
                />
              </div>
              <div>
                <Label htmlFor="location-mn">Location (Mongolian)</Label>
                <Input
                  id="location-mn"
                  value={editingEvent?.location.mn || ""}
                  onChange={(e) =>
                    setEditingEvent((prev) =>
                      prev
                        ? {
                            ...prev,
                            location: { ...prev.location, mn: e.target.value },
                          }
                        : null
                    )
                  }
                />
              </div>
            </div>

            {/* Participants */}
            <div>
              <Label htmlFor="participants">Expected Participants</Label>
              <Input
                id="participants"
                type="number"
                value={editingEvent?.participants || 0}
                onChange={(e) =>
                  setEditingEvent((prev) =>
                    prev
                      ? {
                          ...prev,
                          participants: parseInt(e.target.value) || 0,
                        }
                      : null
                  )
                }
              />
            </div>

            {/* Image Upload */}
            <div>
              <Label htmlFor="image">Event Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
              {editingEvent?.imageUrl && (
                <div className="mt-2">
                  <img
                    src={editingEvent.imageUrl}
                    alt="Event"
                    className="h-32 w-auto rounded-lg border"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {language === "en" ? "Events Management" : "Арга хэмжээ удирдах"}
        </h1>
        <Button
          onClick={() => {
            setIsCreating(true);
            setEditingEvent({
              title: { en: "", mn: "" },
              description: { en: "", mn: "" },
              date: "",
              time: "",
              location: { en: "", mn: "" },
              category: "workshop",
              participants: 0,
            });
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          {language === "en" ? "New Event" : "Шинэ арга хэмжээ"}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Input
              placeholder={
                language === "en" ? "Search events..." : "Арга хэмжээ хайх..."
              }
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              className="flex-1"
            />
            <Select
              value={filters.category}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant={filters.upcoming ? "default" : "outline"}
              onClick={() =>
                setFilters((prev) => ({ ...prev, upcoming: !prev.upcoming }))
              }
            >
              {language === "en" ? "Upcoming Only" : "Ирэх арга хэмжээ"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <div className="grid gap-6">
        {events.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              {language === "en" ? "No events found" : "Арга хэмжээ олдсонгүй"}
            </CardContent>
          </Card>
        ) : (
          events.map((event) => {
            // Safe fallbacks for multilingual fields
            const safeTitle = event.title || {
              en: "Untitled Event",
              mn: "Гарчиггүй арга хэмжээ",
            };
            const safeLocation = event.location || {
              en: "TBD",
              mn: "Тодорхойгүй",
            };
            const safeDescription = event.description || {
              en: "No description available",
              mn: "Тайлбар байхгүй",
            };

            return (
              <Card key={event.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <h3 className="text-xl font-semibold">
                          {safeTitle[language] ||
                            safeTitle.en ||
                            "Untitled Event"}
                        </h3>
                        <Badge variant="secondary">
                          {event.category || "Uncategorized"}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {event.date || "TBD"}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {event.time || "TBD"}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {safeLocation[language] || safeLocation.en || "TBD"}
                        </div>
                        {event.participants && (
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {event.participants} participants
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {safeDescription[language] ||
                          safeDescription.en ||
                          "No description"}
                      </p>
                    </div>

                    {event.imageUrl && (
                      <img
                        src={event.imageUrl}
                        alt={
                          (safeTitle && typeof safeTitle === 'object' ? 
                            (safeTitle[language] || safeTitle.en || "Event image") :
                            (safeTitle || "Event image"))
                        }
                        className="h-20 w-20 rounded-lg object-cover ml-4"
                      />
                    )}

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingEvent(event);
                          setIsCreating(false);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(event.id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
