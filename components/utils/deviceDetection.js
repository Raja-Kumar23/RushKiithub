// Device detection utilities
export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         ('ontouchstart' in window) ||
         (navigator.maxTouchPoints > 0) ||
         window.innerWidth <= 768;
};

export const isIOS = () => {
  if (typeof window === 'undefined') return false;
  
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

export const isAndroid = () => {
  if (typeof window === 'undefined') return false;
  
  return /Android/i.test(navigator.userAgent);
};

export const getDeviceType = () => {
  if (isIOS()) return 'ios';
  if (isAndroid()) return 'android';
  if (isMobile()) return 'mobile';
  return 'desktop';
};