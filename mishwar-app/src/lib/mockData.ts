export interface Tenant {
  id: string;
  slug: string;
  name: string;
  phone: string;
  primaryColor: string;
  logoText: string;
  licenseNumber: string;
  districts: string[];
  routesCount: number;
  monthlyFee: number;
}

export const mockTenants: Record<string, Tenant> = {
  "darb-alaman": {
    id: "1",
    slug: "darb-alaman",
    name: "مؤسسة درب الأمان للنقل الجامعي",
    phone: "0501234567",
    primaryColor: "#0D9488",
    logoText: "درب الأمان",
    licenseNumber: "ت-10452-نقل",
    districts: ["حي الياسمين", "حي النرجس", "حي الملقا", "حي الصحافة", "حي العارض"],
    routesCount: 8,
    monthlyFee: 650,
  },
  "al-safwah": {
    id: "2",
    slug: "al-safwah",
    name: "أسطول الصفوة لنقل الطالبات",
    phone: "0559876543",
    primaryColor: "#2563EB",
    logoText: "الصفوة",
    licenseNumber: "ت-20891-نقل",
    districts: ["حي الروضة", "حي القدس", "حي الحمراء", "حي اليرموك"],
    routesCount: 6,
    monthlyFee: 600,
  },
};
