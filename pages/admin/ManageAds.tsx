import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useNotify } from "../../components/Notifications";
import { Save, Plus, Trash2 } from "lucide-react";
import { uploadToImgbb } from "../../services/imgbb";

const ManageAds: React.FC = () => {
  const [videoAd, setVideoAd] = useState({ active: false, url: "" });
  const [photoAds, setPhotoAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const notify = useNotify();

  useEffect(() => {
    const fetchAds = async () => {
      const snap = await getDoc(doc(db, "settings", "ads"));
      if (snap.exists()) {
        const data = snap.data();
        if (data.videoAd) setVideoAd(data.videoAd);
        if (data.photoAds) setPhotoAds(data.photoAds);
      }
    };
    fetchAds();
  }, []);

  const handleAddPhotoAd = () => {
    setPhotoAds([...photoAds, { id: Date.now().toString(), active: true, image: "", title: "", text: "", buttonText: "", buttonLink: "" }]);
  };

  const handlePhotoAdChange = (index: number, field: string, value: any) => {
    const newAds = [...photoAds];
    newAds[index][field] = value;
    setPhotoAds(newAds);
  };

  const handleRemovePhotoAd = (index: number) => {
    const newAds = [...photoAds];
    newAds.splice(index, 1);
    setPhotoAds(newAds);
  };

  const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const oldText = photoAds[index].image;
      handlePhotoAdChange(index, "image", "Uploading...");
      try {
        const url = await uploadToImgbb(file);
        if (url) {
          handlePhotoAdChange(index, "image", url);
        } else {
          handlePhotoAdChange(index, "image", oldText);
        }
      } catch (error) {
        handlePhotoAdChange(index, "image", oldText);
        notify("Image upload failed", "error");
      }
    }
  };

  const saveAds = async () => {
    setLoading(true);
    try {
      await setDoc(doc(db, "settings", "ads"), {
        videoAd,
        photoAds
      });
      notify("Ads settings saved", "success");
    } catch (err) {
      notify("Failed to save ads settings", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Promotions & Ads</h2>
        <button 
          onClick={saveAds}
          disabled={loading}
          className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:opacity-80 disabled:opacity-50"
        >
          {loading ? "Saving..." : <><Save className="w-4 h-4" /> Save All</>}
        </button>
      </div>

      {/* Video Ad Section */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800">
        <div className="flex justify-between items-center mb-4">
           <h3 className="text-xl font-bold">Video Ad (Entry Popup)</h3>
           <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input type="checkbox" className="sr-only" checked={videoAd.active} onChange={(e) => setVideoAd({...videoAd, active: e.target.checked})} />
                <div className={`block w-14 h-8 rounded-full transition ${videoAd.active ? 'bg-[#1cdb5e]' : 'bg-gray-300 dark:bg-zinc-700'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${videoAd.active ? 'translate-x-6' : ''}`}></div>
              </div>
              <span className="ml-3 font-bold text-sm">Active</span>
            </label>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2 text-zinc-500">Video Link (MP4)</label>
            <input 
              type="text" 
              value={videoAd.url} 
              onChange={(e) => setVideoAd({...videoAd, url: e.target.value})} 
              className="w-full bg-zinc-50 dark:bg-zinc-800 p-4 rounded-xl text-sm outline-none focus:ring-2 focus:ring-zinc-500" 
              placeholder="e.g. https://github.com/.../raw/main/video.mp4" 
            />
            <p className="text-xs text-zinc-400 mt-2">To use GitHub, copy the 'raw' video link.</p>
          </div>
        </div>
      </div>

      {/* Photo Ads Section */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800">
        <div className="flex justify-between items-center mb-6">
           <h3 className="text-xl font-bold">Random Photo Promos (While Surfing)</h3>
           <button onClick={handleAddPhotoAd} className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-zinc-200">
             <Plus className="w-4 h-4" /> Add Promo
           </button>
        </div>

        <div className="space-y-6">
          {photoAds.map((ad, index) => (
            <div key={ad.id} className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl relative bg-zinc-50 dark:bg-zinc-800/50">
               <button onClick={() => handleRemovePhotoAd(index)} className="absolute top-4 right-4 text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition">
                 <Trash2 className="w-4 h-4" />
               </button>
               
               <div className="flex items-center gap-4 mb-4">
                 <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input type="checkbox" className="sr-only" checked={ad.active} onChange={(e) => handlePhotoAdChange(index, "active", e.target.checked)} />
                      <div className={`block w-10 h-6 rounded-full transition ${ad.active ? 'bg-[#1cdb5e]' : 'bg-gray-300 dark:bg-zinc-700'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${ad.active ? 'translate-x-4' : ''}`}></div>
                    </div>
                    <span className="ml-2 font-bold text-xs text-zinc-500">Active</span>
                  </label>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-bold mb-1 text-zinc-500">Image URL</label>
                    <div className="flex gap-2">
                       <input 
                          type="text" 
                          value={ad.image} 
                          onChange={(e) => handlePhotoAdChange(index, "image", e.target.value)} 
                          className="w-full bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm outline-none" 
                          placeholder="Image URL" 
                       />
                       <label className="bg-zinc-200 dark:bg-zinc-700 p-3 rounded-xl cursor-pointer flex-shrink-0 text-xs font-bold flex items-center justify-center">
                         Upload
                         <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(index, e)} />
                       </label>
                    </div>
                    {ad.image && <img src={ad.image} alt="preview" className="mt-2 h-20 w-auto rounded-lg object-contain" />}
                 </div>
                 
                 <div>
                    <label className="block text-xs font-bold mb-1 text-zinc-500">Title (HTML allowed)</label>
                    <input 
                      type="text" 
                      value={ad.title} 
                      onChange={(e) => handlePhotoAdChange(index, "title", e.target.value)} 
                      className="w-full bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm outline-none" 
                      placeholder="e.g. Special Offer!" 
                    />
                 </div>
                 
                 <div className="md:col-span-2">
                    <label className="block text-xs font-bold mb-1 text-zinc-500">Body Text (HTML allowed for links)</label>
                    <textarea 
                      value={ad.text} 
                      onChange={(e) => handlePhotoAdChange(index, "text", e.target.value)} 
                      className="w-full bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm outline-none h-20" 
                      placeholder="e.g. Use code <a href='/'>XYZ</a> to get 10% off!" 
                    />
                 </div>

                 <div>
                    <label className="block text-xs font-bold mb-1 text-zinc-500">Button Text</label>
                    <input 
                      type="text" 
                      value={ad.buttonText} 
                      onChange={(e) => handlePhotoAdChange(index, "buttonText", e.target.value)} 
                      className="w-full bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm outline-none" 
                      placeholder="e.g. Shop Now" 
                    />
                 </div>

                 <div>
                    <label className="block text-xs font-bold mb-1 text-zinc-500">Button Link</label>
                    <input 
                      type="text" 
                      value={ad.buttonLink} 
                      onChange={(e) => handlePhotoAdChange(index, "buttonLink", e.target.value)} 
                      className="w-full bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm outline-none" 
                      placeholder="e.g. /all-products or https://..." 
                    />
                 </div>

               </div>
            </div>
          ))}
          {photoAds.length === 0 && (
            <div className="text-center py-8 text-zinc-500 text-sm">
               No photo ads configured. Click "Add Promo" to create one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageAds;
