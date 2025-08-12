export const getMediaURL = (fileName) => {
  return `${import.meta.env.VITE_CDN_BASE_URL}/${fileName}`;
};
