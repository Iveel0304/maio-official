import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Plus, Edit, Trash2, Save, X, Users, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { resultsApi } from '@/lib/api';
import { toast } from 'sonner';
import RichTextEditor from '@/components/ui/RichTextEditor';

interface Ranking {
  rank: number;
  team: string;
  score: number;
  members?: string[];
  prize?: string;
}

interface Result {
  _id?: string;
  title: { en: string; mn: string };
  description: { en: string; mn: string };
  year: number;
  date: string;
  category: string;
  rankings: Ranking[];
  createdAt?: string;
  updatedAt?: string;
}

const categories = [
  'final',
  'semifinal',
  'preliminary',
  'workshop',
  'hackathon',
  'contest'
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

export default function ResultsManager() {
  const { language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingResult, setEditingResult] = useState<Result | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    year: 'all'
  });

  const isEditMode = location.pathname.includes('/edit/');
  const isCreateMode = location.pathname.includes('/new');
  const resultId = params.id;

  useEffect(() => {
    fetchResults();
  }, [filters]);

  useEffect(() => {
    if (isCreateMode) {
      setIsCreating(true);
      setEditingResult({
        title: { en: '', mn: '' },
        description: { en: '', mn: '' },
        year: currentYear,
        date: '',
        category: 'final',
        rankings: [
          { rank: 1, team: '', score: 0, members: [] },
          { rank: 2, team: '', score: 0, members: [] },
          { rank: 3, team: '', score: 0, members: [] }
        ]
      });
    } else if (isEditMode && resultId) {
      fetchResult(resultId);
    }
  }, [isCreateMode, isEditMode, resultId]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const response = await resultsApi.getResults({
        search: filters.search,
        category: filters.category === 'all' ? undefined : filters.category,
        year: filters.year === 'all' ? undefined : parseInt(filters.year),
        limit: 50
      });
      
      if (response.error) {
        toast.error(response.error);
      } else {
        setResults(response.data || []);
      }
    } catch (error) {
      toast.error('Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  const fetchResult = async (id: string) => {
    try {
      const response = await resultsApi.getResults({ search: id });
      if (response.error) {
        toast.error(response.error);
      } else {
        const result = response.data?.find(r => r._id === id);
        if (result) {
          setEditingResult(result);
        } else {
          toast.error('Result not found');
          navigate('/admin/results');
        }
      }
    } catch (error) {
      toast.error('Failed to fetch result');
    }
  };

  const handleSave = async () => {
    if (!editingResult) return;

    try {
      let response;
      
      if (isCreating) {
        response = await resultsApi.createResult(editingResult);
      } else {
        response = await resultsApi.updateResult(editingResult._id!, editingResult);
      }

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success(isCreating ? 'Result created successfully' : 'Result updated successfully');
        navigate('/admin/results');
        fetchResults();
      }
    } catch (error) {
      toast.error('Failed to save result');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this result?')) return;

    try {
      const response = await resultsApi.deleteResult(id);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success('Result deleted successfully');
        fetchResults();
      }
    } catch (error) {
      toast.error('Failed to delete result');
    }
  };

  const handleCancel = () => {
    setEditingResult(null);
    setIsCreating(false);
    navigate('/admin/results');
  };

  const addRanking = () => {
    if (!editingResult) return;
    const newRank = editingResult.rankings.length + 1;
    setEditingResult(prev => prev ? {
      ...prev,
      rankings: [...prev.rankings, { rank: newRank, team: '', score: 0, members: [] }]
    } : null);
  };

  const removeRanking = (index: number) => {
    if (!editingResult) return;
    setEditingResult(prev => prev ? {
      ...prev,
      rankings: prev.rankings.filter((_, i) => i !== index).map((ranking, i) => ({
        ...ranking,
        rank: i + 1
      }))
    } : null);
  };

  const updateRanking = (index: number, field: keyof Ranking, value: any) => {
    if (!editingResult) return;
    setEditingResult(prev => prev ? {
      ...prev,
      rankings: prev.rankings.map((ranking, i) => 
        i === index ? { ...ranking, [field]: value } : ranking
      )
    } : null);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <Badge variant="outline">{rank}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isCreating || isEditMode) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {isCreating 
              ? (language === 'en' ? 'Create New Result' : 'Шинэ үр дүн үүсгэх')
              : (language === 'en' ? 'Edit Result' : 'Үр дүн засах')
            }
          </h2>
          <div className="space-x-2">
            <Button onClick={handleCancel} variant="outline">
              <X className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Cancel' : 'Цуцлах'}
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Save' : 'Хадгалах'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title-en">Title (English)</Label>
                  <Input
                    id="title-en"
                    value={editingResult?.title.en || ''}
                    onChange={(e) => setEditingResult(prev => prev ? {
                      ...prev,
                      title: { ...prev.title, en: e.target.value }
                    } : null)}
                  />
                </div>
                <div>
                  <Label htmlFor="title-mn">Title (Mongolian)</Label>
                  <Input
                    id="title-mn"
                    value={editingResult?.title.mn || ''}
                    onChange={(e) => setEditingResult(prev => prev ? {
                      ...prev,
                      title: { ...prev.title, mn: e.target.value }
                    } : null)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Select
                    value={editingResult?.year.toString() || ''}
                    onValueChange={(value) => setEditingResult(prev => prev ? {
                      ...prev,
                      year: parseInt(value)
                    } : null)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={editingResult?.date || ''}
                    onChange={(e) => setEditingResult(prev => prev ? {
                      ...prev,
                      date: e.target.value
                    } : null)}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={editingResult?.category || ''}
                    onValueChange={(value) => setEditingResult(prev => prev ? {
                      ...prev,
                      category: value
                    } : null)}
                  >
                    <SelectTrigger>
                      <SelectValue />
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

              <div>
                <Label htmlFor="description-en">Description (English)</Label>
                <RichTextEditor
                  content={editingResult?.description.en || ''}
                  onChange={(content) => setEditingResult(prev => prev ? {
                    ...prev,
                    description: { ...prev.description, en: content }
                  } : null)}
                  placeholder="Enter result description in English..."
                />
              </div>

              <div>
                <Label htmlFor="description-mn">Description (Mongolian)</Label>
                <RichTextEditor
                  content={editingResult?.description.mn || ''}
                  onChange={(content) => setEditingResult(prev => prev ? {
                    ...prev,
                    description: { ...prev.description, mn: content }
                  } : null)}
                  placeholder="Enter result description in Mongolian..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Rankings */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Rankings</CardTitle>
                <Button size="sm" onClick={addRanking}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Ranking
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {editingResult?.rankings.map((ranking, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getRankIcon(ranking.rank)}
                        <span className="font-semibold">Rank {ranking.rank}</span>
                      </div>
                      {editingResult.rankings.length > 1 && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => removeRanking(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <Label>Team Name</Label>
                        <Input
                          value={ranking.team}
                          onChange={(e) => updateRanking(index, 'team', e.target.value)}
                          placeholder="Team name"
                        />
                      </div>
                      <div>
                        <Label>Score</Label>
                        <Input
                          type="number"
                          value={ranking.score}
                          onChange={(e) => updateRanking(index, 'score', parseInt(e.target.value) || 0)}
                          placeholder="Score"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Members (comma separated)</Label>
                      <Input
                        value={ranking.members?.join(', ') || ''}
                        onChange={(e) => updateRanking(index, 'members', 
                          e.target.value.split(',').map(m => m.trim()).filter(m => m)
                        )}
                        placeholder="Member 1, Member 2, Member 3"
                      />
                    </div>

                    <div className="mt-3">
                      <Label>Prize (optional)</Label>
                      <Input
                        value={ranking.prize || ''}
                        onChange={(e) => updateRanking(index, 'prize', e.target.value)}
                        placeholder="Prize description"
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {language === 'en' ? 'Results Management' : 'Үр дүн удирдах'}
        </h1>
        <Button onClick={() => navigate('/admin/results/new')}>
          <Plus className="h-4 w-4 mr-2" />
          {language === 'en' ? 'New Result' : 'Шинэ үр дүн'}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Input
              placeholder={language === 'en' ? 'Search results...' : 'Үр дүн хайх...'}
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="flex-1"
            />
            <Select
              value={filters.category}
              onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
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
            <Select
              value={filters.year}
              onValueChange={(value) => setFilters(prev => ({ ...prev, year: value }))}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results List */}
      <div className="grid gap-6">
        {results.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              {language === 'en' ? 'No results found' : 'Үр дүн олдсонгүй'}
            </CardContent>
          </Card>
        ) : (
          results.map((result) => (
            <Card key={result._id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-xl font-semibold">
                        {result.title[language]}
                      </h3>
                      <Badge variant="secondary">{result.category}</Badge>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {result.year} - {result.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {result.rankings.length} teams
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {result.description[language]}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => navigate(`/admin/results/edit/${result._id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDelete(result._id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Top 3 Rankings Preview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {result.rankings.slice(0, 3).map((ranking, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      {getRankIcon(ranking.rank)}
                      <div className="flex-1">
                        <p className="font-medium">{ranking.team}</p>
                        <p className="text-sm text-muted-foreground">Score: {ranking.score}</p>
                        {ranking.members && ranking.members.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {ranking.members.slice(0, 2).join(', ')}
                            {ranking.members.length > 2 && ` +${ranking.members.length - 2} more`}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
