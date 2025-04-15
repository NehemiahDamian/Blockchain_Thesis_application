/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useDeanStore } from "../store/useDeanStore";
import { Camera, Mail, User } from "lucide-react";

const DeanEsig= () => {
  const { authUser} = useAuthStore();
  const {addEsignature} = useDeanStore();
  const [selectedImg, setSelectedImg] = useState(null);

  // hindi aalisen to need to 
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await addEsignature({  esignature: base64Image });
    };
    console.log(selectedImg);
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar upload section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
               {/* functional to need i keep */}
              <img
                src={selectedImg || authUser?.esignature || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  // functional to  need i keep
                  onChange={handleImageUpload}
                  // disabled={isUpdatingProfile}
                />
              </label>
            </div>
            {/* <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p> */}
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              {/* <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.fullName}</p> */}
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              {/* <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p> */}
            </div>
          </div>

         
        </div>
      </div>
    </div>
  );
};
export default DeanEsig;