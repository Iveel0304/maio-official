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
  const mainSponsors = sponsors.filter(
    (sponsor) =>
      sponsor.tier === "main" ||
      sponsor.tier === "platinum" ||
      sponsor.tier === "gold"
  );
  const regularSponsors = sponsors.filter(
    (sponsor) => sponsor.tier === "sponsor" || sponsor.tier === "silver"
  );
  const supporters = sponsors.filter(
    (sponsor) => sponsor.tier === "supporter" || sponsor.tier === "bronze"
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

  // Function to render sponsor logos with auto-sizing
  const renderSponsors = (
    sponsorsList: Sponsor[],
    tierType: "organizer" | "main" | "sponsor" | "supporter"
  ) => {
    // Auto-responsive sizing based on tier and content
    const getCardClassName = (tier: string) => {
      const baseClasses =
        "bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 group-hover:border-primary/50 transition-all duration-300 p-3 flex flex-col items-center justify-center";

      switch (tier) {
        case "organizer":
          return `${baseClasses} min-h-[120px]`;
        case "main":
          return `${baseClasses} min-h-[100px]`;
        case "sponsor":
          return `${baseClasses} min-h-[80px]`;
        case "supporter":
          return `${baseClasses} min-h-[70px]`;
        default:
          return `${baseClasses} min-h-[80px]`;
      }
    };

    const getLogoClassName = (tier: string) => {
      switch (tier) {
        case "organizer":
          return "max-h-16 max-w-full object-center";
        case "main":
          return "max-h-12 max-w-full object-center";
        case "sponsor":
          return "max-h-10 max-w-full object-center";
        case "supporter":
          return "max-h-8 max-w-full object-center";
        default:
          return "max-h-10 max-w-full object-center";
      }
    };

    const getTextClassName = (tier: string) => {
      const baseClasses =
        "text-center font-medium text-muted-foreground mt-2 break-words";
      switch (tier) {
        case "organizer":
          return `${baseClasses} text-sm`;
        case "main":
          return `${baseClasses} text-sm`;
        case "sponsor":
          return `${baseClasses} text-xs`;
        case "supporter":
          return `${baseClasses} text-xs`;
        default:
          return `${baseClasses} text-xs`;
      }
    };

    return (
      <div className="flex flex-wrap justify-center items-center object-center gap-6">
        {sponsorsList.map((sponsor) => {
          // Check all possible logo field names from different sources
          const logoUrl = sponsor.logoUrl || sponsor.logo_url || sponsor.logo;

          return (
            <a
              key={sponsor.id || sponsor._id}
              href={
                sponsor.websiteUrl ||
                sponsor.website_url ||
                sponsor.website ||
                "#"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 hover:scale-105 transition-all duration-300 group w-full"
              title={sponsor.name}
            >
              <div className={getCardClassName(tierType)}>
                {/* Logo container with fixed aspect ratio */}
                <div className="flex-1 w-full flex items-center justify-center mb-2">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={`${sponsor.name} logo`}
                      className={getLogoClassName(tierType)}
                      loading="lazy"
                      onError={(e) => {
                        // Replace failed image with name-based placeholder
                        const target = e.target as HTMLImageElement;
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded border-2 border-dashed border-gray-300 dark:border-gray-500">
                              <span class="text-gray-600 dark:text-gray-300 font-medium text-center px-2">${sponsor.name
                                .split(" ")
                                .map((word) => word.charAt(0))
                                .join("")
                                .toUpperCase()}</span>
                            </div>
                          `;
                        }
                      }}
                    />
                  ) : (
                    // Show name initials when no logo
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded border-2 border-dashed border-gray-300 dark:border-gray-500 min-h-[60px]">
                      <span className="text-gray-600 dark:text-gray-300 font-medium text-center px-2">
                        {sponsor.name
                          .split(" ")
                          .map((word) => word.charAt(0))
                          .join("")
                          .toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                {/* Sponsor name - always visible with auto-sizing text */}
                <div className={getTextClassName(tierType)}>{sponsor.name}</div>
              </div>
            </a>
          );
        })}
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
                  <Badge
                    className={`bg-gradient-to-r ${tierColors.organizer} text-white px-4 py-2`}
                  >
                    {tierLabels[language].organizer}
                  </Badge>
                </div>
                {renderSponsors(organizers, "organizer")}
              </motion.div>
            )}

            {mainSponsors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Badge
                    className={`bg-gradient-to-r ${tierColors.main} text-white px-4 py-2`}
                  >
                    {tierLabels[language].main}
                  </Badge>
                </div>
                {renderSponsors(mainSponsors, "main")}
              </motion.div>
            )}

            {regularSponsors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Badge
                    className={`bg-gradient-to-r ${tierColors.sponsor} text-white px-4 py-2`}
                  >
                    {tierLabels[language].sponsor}
                  </Badge>
                </div>
                {renderSponsors(regularSponsors, "sponsor")}
              </motion.div>
            )}

            {supporters.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Badge
                    className={`bg-gradient-to-r ${tierColors.supporter} text-white px-4 py-2`}
                  >
                    {tierLabels[language].supporter}
                  </Badge>
                </div>
                {renderSponsors(supporters, "supporter")}
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
                  {language === "en"
                    ? "Looking for Partners"
                    : "Хамтрагч хайж байна"}
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  {language === "en"
                    ? "We are actively seeking sponsors and partners to support MAIO. Join us in fostering AI innovation in Mongolia."
                    : "Бид MAIO-г дэмжих ивээн тэтгэгч, хамтрагчдыг идэвхтэй хайж байна. Монгол дахь AI инновацийг дэмжихэд нэгдээрэй."}
                </p>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="organizer">
            {renderSponsors(organizers, "organizer")}
          </TabsContent>

          <TabsContent value="main">
            {renderSponsors(mainSponsors, "main")}
          </TabsContent>

          <TabsContent value="sponsor">
            {renderSponsors(regularSponsors, "sponsor")}
          </TabsContent>

          <TabsContent value="supporter">
            {renderSponsors(supporters, "supporter")}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SponsorShowcase;
