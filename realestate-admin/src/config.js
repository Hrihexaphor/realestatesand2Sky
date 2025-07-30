export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ROUTES = [
  { path: "property", label: "Property", element: "PropertyPage" },
  {
    path: "property/:id",
    label: "View Property",
    element: "ViewPropertyDetails",
  },
  { path: "amenities", label: "Amenities", element: "AmenityPage" },
  { path: "keyfeature", label: "Key Features", element: "KeyFeatureManager" },
  { path: "developer", label: "Developer", element: "DeveloperPage" },
  { path: "nearest", label: "Nearest", element: "NearestPage" },
  { path: "category", label: "Category", element: "CategoryManager" },
  { path: "featured", label: "Featured", element: "FeaturedManager" },
  { path: "review", label: "Reviews", element: "ReviewTable" },
  {
    path: "advertisement",
    label: "Advertisement",
    element: "AdvertisementForm",
  },
  { path: "inquiryleads", label: "Inquiry Leads", element: "InquiryLeadsPage" },
  { path: "aboutus", label: "About Us", element: "AboutUsPage" },
  {
    path: "privacypolicy",
    label: "Privacy Policy",
    element: "PrivacyPolicyPage",
  },
  {
    path: "cancelpolicy",
    label: "Cancellation Policy",
    element: "CancellationPolicy",
  },
  {
    path: "termandservice",
    label: "Terms and Services",
    element: "TermaAndServicesPage",
  },
  { path: "property/:id/add-faq", label: "Add FAQ", element: "AddFAQPage" },
  { path: "property/:id/faqs", label: "View FAQs", element: "ViewFAQsPage" },
  { path: "blogs", label: "Blogs", element: "BlogPage" },
  {
    path: "blog-category",
    label: "Blog Category",
    element: "BlogCategoryManager",
  },
  { path: "faqmanager", label: "FAQ Manager", element: "FaqManager" },
  {
    path: "contatmanager",
    label: "Contact Manager",
    element: "ContactManager",
  },
  { path: "citymanager", label: "City Manager", element: "CityManager" },
  {
    path: "generatelead",
    label: "Property Inquiry",
    element: "LeadInquiriesPage",
  },
  {
    path: "getinfolead",
    label: "Get Info",
    element: "GetInfoLeads",
  },
  {
    path: "contactuslead",
    label: "Contact Us",
    element: "ContactLeads",
  },
  {
    path: "primaryimage",
    label: "Primary Image",
    element: "PropertyImageManager",
  },
  {
    path: "heroimage",
    label: "Hero Image",
    element: "HeroSectionManager",
  },
  {
    path: "legalleads",
    label: "Legal Leads",
    element: "PropertyLegalLeads",
  },
  {
    path: "interiorleads",
    label: "Interior Leads",
    element: "InteriorLeads",
  },
  {
    path: "investmentleads",
    label: "Investment Leads",
    element: "PropertyInvestmentLeads",
  },
  {
    path: "usermanager",
    label: "User Manager",
    element: "UserManager",
    adminOnly: true,
  },
];

export const USER_ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  ACCOUNT: "account",
  LISTING: "listing",
};
