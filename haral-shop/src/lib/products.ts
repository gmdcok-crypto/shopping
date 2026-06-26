export type ProductCategory =
  | "meat"
  | "sausage"
  | "grocery"
  | "dairy"
  | "spice"
  | "frozen";

export interface Product {
  id: string;
  category: ProductCategory;
  price: number;
  image: string;
  inStock: boolean;
  popular?: boolean;
  weight?: string;
  names: {
    ko: string;
    en: string;
    ru: string;
    uz: string;
  };
  descriptions: {
    ko: string;
    en: string;
    ru: string;
    uz: string;
  };
}

export function getProductName(product: Product, locale: string): string {
  return product.names[locale as keyof typeof product.names] ?? product.names.ko;
}

export function getProductDescription(product: Product, locale: string): string {
  return product.descriptions[locale as keyof typeof product.descriptions] ?? product.descriptions.ko;
}

export function formatPrice(price: number, locale: string): string {
  return new Intl.NumberFormat(
    locale === "ko" ? "ko-KR" : locale === "ru" ? "ru-RU" : locale === "uz" ? "uz-UZ" : "en-US"
  ).format(price);
}

export function filterProducts(
  products: Product[],
  category: ProductCategory | "all",
  searchQuery?: string,
  sort?: string,
  locale = "ko"
): Product[] {
  let filtered = category === "all" ? products : products.filter((p) => p.category === category);

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        getProductName(p, locale).toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
    );
  }

  if (sort === "price-low") {
    return [...filtered].sort((a, b) => a.price - b.price);
  }
  if (sort === "price-high") {
    return [...filtered].sort((a, b) => b.price - a.price);
  }
  return [...filtered].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
}
