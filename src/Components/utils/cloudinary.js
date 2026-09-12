export async function uploadToCloudinary(file) {
  const CLOUD_NAME = "dynzbsha7";        // replace
  const UPLOAD_PRESET = "unsigned_profiles";  // replace

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(url, {
    method: "POST",
    body: fd,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cloudinary upload failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data.secure_url; // return uploaded image URL
}