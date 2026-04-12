import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../Auth/firebase";

export const uploadProfileImage = async (
  file: File,
  userId: string
): Promise<string> => {
  const storageRef = ref(storage, `avatars/${userId}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};