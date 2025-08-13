import { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  ExternalLink,
  Star,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { sponsorsApi } from "@/lib/api";
import { toast } from "sonner";

interface Sponsor {
  _id?: string;
  name: string;
  description: string;
  website?: string;
  logoUrl?: string;
  tier: "gold" | "silver" | "bronze" | "supporter";
  active: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

const tiers = [
  { value: "gold", label: "Gold Sponsor", color: "text-yellow-600" },
  { value: "silver", label: "Silver Sponsor", color: "text-gray-500" },
  { value: "bronze", label: "Bronze Sponsor", color: "text-amber-600" },
  { value: "supporter", label: "Supporter", color: "text-blue-600" },
];

const initialSponsor: Omit<Sponsor, "_id"> = {
  name: "",
  description: "",
  website: "",
  tier: "supporter",
  active: true,
  order: 0,
};

export default function SponsorsManager() {
  const { language } = useLanguage();
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] =
    useState<Omit<Sponsor, "_id">>(initialSponsor);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    setLoading(true);
    try {
      const response = await sponsorsApi.getSponsors();

      if (response.error) {
        toast.error(response.error);
      } else {
        setSponsors(response.data || []);
      }
    } catch (error) {
      toast.error("Failed to fetch sponsors");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Sponsor name is required");
      return;
    }

    try {
      let response;

      if (editingId) {
        response = await sponsorsApi.updateSponsor(
          editingId,
          formData,
          logoFile || undefined
        );
      } else {
        response = await sponsorsApi.createSponsor(
          formData,
          logoFile || undefined
        );
      }

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success(
          editingId
            ? "Sponsor updated successfully"
            : "Sponsor created successfully"
        );
        setIsDialogOpen(false);
        resetForm();
        fetchSponsors();
      }
    } catch (error) {
      toast.error("Failed to save sponsor");
    }
  };

  const handleEdit = (sponsor: Sponsor) => {
    setEditingId(sponsor._id!);
    setFormData({
      name: sponsor.name,
      description: sponsor.description,
      website: sponsor.website || "",
      tier: sponsor.tier,
      active: sponsor.active,
      order: sponsor.order,
    });
    setLogoFile(null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sponsor?")) return;

    try {
      const response = await sponsorsApi.deleteSponsor(id);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Sponsor deleted successfully");
        fetchSponsors();
      }
    } catch (error) {
      toast.error("Failed to delete sponsor");
    }
  };

  const resetForm = () => {
    setFormData(initialSponsor);
    setLogoFile(null);
    setEditingId(null);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const getTierBadge = (tier: string) => {
    const tierInfo = tiers.find((t) => t.value === tier);
    return tierInfo ? (
      <Badge className={tierInfo.color}>
        <Star className="h-3 w-3 mr-1" />
        {tierInfo.label}
      </Badge>
    ) : (
      <Badge variant="outline">{tier}</Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {language === "en" ? "Sponsors Management" : "Ивээн тэтгэгч удирдах"}
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {language === "en" ? "Add Sponsor" : "Ивээн тэтгэгч нэмэх"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingId
                  ? language === "en"
                    ? "Edit Sponsor"
                    : "Ивээн тэтгэгч засах"
                  : language === "en"
                  ? "Add New Sponsor"
                  : "Шинэ ивээн тэтгэгч нэмэх"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="name">Sponsor Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Enter sponsor name..."
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Enter sponsor description..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        website: e.target.value,
                      }))
                    }
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="tier">Tier</Label>
                  <Select
                    value={formData.tier}
                    onValueChange={(value: any) =>
                      setFormData((prev) => ({ ...prev, tier: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tiers.map((tier) => (
                        <SelectItem key={tier.value} value={tier.value}>
                          <div className="flex items-center gap-2">
                            <Star className={`h-4 w-4 ${tier.color}`} />
                            {tier.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="order">Display Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        order: parseInt(e.target.value) || 0,
                      }))
                    }
                    placeholder="0"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, active: checked }))
                    }
                  />
                  <Label htmlFor="active">Active</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="logo">Logo</Label>
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                />
                {editingId && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Leave empty to keep current logo
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={handleDialogClose}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  {editingId ? "Update" : "Save"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sponsors Grid */}
      {sponsors.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            {language === "en"
              ? "No sponsors found"
              : "Ивээн тэтгэгч олдсонгүй"}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sponsors.map((sponsor) => (
            <Card
              key={sponsor._id}
              className={`relative ${!sponsor.active ? "opacity-60" : ""}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {sponsor.logoUrl ? (
                        <img
                          src={sponsor.logoUrl}
                          alt={sponsor.name}
                          className="h-12 w-12 object-contain rounded"
                        />
                      ) : (
                        <div className="h-12 w-12 bg-muted rounded flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {sponsor.name}
                        </h3>
                        {getTierBadge(sponsor.tier)}
                      </div>
                    </div>

                    {sponsor.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                        {sponsor.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Order: {sponsor.order}</span>
                        <Badge
                          variant={sponsor.active ? "default" : "secondary"}
                        >
                          {sponsor.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>

                      {sponsor.website && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => window.open(sponsor.website, "_blank")}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(sponsor)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(sponsor._id!)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gold</p>
                <p className="text-2xl font-bold">
                  {sponsors.filter((s) => s.tier === "gold" && s.active).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Star className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Silver</p>
                <p className="text-2xl font-bold">
                  {
                    sponsors.filter((s) => s.tier === "silver" && s.active)
                      .length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Star className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bronze</p>
                <p className="text-2xl font-bold">
                  {
                    sponsors.filter((s) => s.tier === "bronze" && s.active)
                      .length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Active</p>
                <p className="text-2xl font-bold">
                  {sponsors.filter((s) => s.active).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
