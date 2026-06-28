import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useNotify } from "../../components/Notifications";
import { Button } from "../../components/ui/button";

import { uploadToImgbb } from "../../services/imgbb";

const ManagePayments: React.FC = () => {
  const notify = useNotify();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [data, setData] = useState({
    facebookUrl: "",
    tiktokUrl: "",
    banglaQrImage: "",
    npsbNumber: "",
    pathaoPayNumber: "",
  });

  useEffect(() => {
    getDoc(doc(db, "settings", "payments")).then((snap) => {
      if (snap.exists()) {
        setData((prev) => ({ ...prev, ...snap.data() }));
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "settings", "payments"), data);
      notify("Settings saved successfully", "success");
    } catch (e) {
      notify("Failed to save settings", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-zinc-500">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Social & Payment Settings</h1>
        <p className="text-zinc-500 text-sm mt-1">Manage Footer links and Bangla QR details.</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 space-y-4">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-2">Social Links (Footer)</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Facebook URL</label>
            <input
              type="text"
              value={data.facebookUrl}
              onChange={(e) => setData({ ...data, facebookUrl: e.target.value })}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1cdb5e]/50 text-zinc-900 dark:text-white"
              placeholder="https://facebook.com/yourpage"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">TikTok URL</label>
            <input
              type="text"
              value={data.tiktokUrl}
              onChange={(e) => setData({ ...data, tiktokUrl: e.target.value })}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1cdb5e]/50 text-zinc-900 dark:text-white"
              placeholder="https://tiktok.com/@yourhandle"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 space-y-4">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-2">Bangla QR Payment Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Bangla QR Image</label>
            <div className="flex flex-col gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setUploadingImage(true);
                    try {
                      const url = await uploadToImgbb(file);
                      setData({ ...data, banglaQrImage: url });
                      notify("Image uploaded successfully", "success");
                    } catch (err) {
                      notify("Failed to upload image", "error");
                    } finally {
                      setUploadingImage(false);
                    }
                  }
                }}
                disabled={uploadingImage}
                className="w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#1cdb5e]/10 file:text-[#1cdb5e] hover:file:bg-[#1cdb5e]/20 disabled:opacity-50"
              />
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 font-bold uppercase">OR</span>
              </div>
              <input
                type="text"
                value={data.banglaQrImage}
                onChange={(e) => setData({ ...data, banglaQrImage: e.target.value })}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1cdb5e]/50 text-zinc-900 dark:text-white"
                placeholder="Paste Image URL here..."
              />
            </div>
            {data.banglaQrImage && (
              <img src={data.banglaQrImage} alt="QR Preview" className="mt-4 w-48 h-48 object-contain border rounded-xl" />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">NPSB Transfer Number (bKash/Nagad/Rocket/Upay/etc.)</label>
            <input
              type="text"
              value={data.npsbNumber}
              onChange={(e) => setData({ ...data, npsbNumber: e.target.value })}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1cdb5e]/50 text-zinc-900 dark:text-white"
              placeholder="e.g. 01700000000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Pathao Pay Number</label>
            <input
              type="text"
              value={data.pathaoPayNumber}
              onChange={(e) => setData({ ...data, pathaoPayNumber: e.target.value })}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1cdb5e]/50 text-zinc-900 dark:text-white"
              placeholder="e.g. 01700000000"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pb-12">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#1cdb5e] hover:bg-[#17ba4f] text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95"
        >
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
};

export default ManagePayments;
