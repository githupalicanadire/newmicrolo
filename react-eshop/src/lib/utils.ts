import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const getImageUrl = (imageFile: string): string => {
  // If it's already a full URL, return as is
  if (imageFile.startsWith("http")) {
    return imageFile;
  }

  // For demo purposes, use placeholder images
  return `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&crop=center`;
};

export const getProductImageUrl = (productName: string, index = 0): string => {
  // Demo product images based on product name
  const imageMap: Record<string, string[]> = {
    smartphone: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop",
    ],
    laptop: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=300&fit=crop",
    ],
    headphones: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=300&fit=crop",
    ],
    watch: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=300&fit=crop",
    ],
    camera: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop",
    ],
    tablet: [
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop",
    ],
    keyboard: [
      "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop",
    ],
    mouse: [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&h=300&fit=crop",
    ],
  };

  // Find matching category
  const category = Object.keys(imageMap).find((key) =>
    productName.toLowerCase().includes(key),
  );

  if (category && imageMap[category][index]) {
    return imageMap[category][index];
  }

  // Fallback to generic product image
  return `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&crop=center&sig=${productName.length}`;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateCardNumber = (cardNumber: string): boolean => {
  // Simple card number validation (remove spaces and check length)
  const cleaned = cardNumber.replace(/\s/g, "");
  return cleaned.length >= 13 && cleaned.length <= 19 && /^\d+$/.test(cleaned);
};

export const formatCardNumber = (cardNumber: string): string => {
  // Format card number with spaces (XXXX XXXX XXXX XXXX)
  const cleaned = cardNumber.replace(/\s/g, "");
  const groups = cleaned.match(/.{1,4}/g) || [];
  return groups.join(" ").substring(0, 19); // Max 19 characters including spaces
};

export const maskCardNumber = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\s/g, "");
  if (cleaned.length < 4) return cardNumber;
  const lastFour = cleaned.slice(-4);
  const masked = "*".repeat(cleaned.length - 4) + lastFour;
  return formatCardNumber(masked);
};
