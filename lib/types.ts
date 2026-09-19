export type DogSex = "male" | "female" | "unknown";
export type DogStatus = "available" | "reserved" | "adopted" | "unpublished";
export type TriState = "yes" | "no" | "unknown";
export type MediaType = "photo" | "video";
export type MediaCategory = "dog" | "bianca" | "daily" | "hero" | "other";

export type Media = {
  id: string;
  dog_id: string | null;
  media_type: MediaType;
  storage_path: string | null;
  external_url: string | null;
  caption: string | null;
  category: MediaCategory;
  sort_order: number;
  published: boolean;
  created_at: string;
};

export type Dog = {
  id: string;
  name: string;
  slug: string;
  sex: DogSex;
  birth_date: string | null;
  birth_date_approximate: boolean;
  status: DogStatus;
  adoption_date: string | null;
  current_location: string | null;
  estimated_size: string | null;
  estimated_weight: string | null;
  short_summary: string | null;
  story: string | null;
  personality: string | null;
  life_with_bianca: string | null;
  ok_dogs: TriState;
  ok_cats: TriState;
  ok_children: TriState;
  vaccinated: TriState;
  identified: TriState;
  dewormed: TriState;
  parasite_treated: TriState;
  is_vaccinated: boolean;
  is_dewormed: boolean;
  is_identified: boolean;
  is_parasite_treated: boolean;
  sterilized: TriState;
  passport: TriState;
  additional_info: string | null;
  main_photo_id: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type DogWithMedia = Dog & {
  media: Media[];
  mainPhoto: Media | null;
};

export type SiteSettings = {
  associationName: string;
  slogan: string;
  logoPath: string | null;
  heroMediaId: string | null;
  biancaPhotoId: string | null;
  email: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  partnerAssociationName: string;
  adoptionFormUrl: string | null;
  donationUrl: string | null;
  donationsActive: boolean;
  sponsorshipUrl: string | null;
  sponsorshipActive: boolean;
  supportUrl: string | null;
  supportActive: boolean;
  donationButtonText: string;
  sponsorshipButtonText: string;
  supportButtonText: string;
  adoptionLegalText: string;
  rna: string;
  maxPhotoSizeMb: number;
  maxVideoSizeMb: number;
};

export type SiteContentKey =
  | "hero_title"
  | "hero_slogan"
  | "hero_intro"
  | "home_intro"
  | "bianca_section_title"
  | "bianca_excerpt"
  | "bianca_presentation"
  | "help_text"
  | "adoption_text"
  | "footer_text"
  | "adopted_intro";

export type SiteContent = Record<SiteContentKey, string>;

export const DEFAULT_SETTINGS: SiteSettings = {
  associationName: "Les Protégés de Bianca",
  slogan: "Petits chiens, grandes histoires.",
  logoPath: null,
  heroMediaId: null,
  biancaPhotoId: null,
  email: null,
  facebookUrl: null,
  instagramUrl: null,
  partnerAssociationName: "Les Pattes Oubliées",
  adoptionFormUrl: null,
  donationsActive: false,
  donationUrl: null,
  sponsorshipActive: false,
  sponsorshipUrl: null,
  supportActive: false,
  supportUrl: null,
  donationButtonText: "Faire un don",
  sponsorshipButtonText: "Parrainer / aider un protégé",
  supportButtonText: "Soutenir l’association",
  adoptionLegalText:
    "Les démarches d’adoption sont réalisées par notre association partenaire.",
  rna: "W951002589",
  maxPhotoSizeMb: 10,
  maxVideoSizeMb: 80,
};

export const DEFAULT_CONTENT: SiteContent = {
  hero_title: "Les Protégés de Bianca",
  hero_slogan: "Petits chiens, grandes histoires.",
  hero_intro:
    "Bianca accueille chez elle, en famille, des chiens principalement petits à moyens. Les Protégés de Bianca soutient son action en Roumanie.",
  home_intro:
    "Chez Bianca, les chiens ne vivent pas à l’écart. Ils partagent la maison, le jardin et le quotidien d’une famille — aux côtés de son mari, de leurs enfants et de leurs propres chiens.\n\nLes Protégés de Bianca fait connaître ces accueils. Les démarches d’adoption sont réalisées par notre association partenaire.",
  bianca_section_title: "Chez Bianca, ils apprennent la vie de famille.",
  bianca_excerpt:
    "Moi, c’est Bianca. Je tends la main aux petits chiens qui n’ont jamais eu la chance d’avoir une vraie famille.",
  bianca_presentation:
    "Moi, c’est Bianca. Je tends la main aux petits chiens qui n’ont jamais eu la chance d’avoir une vraie famille.\n\nGrâce à mon travail, déjà 130 chiens ont trouvé leur famille pour la vie. Des mamans et leurs bébés, des chiots nés seuls dans la rue, des chiens abandonnés par des éleveurs, mais aussi des chiens que les aléas de la vie, comme un décès, ont laissés sans foyer…\n\nLeur histoire est souvent différente, mais je les accueille tous avec le même amour. Ils n’ont rien fait de mal, si ce n’est d’avoir croisé la route de la solitude.\n\nChez moi, mes protégés ne vivent pas à l’écart. Ils apprennent ou réapprennent la vie au cœur d’une famille. Ils partagent notre maison, notre jardin et notre quotidien, aux côtés de mon mari, de nos deux enfants de 6 ans et 1 an, et de nos propres chiens. Ils connaissent la maison, la laisse.\n\nC’est aussi ce qui me permet de vraiment les connaître : leur caractère, leurs petites habitudes, leurs ententes et leurs besoins. Je peux ainsi savoir quelle famille pourra leur correspondre.\n\nIls grandissent entourés d’humains, d’enfants et d’autres chiens, avec l’objectif de les préparer au mieux à leur future vie. Ils sont également suivis sur le plan sanitaire : vaccinés, déparasités et vermifugés avant leur départ.\n\nEt puis arrive le moment que j’attends pour chacun d’entre eux : celui où sa famille le remarque enfin.\n\nOffrir un foyer à l’un de mes protégés, ce n’est pas seulement changer la vie d’un chien.\n\nC’est aussi laisser entrer dans la vôtre un amour immense.\n\nBianca\n\nPetits chiens, grandes histoires.",
  help_text:
    "Vous pouvez soutenir l’accueil des protégés de Bianca. Les dons et le parrainage seront proposés ici dès qu’ils seront en place.",
  adoption_text:
    "Les démarches d’adoption sont réalisées par notre association partenaire {partner}.",
  footer_text: "",
  adopted_intro:
    "Ils ont grandi chez Bianca. Voici celles et ceux qui ont depuis rejoint leur famille.",
};

export const CONTENT_LABELS: Record<SiteContentKey, string> = {
  hero_title: "Titre de la page d’accueil",
  hero_slogan: "Slogan",
  hero_intro: "Texte d’introduction du bandeau d’accueil",
  home_intro: "Texte d’introduction (accueil)",
  bianca_section_title: "Titre de la section Bianca (accueil)",
  bianca_excerpt: "Extrait de présentation de Bianca (accueil)",
  bianca_presentation: "Présentation complète de Bianca",
  help_text: "Texte de la page Nous aider",
  adoption_text: "Texte d’adoption (fiches chiens)",
  footer_text: "Texte complémentaire du pied de page",
  adopted_intro: "Texte d’introduction de la page Adoptés",
};
