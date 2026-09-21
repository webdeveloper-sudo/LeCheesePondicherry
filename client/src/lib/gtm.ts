// Google Tag Manager / GA4 E-Commerce DataLayer Integration
// Follows official Google Analytics 4 Ecommerce Schema specification

declare global {
  interface Window {
    dataLayer: Record<string, any>[];
  }
}

export interface GTMProductItem {
  item_id: string;
  item_name: string;
  price: number;
  quantity?: number;
  item_category?: string;
  item_variant?: string;
  index?: number;
  discount?: number;
  coupon?: string;
}

export interface GTMPurchaseData {
  transactionId: string;
  value: number;
  tax?: number;
  shipping?: number;
  currency?: string;
  coupon?: string;
  items: GTMProductItem[];
}

const pushToDataLayer = (payload: Record<string, any>) => {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  
  // Mandatory GA4 best practice: Clear previous ecommerce object before pushing a new event
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push(payload);
  
  // Optional debug log in development
  if (import.meta.env.DEV) {
    console.log("[GTM dataLayer]", payload);
  }
};

/**
 * 1. view_item_list - Triggered on Shop / Product Listing pages
 */
export const trackViewItemList = (
  items: GTMProductItem[],
  listName = "All Handcrafted Cheeses",
  listId = "shop_catalog"
) => {
  pushToDataLayer({
    event: "view_item_list",
    ecommerce: {
      item_list_id: listId,
      item_list_name: listName,
      items: items.map((item, idx) => ({
        item_id: item.item_id,
        item_name: item.item_name,
        price: Number(item.price),
        item_category: item.item_category || "Artisanal Cheese",
        item_variant: item.item_variant || "200g",
        index: idx + 1,
        quantity: item.quantity || 1,
      })),
    },
  });
};

/**
 * 2. select_item - Triggered when a user clicks on a product card from a list
 */
export const trackSelectItem = (
  item: GTMProductItem,
  listName = "All Handcrafted Cheeses",
  listId = "shop_catalog"
) => {
  pushToDataLayer({
    event: "select_item",
    ecommerce: {
      item_list_id: listId,
      item_list_name: listName,
      items: [
        {
          item_id: item.item_id,
          item_name: item.item_name,
          price: Number(item.price),
          item_category: item.item_category || "Artisanal Cheese",
          item_variant: item.item_variant || "200g",
          quantity: item.quantity || 1,
        },
      ],
    },
  });
};

/**
 * 3. view_item - Triggered when a user views a Single Product details page
 */
export const trackViewItem = (item: GTMProductItem, currency = "INR") => {
  pushToDataLayer({
    event: "view_item",
    ecommerce: {
      currency,
      value: Number(item.price),
      items: [
        {
          item_id: item.item_id,
          item_name: item.item_name,
          price: Number(item.price),
          item_category: item.item_category || "Artisanal Cheese",
          item_variant: item.item_variant || "200g",
          quantity: item.quantity || 1,
        },
      ],
    },
  });
};

/**
 * 4. add_to_cart - Triggered when a user adds a product to their cart
 */
export const trackAddToCart = (
  item: GTMProductItem,
  quantity = 1,
  currency = "INR"
) => {
  pushToDataLayer({
    event: "add_to_cart",
    ecommerce: {
      currency,
      value: Number(item.price) * quantity,
      items: [
        {
          item_id: item.item_id,
          item_name: item.item_name,
          price: Number(item.price),
          item_category: item.item_category || "Artisanal Cheese",
          item_variant: item.item_variant || "200g",
          quantity,
        },
      ],
    },
  });
};

/**
 * 5. remove_from_cart - Triggered when a user removes a product from their cart
 */
export const trackRemoveFromCart = (
  item: GTMProductItem,
  quantity = 1,
  currency = "INR"
) => {
  pushToDataLayer({
    event: "remove_from_cart",
    ecommerce: {
      currency,
      value: Number(item.price) * quantity,
      items: [
        {
          item_id: item.item_id,
          item_name: item.item_name,
          price: Number(item.price),
          item_category: item.item_category || "Artisanal Cheese",
          item_variant: item.item_variant || "200g",
          quantity,
        },
      ],
    },
  });
};

/**
 * 6. view_cart - Triggered when a user visits the Cart page
 */
export const trackViewCart = (
  items: GTMProductItem[],
  totalValue: number,
  currency = "INR"
) => {
  pushToDataLayer({
    event: "view_cart",
    ecommerce: {
      currency,
      value: Number(totalValue),
      items: items.map((item, idx) => ({
        item_id: item.item_id,
        item_name: item.item_name,
        price: Number(item.price),
        item_category: item.item_category || "Artisanal Cheese",
        item_variant: item.item_variant || "200g",
        index: idx + 1,
        quantity: item.quantity || 1,
      })),
    },
  });
};

/**
 * 7. begin_checkout - Triggered when a user initiates checkout
 */
export const trackBeginCheckout = (
  items: GTMProductItem[],
  totalValue: number,
  coupon?: string,
  currency = "INR"
) => {
  pushToDataLayer({
    event: "begin_checkout",
    ecommerce: {
      currency,
      value: Number(totalValue),
      coupon: coupon || undefined,
      items: items.map((item, idx) => ({
        item_id: item.item_id,
        item_name: item.item_name,
        price: Number(item.price),
        item_category: item.item_category || "Artisanal Cheese",
        item_variant: item.item_variant || "200g",
        index: idx + 1,
        quantity: item.quantity || 1,
      })),
    },
  });
};

/**
 * 8. purchase - Triggered on Order Confirmation / Thank You page
 */
export const trackPurchase = (purchaseData: GTMPurchaseData) => {
  pushToDataLayer({
    event: "purchase",
    ecommerce: {
      transaction_id: purchaseData.transactionId,
      value: Number(purchaseData.value),
      tax: purchaseData.tax !== undefined ? Number(purchaseData.tax) : 0,
      shipping: purchaseData.shipping !== undefined ? Number(purchaseData.shipping) : 0,
      currency: purchaseData.currency || "INR",
      coupon: purchaseData.coupon || undefined,
      items: purchaseData.items.map((item, idx) => ({
        item_id: item.item_id,
        item_name: item.item_name,
        price: Number(item.price),
        item_category: item.item_category || "Artisanal Cheese",
        item_variant: item.item_variant || "200g",
        index: idx + 1,
        quantity: item.quantity || 1,
      })),
    },
  });
};
