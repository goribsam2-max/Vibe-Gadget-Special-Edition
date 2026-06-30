import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { X, Play, Pause, Volume2, VolumeX, RotateCcw, RotateCw } from 'lucide-react';

export const AdManager: React.FC = () => {
  const [videoAd, setVideoAd] = useState<any>(null);
  const [photoAds, setPhotoAds] = useState<any[]>([]);
  
  const [showVideo, setShowVideo] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const [videoCountdown, setVideoCountdown] = useState(5);
  const [askStopShowing, setAskStopShowing] = useState(false);
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const pageViews = useRef(0);

  useEffect(() => {
    const fetchAds = async () => {
      const snap = await getDoc(doc(db, 'settings', 'ads'));
      if (snap.exists()) {
        const data = snap.data();
        if (data.videoAd && data.videoAd.active && data.videoAd.url) {
          setVideoAd(data.videoAd);
        }
        if (data.photoAds && data.photoAds.length > 0) {
          setPhotoAds(data.photoAds.filter((a: any) => a.active));
        }
      }
    };
    fetchAds();
  }, []);

  useEffect(() => {
    // Check if we should show video ad
    if (videoAd) {
      const lastSeen = localStorage.getItem('vibe_video_ad_hidden');
      const now = Date.now();
      if (!lastSeen || now - parseInt(lastSeen) > 24 * 60 * 60 * 1000) {
        // Show video ad once per session or if not hidden
        const sessionShown = sessionStorage.getItem('vibe_video_ad_session');
        if (!sessionShown) {
          setTimeout(() => {
            setShowVideo(true);
            sessionStorage.setItem('vibe_video_ad_session', 'true');
          }, 1000);
        }
      }
    }
  }, [videoAd]);

  useEffect(() => {
    // Page views tracker for photo ads
    if (photoAds.length > 0) {
      pageViews.current += 1;
      // Show photo ad randomly after a few pages (e.g., every 4-6 pages)
      if (pageViews.current > 3 && Math.random() > 0.5) {
        if (!showVideo && !showPhoto) {
          const randomIndex = Math.floor(Math.random() * photoAds.length);
          setCurrentPhotoIndex(randomIndex);
          setShowPhoto(true);
          pageViews.current = 0; // Reset
        }
      }
    }
  }, [location.pathname, photoAds]);

  useEffect(() => {
    let timer: any;
    if (showVideo && videoCountdown > 0) {
      timer = setInterval(() => {
        setVideoCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showVideo, videoCountdown]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const closeVideo = () => {
    if (videoCountdown > 0) return;
    if (videoRef.current) videoRef.current.pause();
    setAskStopShowing(true);
  };

  const handleStopShowingDecision = (stop: boolean) => {
    if (stop) {
      localStorage.setItem('vibe_video_ad_hidden', Date.now().toString());
    }
    setShowVideo(false);
    setAskStopShowing(false);
  };

  const closePhoto = () => {
    setShowPhoto(false);
  };

  return (
    <>
      {/* Video Ad Popup */}
      <AnimatePresence>
        {showVideo && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-black rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 relative max-w-3xl w-full"
            >
              {!askStopShowing ? (
                <>
                  <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
                    {videoCountdown > 0 ? (
                      <div className="bg-black/50 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-full">
                        Skip in {videoCountdown}s
                      </div>
                    ) : (
                      <button 
                        onClick={closeVideo}
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-2 rounded-full transition-all"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <div className="relative aspect-video w-full bg-black flex items-center justify-center">
                    <video 
                      ref={videoRef}
                      src={videoAd.url}
                      autoPlay
                      className="w-full h-full object-contain"
                      onEnded={() => setVideoCountdown(0)}
                    />
                    
                    {/* Custom Player Controls overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                      <div className="flex items-center justify-center gap-6 mb-4">
                        <button onClick={() => skip(-5)} className="text-white hover:text-[#1cdb5e] transition"><RotateCcw className="w-8 h-8" /></button>
                        <button onClick={togglePlay} className="text-white bg-white/20 p-4 rounded-full hover:bg-white/30 transition">
                          {isPlaying ? <Pause className="w-8 h-8" fill="currentColor" /> : <Play className="w-8 h-8" fill="currentColor" />}
                        </button>
                        <button onClick={() => skip(5)} className="text-white hover:text-[#1cdb5e] transition"><RotateCw className="w-8 h-8" /></button>
                      </div>
                      <div className="flex justify-between items-center">
                         <button onClick={toggleMute} className="text-white hover:text-[#1cdb5e] transition">
                           {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                         </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-8 bg-zinc-900 text-center flex flex-col items-center justify-center min-h-[300px]">
                  <h3 className="text-2xl font-bold text-white mb-4">Hide this video?</h3>
                  <p className="text-zinc-400 mb-8">Do you want to stop seeing this video for the next 24 hours?</p>
                  <div className="flex gap-4">
                    <button onClick={() => handleStopShowingDecision(true)} className="px-6 py-3 rounded-xl bg-zinc-800 text-white font-bold hover:bg-zinc-700 transition">Don't show again</button>
                    <button onClick={() => handleStopShowingDecision(false)} className="px-6 py-3 rounded-xl bg-[#1cdb5e] text-black font-bold hover:bg-[#17ba4f] transition">Keep it</button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Photo Ad Popup */}
      <AnimatePresence>
        {showPhoto && photoAds[currentPhotoIndex] && (
          <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-[2rem] overflow-hidden shadow-2xl relative max-w-md w-full border border-zinc-200 dark:border-zinc-800"
            >
              <button 
                onClick={closePhoto}
                className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 backdrop-blur-md text-white p-2 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              
              {photoAds[currentPhotoIndex].image && (
                <div className="w-full aspect-[4/3] bg-zinc-100 dark:bg-zinc-800">
                  <img src={photoAds[currentPhotoIndex].image} alt="Promotion" className="w-full h-full object-cover" />
                </div>
              )}
              
              <div className="p-8 text-center">
                {photoAds[currentPhotoIndex].title && (
                  <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-3 tracking-tight" dangerouslySetInnerHTML={{__html: photoAds[currentPhotoIndex].title}} />
                )}
                {photoAds[currentPhotoIndex].text && (
                  <p className="text-zinc-500 mb-6 font-medium leading-relaxed" dangerouslySetInnerHTML={{__html: photoAds[currentPhotoIndex].text}} />
                )}
                
                {photoAds[currentPhotoIndex].buttonText && (
                  <button 
                    onClick={() => {
                      closePhoto();
                      if (photoAds[currentPhotoIndex].buttonLink) {
                        if (photoAds[currentPhotoIndex].buttonLink.startsWith('http')) {
                          window.open(photoAds[currentPhotoIndex].buttonLink, '_blank');
                        } else {
                          navigate(photoAds[currentPhotoIndex].buttonLink);
                        }
                      }
                    }}
                    className="w-full py-4 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold shadow-lg hover:scale-105 active:scale-95 transition-all"
                  >
                    {photoAds[currentPhotoIndex].buttonText}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
