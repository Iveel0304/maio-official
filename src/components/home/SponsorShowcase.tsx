import { Sponsor } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SponsorShowcaseProps {
  sponsors: Sponsor[];
}

const SponsorShowcase = ({ sponsors }: SponsorShowcaseProps) => {
  const { language } = useLanguage();
  
  // Group sponsors by tier
  const platinumSponsors = sponsors.filter(sponsor => sponsor.tier === 'platinum');
  const goldSponsors = sponsors.filter(sponsor => sponsor.tier === 'gold');
  const silverSponsors = sponsors.filter(sponsor => sponsor.tier === 'silver');
  const bronzeSponsors = sponsors.filter(sponsor => sponsor.tier === 'bronze');
  const partners = sponsors.filter(sponsor => sponsor.tier === 'partner');
  
  const tierLabels = {
    en: {
      platinum: 'Platinum Sponsors',
      gold: 'Gold Sponsors',
      silver: 'Silver Sponsors',
      bronze: 'Bronze Sponsors',
      partner: 'Partners',
      all: 'All Sponsors'
    },
    mn: {
      platinum: 'Платинум ивээн тэтгэгчид',
      gold: 'Алтан ивээн тэтгэгчид',
      silver: 'Мөнгөн ивээн тэтгэгчид',
      bronze: 'Хүрэл ивээн тэтгэгчид',
      partner: 'Хамтрагчид',
      all: 'Бүх ивээн тэтгэгчид'
    }
  };
  
  // Function to render sponsor logos
  const renderSponsors = (sponsorsList: Sponsor[], size: 'large' | 'medium' | 'small') => {
    const sizeClasses = {
      large: "h-24 w-48",
      medium: "h-20 w-40",
      small: "h-16 w-32"
    };
    
    return (
      <div className="flex flex-wrap justify-center items-center gap-8">
        {sponsorsList.map((sponsor) => (
          <a 
            key={sponsor.id} 
            href={sponsor.websiteUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <div className={`${sizeClasses[size]} bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded p-4`}>
              {/* In a real implementation, this would be the actual logo image */}
              <div className="text-center font-medium">
                {sponsor.name}
              </div>
            </div>
          </a>
        ))}
      </div>
    );
  };
  
  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold text-center mb-8">
          {language === 'en' ? 'Our Sponsors' : 'Ивээн тэтгэгчид'}
        </h2>
        
        <Tabs defaultValue="all" className="w-full">
          <div className="flex justify-center mb-8 overflow-x-auto">
            <TabsList>
              <TabsTrigger value="all">
                {tierLabels[language].all}
              </TabsTrigger>
              {platinumSponsors.length > 0 && (
                <TabsTrigger value="platinum">
                  {tierLabels[language].platinum}
                </TabsTrigger>
              )}
              {goldSponsors.length > 0 && (
                <TabsTrigger value="gold">
                  {tierLabels[language].gold}
                </TabsTrigger>
              )}
              {silverSponsors.length > 0 && (
                <TabsTrigger value="silver">
                  {tierLabels[language].silver}
                </TabsTrigger>
              )}
              {bronzeSponsors.length > 0 && (
                <TabsTrigger value="bronze">
                  {tierLabels[language].bronze}
                </TabsTrigger>
              )}
              {partners.length > 0 && (
                <TabsTrigger value="partner">
                  {tierLabels[language].partner}
                </TabsTrigger>
              )}
            </TabsList>
          </div>
          
          <TabsContent value="all" className="mt-6 space-y-12">
            {platinumSponsors.length > 0 && (
              <div>
                <h3 className="text-xl font-medium text-center mb-6">
                  {tierLabels[language].platinum}
                </h3>
                {renderSponsors(platinumSponsors, 'large')}
              </div>
            )}
            
            {goldSponsors.length > 0 && (
              <div>
                <h3 className="text-xl font-medium text-center mb-6">
                  {tierLabels[language].gold}
                </h3>
                {renderSponsors(goldSponsors, 'medium')}
              </div>
            )}
            
            {silverSponsors.length > 0 && (
              <div>
                <h3 className="text-xl font-medium text-center mb-6">
                  {tierLabels[language].silver}
                </h3>
                {renderSponsors(silverSponsors, 'medium')}
              </div>
            )}
            
            {bronzeSponsors.length > 0 && (
              <div>
                <h3 className="text-xl font-medium text-center mb-6">
                  {tierLabels[language].bronze}
                </h3>
                {renderSponsors(bronzeSponsors, 'small')}
              </div>
            )}
            
            {partners.length > 0 && (
              <div>
                <h3 className="text-xl font-medium text-center mb-6">
                  {tierLabels[language].partner}
                </h3>
                {renderSponsors(partners, 'small')}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="platinum">
            {renderSponsors(platinumSponsors, 'large')}
          </TabsContent>
          
          <TabsContent value="gold">
            {renderSponsors(goldSponsors, 'medium')}
          </TabsContent>
          
          <TabsContent value="silver">
            {renderSponsors(silverSponsors, 'medium')}
          </TabsContent>
          
          <TabsContent value="bronze">
            {renderSponsors(bronzeSponsors, 'small')}
          </TabsContent>
          
          <TabsContent value="partner">
            {renderSponsors(partners, 'small')}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SponsorShowcase;