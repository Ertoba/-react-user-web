export const imageSource = (source, fallback = '') => {
  const value = typeof source === 'string' ? source.trim() : source?.src;
  if (!value || /(?:^|\/)(?:null|undefined)(?:\/|[?#]|$)/i.test(value)) return fallback;
  return value;
};
