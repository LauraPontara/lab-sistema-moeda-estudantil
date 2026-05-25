import {
    BookOpen,
    Coffee,
    Film,
    Gift,
    GraduationCap,
    NotebookPen,
    Percent,
    Pizza,
    ShoppingBag,
    Tag,
    Ticket,
    UtensilsCrossed,
} from "lucide-react";

export const ADVANTAGE_CATEGORIES = [
  { value: "ALIMENTACAO", label: "Alimentação" },
  { value: "EDUCACAO", label: "Educação" },
  { value: "MATERIAL", label: "Material" },
  { value: "LAZER", label: "Lazer" },
  { value: "SERVICOS", label: "Serviços" },
  { value: "OUTROS", label: "Outros" },
] as const;

export const ADVANTAGE_ICONS = {
  utensils: UtensilsCrossed,
  coffee: Coffee,
  graduation: GraduationCap,
  book: BookOpen,
  notebook: NotebookPen,
  film: Film,
  ticket: Ticket,
  gift: Gift,
  shopping: ShoppingBag,
  tag: Tag,
  pizza: Pizza,
  percent: Percent,
} as const;

export type AdvantageIcon = keyof typeof ADVANTAGE_ICONS;
export type AdvantageCategory = (typeof ADVANTAGE_CATEGORIES)[number]["value"];

export const ADVANTAGE_CATEGORY_LABELS: Record<AdvantageCategory, string> = {
  ALIMENTACAO: "Alimentação",
  EDUCACAO: "Educação",
  MATERIAL: "Material",
  LAZER: "Lazer",
  SERVICOS: "Serviços",
  OUTROS: "Outros",
};
