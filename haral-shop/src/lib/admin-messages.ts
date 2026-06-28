export type AdminLocale = "ko" | "en";

export const ADMIN_LOCALES: AdminLocale[] = ["ko", "en"];

export const ADMIN_LOCALE_LABELS: Record<AdminLocale, string> = {
  ko: "한국어",
  en: "English",
};

const STORAGE_KEY = "haral_admin_locale";

export function getStoredAdminLocale(): AdminLocale {
  if (typeof window === "undefined") return "ko";
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "en" ? "en" : "ko";
}

export function setStoredAdminLocale(locale: AdminLocale): void {
  localStorage.setItem(STORAGE_KEY, locale);
}

export type AdminMessages = typeof adminMessages.ko;

export const adminMessages = {
  ko: {
    meta: { title: "HARAL 쇼핑몰 관리자" },
    common: {
      loading: "불러오는 중...",
      save: "저장",
      saving: "저장 중...",
      saved: "저장되었습니다.",
      viewAll: "전체 보기",
      view: "보기",
      edit: "수정",
      backToList: "← 상품 목록",
      backToOrders: "주문 목록으로",
      items: "{count}개",
      orders: "{count}건",
      products: "{count}개 상품",
      authRequired: "관리자 인증이 필요합니다.",
      saveFailed: "저장 실패",
      uploadFailed: "이미지 업로드 실패",
    },
    shell: {
      brand: "HARAL",
      title: "쇼핑몰 관리자",
      badge: "자체몰",
      viewStore: "쇼핑몰 보기",
      logout: "로그아웃",
      nav: {
        home: "운영",
        dashboard: "운영 현황",
        products: "상품",
        productList: "상품 목록",
        productNew: "상품 등록",
        sales: "주문·배송",
        orderList: "주문 관리",
        store: "쇼핑몰",
        settings: "쇼핑몰 설정",
      },
    },
    login: {
      subtitle: "HARAL 쇼핑몰 관리자 페이지입니다",
      apiKey: "관리자 API 키",
      submit: "관리자 로그인",
      verifying: "확인 중...",
      invalidKey: "API 키가 올바르지 않습니다.",
      serverError: "서버에 연결할 수 없습니다.",
      hint: "서버에 설정된 ADMIN_API_KEY 값을 입력하세요.",
    },
    dashboard: {
      title: "운영 현황",
      subtitle: "쇼핑몰 주문·매출·상품 현황을 확인합니다.",
      todaySales: "오늘 매출",
      weekSales: "이번 주 매출",
      totalProducts: "등록 상품",
      totalSales: "누적 매출",
      ordersSub: "주문 {count}건",
      stockSub: "판매중 {inStock} / 품절 {outOfStock}",
      totalOrdersSub: "총 주문 {count}건",
      recentOrders: "최근 주문",
      noOrders: "아직 주문이 없습니다.",
      outOfStock: "품절 상품",
      manageProducts: "상품 관리",
      noOutOfStock: "품절 상품이 없습니다.",
    },
    products: {
      title: "상품 목록",
      subtitle: "등록된 상품을 조회·수정합니다.",
      add: "상품 등록",
      search: "상품명, ID 검색",
      colProduct: "상품",
      colCategory: "카테고리",
      colPrice: "가격",
      colStatus: "상태",
      colActions: "관리",
      onSale: "판매중",
      soldOut: "품절",
      popular: "인기",
      newTitle: "상품 등록",
      newSubtitle: "새 상품 정보를 입력하세요.",
      newSuccess: "상품이 등록되었습니다. 목록으로 이동합니다...",
      editTitle: "상품 수정",
      noProductId: "상품 ID가 없습니다.",
      notFound: "상품을 찾을 수 없습니다.",
    },
    productForm: {
      basicInfo: "기본 정보",
      productId: "상품 ID",
      category: "카테고리",
      price: "가격 (원)",
      weight: "중량",
      onSale: "판매 중",
      popular: "인기 상품",
      image: "이미지",
      imageUrl: "이미지 URL",
      uploadImage: "이미지 파일 업로드",
      uploading: "업로드 중...",
      namesDesc: "상품명 / 설명",
      name: "상품명",
      description: "설명",
      localeKo: "한국어",
      localeEn: "English",
      localeRu: "Русский",
      localeUz: "O'zbek",
    },
    orders: {
      title: "주문 목록",
      subtitle: "신규 주문부터 배송 정보까지 확인합니다.",
      orderTitle: "주문 {id}",
      shipping: "배송 정보",
      payment: "결제 정보",
      paymentMethod: "결제수단",
      card: "카드",
      bank: "계좌이체",
      language: "언어",
      subtotal: "상품금액",
      shippingFee: "배송비",
      colOrderId: "주문번호",
      colCustomer: "주문자",
      colPhone: "연락처",
      colItems: "상품수",
      colTotal: "결제금액",
      colDate: "주문일시",
      colDetail: "상세",
      colProduct: "상품",
      colQty: "수량",
      colUnitPrice: "단가",
      colLineTotal: "합계",
      noOrders: "아직 주문이 없습니다.",
    },
    settings: {
      title: "쇼핑몰 설정",
      subtitle: "자체 쇼핑몰 기본 정보와 운영 정책입니다.",
      basicInfo: "기본 정보",
      storeName: "쇼핑몰명",
      storeUrl: "쇼핑몰 주소",
      shippingPolicy: "배송 정책",
      freeShipping: "5만원 이상 무료배송",
      adminAuth: "관리자 접속",
      apiKeyAuth: "API 키 (ADMIN_API_KEY)",
      noticeTitle: "안내",
      noticeBody:
        "이 페이지는 HARAL 자체 쇼핑몰을 운영하는 관리자 전용 화면입니다. 상품·주문 관리는 좌측 메뉴를 이용하세요.",
    },
    categories: {
      meat: "할랄 고기",
      sausage: "소시지",
      grocery: "식료품",
      dairy: "유제품",
      spice: "향신료",
      frozen: "냉동식품",
    },
  },
  en: {
    meta: { title: "HARAL Shop Admin" },
    common: {
      loading: "Loading...",
      save: "Save",
      saving: "Saving...",
      saved: "Saved successfully.",
      viewAll: "View all",
      view: "View",
      edit: "Edit",
      backToList: "← Product list",
      backToOrders: "Back to orders",
      items: "{count} items",
      orders: "{count} orders",
      products: "{count} products",
      authRequired: "Admin authentication required.",
      saveFailed: "Save failed",
      uploadFailed: "Image upload failed",
    },
    shell: {
      brand: "HARAL",
      title: "Shop Admin",
      badge: "Own mall",
      viewStore: "View shop",
      logout: "Log out",
      nav: {
        home: "Operations",
        dashboard: "Overview",
        products: "Products",
        productList: "Product list",
        productNew: "Add product",
        sales: "Orders",
        orderList: "Order management",
        store: "Shop",
        settings: "Shop settings",
      },
    },
    login: {
      subtitle: "HARAL own-mall administration",
      apiKey: "Admin API key",
      submit: "Admin sign in",
      verifying: "Verifying...",
      invalidKey: "Invalid API key.",
      serverError: "Cannot connect to server.",
      hint: "Enter the ADMIN_API_KEY configured on your server.",
    },
    dashboard: {
      title: "Overview",
      subtitle: "Monitor shop orders, sales, and product status.",
      todaySales: "Today's sales",
      weekSales: "This week's sales",
      totalProducts: "Products",
      totalSales: "Total sales",
      ordersSub: "{count} orders",
      stockSub: "In stock {inStock} / Out of stock {outOfStock}",
      totalOrdersSub: "{count} total orders",
      recentOrders: "Recent orders",
      noOrders: "No orders yet.",
      outOfStock: "Out of stock",
      manageProducts: "Manage products",
      noOutOfStock: "No out-of-stock products.",
    },
    products: {
      title: "Product list",
      subtitle: "Browse and edit registered products.",
      add: "Add product",
      search: "Search by name or ID",
      colProduct: "Product",
      colCategory: "Category",
      colPrice: "Price",
      colStatus: "Status",
      colActions: "Actions",
      onSale: "On sale",
      soldOut: "Sold out",
      popular: "Popular",
      newTitle: "Add product",
      newSubtitle: "Enter details for the new product.",
      newSuccess: "Product created. Redirecting to list...",
      editTitle: "Edit product",
      noProductId: "Product ID is missing.",
      notFound: "Product not found.",
    },
    productForm: {
      basicInfo: "Basic info",
      productId: "Product ID",
      category: "Category",
      price: "Price (KRW)",
      weight: "Weight",
      onSale: "On sale",
      popular: "Popular product",
      image: "Image",
      imageUrl: "Image URL",
      uploadImage: "Upload image file",
      uploading: "Uploading...",
      namesDesc: "Names & descriptions",
      name: "Product name",
      description: "Description",
      localeKo: "Korean",
      localeEn: "English",
      localeRu: "Russian",
      localeUz: "Uzbek",
    },
    orders: {
      title: "Orders",
      subtitle: "View new orders and shipping details.",
      orderTitle: "Order {id}",
      shipping: "Shipping",
      payment: "Payment",
      paymentMethod: "Payment method",
      card: "Card",
      bank: "Bank transfer",
      language: "Language",
      subtotal: "Subtotal",
      shippingFee: "Shipping fee",
      colOrderId: "Order ID",
      colCustomer: "Customer",
      colPhone: "Phone",
      colItems: "Items",
      colTotal: "Total",
      colDate: "Date",
      colDetail: "Detail",
      colProduct: "Product",
      colQty: "Qty",
      colUnitPrice: "Unit price",
      colLineTotal: "Total",
      noOrders: "No orders yet.",
    },
    settings: {
      title: "Shop settings",
      subtitle: "Basic information and policies for your own mall.",
      basicInfo: "Basic info",
      storeName: "Shop name",
      storeUrl: "Shop URL",
      shippingPolicy: "Shipping policy",
      freeShipping: "Free shipping over ₩50,000",
      adminAuth: "Admin access",
      apiKeyAuth: "API key (ADMIN_API_KEY)",
      noticeTitle: "Notice",
      noticeBody:
        "This is the admin area for operating the HARAL own mall. Use the sidebar for product and order management.",
    },
    categories: {
      meat: "Halal meat",
      sausage: "Sausages",
      grocery: "Groceries",
      dairy: "Dairy",
      spice: "Spices",
      frozen: "Frozen foods",
    },
  },
} as const;

type NestedKeyOf<T, Prefix extends string = ""> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? NestedKeyOf<T[K], Prefix extends "" ? K : `${Prefix}.${K}`>
        : Prefix extends ""
          ? K
          : `${Prefix}.${K}`;
    }[keyof T & string]
  : never;

export type AdminMessageKey = NestedKeyOf<AdminMessages>;

export function createAdminT(locale: AdminLocale) {
  return function t(
    key: AdminMessageKey,
    params?: Record<string, string | number>
  ): string {
    const parts = key.split(".");
    let value: unknown = adminMessages[locale];
    for (const part of parts) {
      value = (value as Record<string, unknown>)?.[part];
    }
    if (typeof value !== "string") return key;
    if (!params) return value;
    return value.replace(/\{(\w+)\}/g, (_, name: string) =>
      String(params[name] ?? `{${name}}`)
    );
  };
}

export function formatAdminPrice(amount: number, locale: AdminLocale): string {
  return new Intl.NumberFormat(locale === "ko" ? "ko-KR" : "en-US", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatAdminDate(iso: string, locale: AdminLocale): string {
  return new Date(iso).toLocaleString(locale === "ko" ? "ko-KR" : "en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
