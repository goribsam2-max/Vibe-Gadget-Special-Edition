import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(priceBdt: number | string | undefined | null) {
  if (!priceBdt) return "৳0";
  const numPrice = typeof priceBdt === 'string' ? parseFloat(priceBdt) : priceBdt;
  
  if (typeof window !== 'undefined') {
    const region = localStorage.getItem('user_region');
    // BDT to INR approx 0.71
    if (region === 'IN') {
      const inr = Math.round(numPrice * 0.71);
      return `₹${inr.toLocaleString()}`;
    }
    // BDT to PKR approx 2.40
    if (region === 'PK') {
      const pkr = Math.round(numPrice * 2.40);
      return `Rs ${pkr.toLocaleString()}`;
    }
  }
  
  return `৳${numPrice.toLocaleString()}`;
}

export function validateContact(contact: string, type: 'email' | 'phone'): string | null {
  const lowercaseVal = contact.toLowerCase();
  
  const banglaRegex = /[\u0980-\u09FF]/;
  if (banglaRegex.test(lowercaseVal)) {
    return "Bangla characters are not allowed.";
  }

  const forbiddenWords = ['test', 'example', 'user', 'fake', 'dummy', 'admin', 'root', 'vibegadget', 'demo', 'sample'];
  const inappropriate = ['fuck', 'shit', 'bitch', 'cunt', 'asshole', 'dick', 'pussy', 'porn', 'sex'];
  
  if (type === 'email') {
    const userPart = lowercaseVal.split('@')[0] || lowercaseVal;
    
    if (forbiddenWords.some(word => userPart === word || userPart.startsWith(word))) {
      return "This email looks like a dummy email. Please use a real one.";
    }
    if (inappropriate.some(word => userPart.includes(word))) {
      return "Inappropriate words are not allowed.";
    }
    
    const allowedDomains = ["gmail.com", "yahoo.com", "outlook.com", "icloud.com"];
    const domain = lowercaseVal.split("@")[1];
    if (!domain || !allowedDomains.includes(domain)) {
       return "Only Gmail, Yahoo, Outlook, and iCloud are allowed.";
    }
  } else if (type === 'phone') {
    const cleanPhone = contact.replace(/[-.\s+]/g, '');
    
    if (cleanPhone.includes('0177777777') || cleanPhone.includes('123456789') || cleanPhone.match(/(\d)\1{6,}/)) {
      return "Please enter a valid, real phone number.";
    }
    
    if (cleanPhone.startsWith('880')) {
      if (cleanPhone.length !== 13) return "Please enter a valid phone number.";
    } else if (cleanPhone.startsWith('01')) {
      if (cleanPhone.length !== 11) return "Please enter a valid 11-digit phone number.";
    } else {
      if (cleanPhone.length < 10) return "Please enter a valid phone number.";
    }
  }

  return null;
}

