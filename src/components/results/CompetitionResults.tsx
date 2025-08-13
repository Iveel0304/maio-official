import { Competition } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy } from 'lucide-react';

interface CompetitionResultsProps {
  competitions: Competition[];
}

const CompetitionResults = ({ competitions }: CompetitionResultsProps) => {
  const { language, t } = useLanguage();
  
  // Sort competitions by year in descending order
  const sortedCompetitions = [...competitions].sort((a, b) => 
    parseInt(b.year) - parseInt(a.year)
  );
  
  const getTrophyColor = (place: number): string => {
    switch (place) {
      case 1: return 'text-yellow-500';
      case 2: return 'text-gray-400';
      case 3: return 'text-amber-700';
      default: return 'text-muted-foreground';
    }
  };
  
  return (
    <div className="space-y-8">
      {sortedCompetitions.map((competition) => (
        <Card key={competition.id} className="overflow-hidden">
          <CardHeader>
            <h2 className="text-2xl font-bold">
              {t(competition.name)}
            </h2>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">
                    {language === 'en' ? 'Rank' : 'Байр'}
                  </TableHead>
                  <TableHead>
                    {language === 'en' ? 'Team / Participant' : 'Баг / Оролцогч'}
                  </TableHead>
                  <TableHead>
                    {language === 'en' ? 'Project' : 'Төсөл'}
                  </TableHead>
                  <TableHead className="text-right">
                    {language === 'en' ? 'Score' : 'Оноо'}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {competition.winners.map((winner) => (
                  <TableRow key={`${competition.id}-${winner.place}`}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Trophy className={`h-4 w-4 ${getTrophyColor(winner.place)}`} />
                        <span>{winner.place}</span>
                      </div>
                    </TableCell>
                    <TableCell>{winner.name}</TableCell>
                    <TableCell>{winner.project}</TableCell>
                    <TableCell className="text-right">{winner.score}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CompetitionResults;