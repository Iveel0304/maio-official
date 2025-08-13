import { Sponsor } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface SponsorShowcaseProps {
  sponsors: Sponsor[];
}

const SponsorShowcase = ({ sponsors }: SponsorShowcaseProps) => {
  const { language } = useLanguage();

  // Group sponsors by tier (handle both old and new tier names)
  const organizers = sponsors.filter((sponsor) => sponsor.tier === "organizer");
  const mainSponsors = sponsors.filter((sponsor) => 
    sponsor.tier === "main" || sponsor.tier === "platinum" || sponsor.tier === "gold"
  );
  const regularSponsors = sponsors.filter(
    (sponsor) => sponsor.tier === "sponsor" || sponsor.tier === "silver"
  );
  const supporters = sponsors.filter((sponsor) => 
    sponsor.tier === "supporter" || sponsor.tier === "bronze"
  );

  const tierLabels = {
    en: {
      organizer: "Organizers",
      main: "Main Sponsors",
      sponsor: "Sponsors",
      supporter: "Supporters",
      all: "All Sponsors & Partners",
    },
    mn: {
      organizer: "Зохион байгуулагчид",
      main: "Гол ивээн тэтгэгчид",
      sponsor: "Ивээн тэтгэгчид",
      supporter: "Дэмжигчид",
      all: "Бүх ивээн тэтгэгч, хамтрагчид",
    },
  };

  const tierColors = {
    organizer: "from-yellow-500 to-orange-500",
    main: "from-blue-500 to-purple-500",
    sponsor: "from-green-500 to-teal-500",
    supporter: "from-gray-500 to-slate-500",
    platinum: "from-purple-500 to-indigo-500",
    gold: "from-yellow-500 to-orange-500", 
    silver: "from-gray-400 to-gray-600",
    bronze: "from-orange-600 to-red-600",
  };

  // Function to render sponsor logos
  const renderSponsors = (
    sponsorsList: Sponsor[],
    size: "large" | "medium" | "small"
  ) => {
    const sizeClasses = {
      large: "h-24 w-48",
      medium: "h-20 w-40",
      small: "h-16 w-32",
    };

    return (
      <div className="flex flex-wrap justify-center items-center gap-8">
        {sponsorsList.map((sponsor) => (
          <a
            key={sponsor.id || sponsor._id}
            href={sponsor.websiteUrl || sponsor.website}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 hover:scale-105 transition-all duration-300 group"
            title={sponsor.name}
          >
            <div
              className={`${sizeClasses[size]} bg-white dark:bg-gray-800 flex items-center justify-center rounded-lg shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 p-4 group-hover:border-primary/50 transition-all duration-300`}
            >
              {(sponsor.logoUrl || sponsor.logo) ? (
                <img
                  src={sponsor.logoUrl || sponsor.logo || '/images/placeholder.jpg'}
                  alt={`${sponsor.name} logo`}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    // Fallback to text if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<div class="text-center font-medium text-sm text-muted-foreground">${sponsor.name}</div>`;
                    }
                  }}
                />
              ) : (
                <div className="text-center font-medium text-sm text-muted-foreground">
                  {sponsor.name}
                </div>
              )}
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
          {language === "en" ? "Our Sponsors" : "Ивээн тэтгэгчид"}
        </h2>

        <Tabs defaultValue="all" className="w-full">
          <div className="flex justify-center mb-8 overflow-x-auto">
            <TabsList>
              <TabsTrigger value="all">{tierLabels[language].all}</TabsTrigger>
              {organizers.length > 0 && (
                <TabsTrigger value="organizer">
                  {tierLabels[language].organizer}
                </TabsTrigger>
              )}
              {mainSponsors.length > 0 && (
                <TabsTrigger value="main">
                  {tierLabels[language].main}
                </TabsTrigger>
              )}
              {regularSponsors.length > 0 && (
                <TabsTrigger value="sponsor">
                  {tierLabels[language].sponsor}
                </TabsTrigger>
              )}
              {supporters.length > 0 && (
                <TabsTrigger value="supporter">
                  {tierLabels[language].supporter}
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          <TabsContent value="all" className="mt-6 space-y-12">
            {organizers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Badge className={`bg-gradient-to-r ${tierColors.organizer} text-white px-4 py-2`}>
                    {tierLabels[language].organizer}
                  </Badge>
                </div>
                {renderSponsors(organizers, "large")}
              </motion.div>
            )}

            {mainSponsors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Badge className={`bg-gradient-to-r ${tierColors.main} text-white px-4 py-2`}>
                    {tierLabels[language].main}
                  </Badge>
                </div>
                {renderSponsors(mainSponsors, "large")}
              </motion.div>
            )}

            {regularSponsors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Badge className={`bg-gradient-to-r ${tierColors.sponsor} text-white px-4 py-2`}>
                    {tierLabels[language].sponsor}
                  </Badge>
                </div>
                {renderSponsors(regularSponsors, "medium")}
              </motion.div>
            )}

            {supporters.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Badge className={`bg-gradient-to-r ${tierColors.supporter} text-white px-4 py-2`}>
                    {tierLabels[language].supporter}
                  </Badge>
                </div>
                {renderSponsors(supporters, "small")}
              </motion.div>
            )}

            {/* Empty State */}
            {sponsors.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-16 px-4"
              >
                <div className="text-6xl mb-6">🤝</div>
                <h3 className="text-xl md:text-2xl font-semibold mb-3">
                  {language === 'en' ? 'Looking for Partners' : 'Хамтрагч хайж байна'}
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  {language === 'en' 
                    ? 'We are actively seeking sponsors and partners to support MAIO. Join us in fostering AI innovation in Mongolia.'
                    : 'Бид MAIO-г дэмжих ивээн тэтгэгч, хамтрагчдыг идэвхтэй хайж байна. Монгол дахь AI инновацийг дэмжихэд нэгдээрэй.'}
                </p>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="organizer">
            {renderSponsors(organizers, "large")}
          </TabsContent>

          <TabsContent value="main">
            {renderSponsors(mainSponsors, "large")}
          </TabsContent>

          <TabsContent value="sponsor">
            {renderSponsors(regularSponsors, "medium")}
          </TabsContent>

          <TabsContent value="supporter">
            {renderSponsors(supporters, "small")}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SponsorShowcase;
