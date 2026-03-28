export function optimizeCloudinaryImage(url, width = 800) {
  if (!url) return "";

  if (!url.includes("res.cloudinary.com")) {
    return url;
  }

  return url.replace(
    "/image/upload/",
    `/image/upload/f_auto,q_auto,w_${width},c_limit/`,
  );
}
