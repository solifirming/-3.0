/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Sparkles, X, ChevronLeft, ChevronRight, Upload, RotateCcw, Eye, Plus, Check, RefreshCw } from 'lucide-react';
import { MemoryPhoto } from '../types';
import { DEFAULT_MEMORY_PHOTOS } from '../data';
import { compressImageFile, saveCardToLocal } from '../utils/storage';
import {
  Photo1Chapter22,
  Photo2SnowGirl,
  Photo3BookstoreGirl,
  Photo4StrawberryGirl,
  Photo5NightLightsGirl
} from './CustomPhotoIllustrations';

interface PhotoEnvelopeProps {
  birthdayName: string;
  birthdayAge: number;
  photos: MemoryPhoto[];
  onPhotosChange: (newPhotos: MemoryPhoto[]) => void;
  cardId: string;
  playClickSound: () => void;
  wishesList?: string[];
  selectedThemeIndex?: number;
}

export default function PhotoEnvelope({
  birthdayName,
  birthdayAge,
  photos,
  onPhotosChange,
  cardId,
  playClickSound,
  wishesList = [],
  selectedThemeIndex = 0
}: PhotoEnvelopeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadTargetIndex, setUploadTargetIndex] = useState<number | null>(null);
  const [saveToast, setSaveToast] = useState<string>('');
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const isSharedView = typeof window !== 'undefined' && (new URLSearchParams(window.location.search).get('shared') === '1' || new URLSearchParams(window.location.search).get('s') === '1');

  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => {
      setSaveToast('');
    }, 3500);
  };

  // Upload and compress image
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    playClickSound();
    showToast('⏳ 正在压缩图片并保存...');

    try {
      // Compress image to max 720px / 0.72 quality for high fidelity & compact storage
      const resultUrl = await compressImageFile(file, 720, 0.72);
      if (resultUrl) {
        let next: MemoryPhoto[];
        if (index === -1) {
          next = [
            ...photos,
            {
              id: `custom_${Date.now()}`,
              title: "我们的美好瞬间",
              subtitle: "",
              date: "",
              description: "这一刻的美好，被永远定格。",
              url: resultUrl,
              isCustomCover: true
            }
          ];
        } else {
          next = photos.map((p, idx) => (idx === index ? { ...p, url: resultUrl, isCustomCover: true } : p));
        }

        // Reset broken state for this index
        if (index !== -1 && photos[index]) {
          const pId = photos[index].id || index;
          setBrokenImages(prev => ({ ...prev, [pId]: false }));
        }

        // 1. Update state
        onPhotosChange(next);

        // 2. Persist to IndexedDB & localStorage immediately
        await saveCardToLocal(cardId, { id: cardId, photos: next });

        // 3. Sync to API backend
        fetch('/api/cards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: cardId, photos: next })
        }).catch((err) => console.warn('Cloud sync offline / warning:', err));

        showToast('✨ 图片已成功保存！');
      }
    } catch (err) {
      console.error('Image compression failed:', err);
      showToast('❌ 保存失败，请重试');
    }
  };

  const triggerUploadFor = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound();
    setUploadTargetIndex(index);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleDeletePhoto = (index: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playClickSound();

    const next = photos.filter((_, idx) => idx !== index);
    if (selectedPhotoIndex === index) {
      if (next.length === 0) {
        setSelectedPhotoIndex(null);
      } else {
        setSelectedPhotoIndex(Math.min(index, next.length - 1));
      }
    } else if (selectedPhotoIndex !== null && selectedPhotoIndex > index) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1);
    }

    onPhotosChange(next);
    saveCardToLocal(cardId, { id: cardId, photos: next });
    fetch('/api/cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: cardId, photos: next })
    }).catch(() => {});
    showToast('🗑️ 已删除该相片');
  };

  const handleResetPhotos = (e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound();
    setBrokenImages({});
    onPhotosChange(DEFAULT_MEMORY_PHOTOS);
    saveCardToLocal(cardId, { id: cardId, photos: DEFAULT_MEMORY_PHOTOS });
    fetch('/api/cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: cardId, photos: DEFAULT_MEMORY_PHOTOS })
    }).catch(() => {});
    showToast('🔄 已恢复为预设相片');
  };

  // Toggle Envelope open state
  const handleEnvelopeClick = () => {
    playClickSound();
    setIsOpen((prev) => !prev);
  };

  // Helper to render photo content
  const renderPhotoContent = (photo: MemoryPhoto, index: number) => {
    const photoKey = photo.id || index;
    const isBroken = brokenImages[photoKey];
    const photoUrl = photo.url;

    if (photoUrl && !isBroken) {
      return (
        <img
          src={photoUrl}
          alt={photo.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
          onError={() => {
            setBrokenImages((prev) => ({ ...prev, [photoKey]: true }));
          }}
        />
      );
    }

    return renderFallbackSvg(index);
  };

  const renderFallbackSvg = (index: number) => {
    switch (index % 5) {
      case 0:
        return <Photo1Chapter22 />;
      case 1:
        return <Photo2SnowGirl />;
      case 2:
        return <Photo3BookstoreGirl />;
      case 3:
        return <Photo4StrawberryGirl />;
      case 4:
        return <Photo5NightLightsGirl />;
      default:
        return <Photo1Chapter22 />;
    }
  };

  return (
    <div className="w-full bg-[#1A0829]/90 border-4 border-[#FFE8F5] p-4 sm:p-5 flex flex-col items-center gap-4 relative shadow-2xl">
      {/* Hidden file input for custom image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (uploadTargetIndex !== null) {
            handlePhotoUpload(e, uploadTargetIndex);
          }
        }}
      />

      {/* Ribbon Banner Tag */}
      <div className="absolute -top-3.5 left-4 px-2.5 py-0.5 bg-[#FF8FA3] border-2 border-[#FFE8F5] text-[9px] tracking-widest text-[#FFE8F5] font-bold uppercase shadow-sm">
        ✦ MEMORY ENVELOPE ✦ 专属相片信封
      </div>

      {/* Save Status Toast */}
      {saveToast && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute top-2 right-4 px-3 py-1 bg-[#2C1045] border-2 border-[#F7D070] text-[#F7D070] text-[9px] font-pixel font-bold z-30 shadow-lg flex items-center gap-1.5"
        >
          <Sparkles className="w-3 h-3 text-[#FF8FA3] animate-spin" />
          <span>{saveToast}</span>
        </motion.div>
      )}

      {/* Header Info */}
      <div className="text-center mt-1 border-b border-dashed border-[#7B5EA7]/30 pb-2 w-full">
        <h3 className="text-xs font-pixel font-bold text-[#FFE8F5] tracking-wider flex items-center justify-center gap-1.5">
          <Camera className="w-3.5 h-3.5 text-[#F7D070]" />
          <span>点击信封 ∙ 展露您的珍藏回忆相片</span>
        </h3>
        <p className="text-[9.5px] text-[#C9A9E9] mt-0.5 font-pixel">
          {isOpen
            ? isSharedView
              ? "相片已弹出，点击任意相片可放大观赏"
              : "相片已弹出，您可以随时更换或添加相片（自动实时保存）"
            : "点击下方紫色像素信盒，解封这趟时光旅行"}
        </p>
      </div>

      {/* Envelope Container */}
      <div className="relative w-full max-w-md min-h-[220px] sm:min-h-[260px] flex flex-col items-center justify-center my-2">
        {/* The Pixel Envelope Base */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleEnvelopeClick}
          className="relative w-full max-w-[320px] h-44 sm:h-48 bg-[#331c4f] border-4 border-[#FFE8F5] rounded-none flex items-center justify-center cursor-pointer shadow-xl overflow-visible group"
          style={{ boxShadow: '0 6px 0 rgba(0,0,0,0.4)' }}
        >
          {/* Envelope Slot / Interior shadow */}
          <div className="absolute inset-1 bg-[#25123d] border border-[#7B5EA7]/30" />

          {/* Envelope Fold Triangles */}
          <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
            {/* Top Flap */}
            <motion.div
              animate={{ rotateX: isOpen ? 180 : 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="absolute top-0 left-0 w-full h-1/2 bg-[#52337a] border-b-2 border-[#FFE8F5]/80 origin-top"
              style={{
                clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                zIndex: isOpen ? 1 : 12,
              }}
            />

            {/* Left Flap */}
            <div
              className="absolute top-0 left-0 w-1/2 h-full bg-[#3c225a] border-r-2 border-[#7B5EA7]/20 z-10"
              style={{ clipPath: 'polygon(0% 0%, 100% 50%, 0% 100%)' }}
            />

            {/* Right Flap */}
            <div
              className="absolute top-0 right-0 w-1/2 h-full bg-[#3c225a] border-l-2 border-[#7B5EA7]/20 z-10"
              style={{ clipPath: 'polygon(100% 0%, 0% 50%, 100% 100%)' }}
            />

            {/* Bottom Flap */}
            <div
              className="absolute bottom-0 left-0 w-full h-1/2 bg-[#442767] border-t-2 border-[#FFE8F5]/60 z-10"
              style={{ clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)' }}
            />
          </div>

          {/* Golden Heart Seal Center */}
          <motion.div
            animate={{
              scale: isOpen ? [1, 1.2, 0] : 1,
              opacity: isOpen ? 0 : 1,
            }}
            transition={{ duration: 0.3 }}
            className="absolute z-20 w-10 h-10 bg-[#F7D070] border-2 border-[#FFE8F5] rounded-none flex items-center justify-center shadow-lg"
          >
            <div className="text-[10px] font-pixel text-[#24133c] font-bold">♥</div>
          </motion.div>

          {/* Click to open badge if closed */}
          {!isOpen && (
            <div className="absolute bottom-2 z-20 text-[9px] font-pixel text-[#FFE8F5] bg-black/60 px-2 py-0.5 border border-[#FFE8F5]/30 animate-pulse">
              点击开启回忆信封 (OPEN)
            </div>
          )}
        </motion.div>

        {/* Floating / Popped Out Photos Container */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.9 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="relative w-full z-20 mt-4 flex flex-col items-center"
            >
              <div className="w-full flex flex-wrap justify-center gap-3.5 sm:gap-4 p-2">
                {photos.map((photo, index) => {
                  const tiltDegrees = index % 2 === 0 ? -2 : 2;

                  return (
                    <motion.div
                      key={photo.id || index}
                      initial={{ opacity: 0, y: 40, scale: 0.7, rotate: 0 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        rotate: tiltDegrees,
                      }}
                      transition={{
                        duration: 0.4,
                        delay: Math.min(index * 0.08, 0.4),
                        type: 'spring',
                        stiffness: 120,
                      }}
                      whileHover={{ scale: 1.05, rotate: 0, zIndex: 30 }}
                      onClick={() => {
                        playClickSound();
                        setSelectedPhotoIndex(index);
                      }}
                      className="relative bg-[#FFF2F8] p-2 sm:p-2.5 border-2 border-[#FFE8F5] flex flex-col items-center gap-1.5 cursor-pointer shadow-lg group hover:shadow-2xl transition-all w-[calc(50%-0.5rem)] sm:w-[calc((100%-2*1rem)/3)] max-w-[200px]"
                      style={{
                        boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                      }}
                    >
                      {/* Polaroid Tape Pin at Top */}
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-7 h-3 bg-[#FF8FA3]/80 border border-white skew-x-12 z-10" />

                      {/* Delete Button */}
                      {!isSharedView && (
                        <button
                          type="button"
                          onClick={(e) => handleDeletePhoto(index, e)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-[#25103D] border-2 border-[#FFE8F5] text-[#FFE8F5] flex items-center justify-center cursor-pointer hover:bg-[#FF8FA3] hover:text-[#25103D] z-20 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 hover:opacity-100 transition-opacity shadow"
                          title="删除此照片"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Photo Image Frame */}
                      <div className="relative w-full aspect-square bg-[#221033] border border-stone-300 overflow-hidden flex items-center justify-center">
                        {renderPhotoContent(photo, index)}

                        {/* Hover Quick Zoom / Replace / Delete Overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              playClickSound();
                              setSelectedPhotoIndex(index);
                            }}
                            className="p-1.5 bg-[#FF8FA3] border border-white text-white text-[9px] font-pixel flex items-center gap-0.5 cursor-pointer hover:bg-white hover:text-black"
                            title="查看大图"
                          >
                            <Eye className="w-3 h-3" />
                            <span>放大</span>
                          </button>

                          {!isSharedView && (
                            <button
                              type="button"
                              onClick={(e) => triggerUploadFor(index, e)}
                              className="p-1.5 bg-[#7B5EA7] border border-white text-white text-[9px] font-pixel flex items-center gap-0.5 cursor-pointer hover:bg-white hover:text-black"
                              title="更换图片"
                            >
                              <Upload className="w-3 h-3" />
                              <span>更换</span>
                            </button>
                          )}

                          {!isSharedView && (
                            <button
                              type="button"
                              onClick={(e) => handleDeletePhoto(index, e)}
                              className="p-1.5 bg-[#25103D] border border-[#FF8FA3] text-[#FF8FA3] text-[9px] font-pixel flex items-center gap-0.5 cursor-pointer hover:bg-[#FF8FA3] hover:text-[#25103D]"
                              title="删除此照片"
                            >
                              <X className="w-3 h-3" />
                              <span>删除</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Polaroid Caption / Replace & Delete Buttons */}
                      <div className="w-full text-center flex flex-col items-center pt-0.5">
                        {!isSharedView ? (
                          <div className="mt-1 w-full flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => triggerUploadFor(index, e)}
                              className="flex-1 py-1 bg-[#7B5EA7] border border-[#FFE8F5] text-white text-[8.5px] font-pixel flex items-center justify-center gap-1 hover:bg-[#FF8FA3] hover:text-[#200A38] transition-colors cursor-pointer"
                              title="更换此照片"
                            >
                              <Upload className="w-2.5 h-2.5" />
                              <span>更换</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDeletePhoto(index, e)}
                              className="px-2 py-1 bg-[#25103D] border border-[#FF8FA3] text-[#FF8FA3] text-[8.5px] font-pixel flex items-center justify-center gap-0.5 hover:bg-[#FF8FA3] hover:text-[#25103D] transition-colors cursor-pointer"
                              title="删除此照片"
                            >
                              <X className="w-2.5 h-2.5" />
                              <span>删除</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-[9px] font-pixel text-[#24133c] font-bold py-0.5 truncate max-w-full">
                            {photo.title || `回忆 #${index + 1}`}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}

                {/* Empty State when no photos left */}
                {photos.length === 0 && (
                  <div className="w-full max-w-[280px] p-4 bg-[#25103D]/80 border-2 border-dashed border-[#7B5EA7] flex flex-col items-center text-center gap-2 my-2">
                    <p className="text-[10.5px] text-[#FFE8F5] font-pixel font-bold">
                      📷 目前没有相片
                    </p>
                    <p className="text-[9px] text-[#C9A9E9] font-pixel leading-relaxed">
                      您可以点击右侧「添加新照片」上传专属回忆，或随时点击下方「恢复预设插画」。
                    </p>
                  </div>
                )}

                {/* Add New Photo Button */}
                {!isSharedView && (
                  <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.7 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    onClick={(e) => triggerUploadFor(-1, e)}
                    className="relative bg-[#FFF2F8] p-2 sm:p-2.5 border-2 border-dashed border-[#7B5EA7] flex flex-col items-center justify-center gap-2 cursor-pointer shadow-lg group hover:border-[#FF8FA3] hover:bg-[#FF8FA3]/10 transition-all w-[calc(50%-0.5rem)] sm:w-[calc((100%-2*1rem)/3)] max-w-[200px] min-h-[160px]"
                  >
                    <div className="w-10 h-10 bg-[#7B5EA7] rounded-full flex items-center justify-center text-[#FFE8F5] group-hover:bg-[#FF8FA3] group-hover:text-[#25103D] transition-colors">
                      <Plus className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] text-[#7B5EA7] font-pixel font-bold group-hover:text-[#FF8FA3] transition-colors">
                      添加新照片
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={handleEnvelopeClick}
                  className="px-4 py-2 bg-[#7B5EA7] border-2 border-[#FFE8F5] text-[#FFE8F5] text-[10px] font-pixel font-bold tracking-wider hover:bg-[#8D6CAB] active:translate-y-0.5 cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>收起相片信盒</span>
                </button>

                {!isSharedView && (
                  <button
                    type="button"
                    onClick={handleResetPhotos}
                    className="px-3 py-2 bg-[#25103D] border-2 border-[#7B5EA7] text-[#C9A9E9] text-[9.5px] font-pixel hover:text-[#FFE8F5] hover:border-[#FFE8F5] active:translate-y-0.5 cursor-pointer shadow-md flex items-center gap-1"
                    title="恢复为默认的插画相片"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>恢复预设插画</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lightbox / Zoom Photo Modal */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && photos[selectedPhotoIndex] && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="relative w-full max-w-md bg-[#25103D] border-4 border-[#FFE8F5] p-4 sm:p-5 flex flex-col items-center shadow-2xl"
              style={{ boxShadow: '0 8px 0 rgba(0,0,0,0.6)' }}
            >
              {/* Close Modal Button */}
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setSelectedPhotoIndex(null);
                }}
                className="absolute top-3 right-3 p-1.5 bg-[#FF8FA3] border-2 border-white text-[#24133c] hover:bg-white cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Header Badge */}
              <div className="inline-block px-3 py-0.5 bg-[#F7D070] border-2 border-[#FFE8F5] text-[9.5px] text-[#24133c] font-pixel font-bold mb-3">
                ✦ 珍藏相片回忆 ({selectedPhotoIndex + 1} / {photos.length}) ✦
              </div>

              {/* Enlarged Photo Container */}
              <div className="relative w-full aspect-square bg-[#1A0829] border-2 border-[#FFE8F5] overflow-hidden flex items-center justify-center my-1 shadow-inner">
                {renderPhotoContent(photos[selectedPhotoIndex], selectedPhotoIndex)}
              </div>

              {/* Modal Actions & Nav Controls */}
              <div className="w-full flex justify-between items-center mt-4 gap-2">
                {photos.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setSelectedPhotoIndex((prev) => (prev === null || prev === 0 ? photos.length - 1 : prev - 1));
                    }}
                    className="px-3 py-1.5 bg-[#7B5EA7] border-2 border-[#FFE8F5] text-[#FFE8F5] text-[10px] font-pixel font-bold flex items-center gap-1 cursor-pointer hover:bg-[#8D6CAB]"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>上一张</span>
                  </button>
                ) : (
                  <div className="w-16" />
                )}

                <div className="flex items-center gap-2">
                  {!isSharedView && (
                    <button
                      type="button"
                      onClick={(e) => triggerUploadFor(selectedPhotoIndex, e)}
                      className="px-3 py-1.5 bg-[#FF8FA3] border-2 border-[#FFE8F5] text-[#24133c] text-[10px] font-pixel font-bold flex items-center gap-1 cursor-pointer hover:bg-white"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>上传替换</span>
                    </button>
                  )}

                  {!isSharedView && (
                    <button
                      type="button"
                      onClick={(e) => handleDeletePhoto(selectedPhotoIndex, e)}
                      className="px-3 py-1.5 bg-[#25103D] border-2 border-[#FF8FA3] text-[#FF8FA3] text-[10px] font-pixel font-bold flex items-center gap-1 cursor-pointer hover:bg-[#FF8FA3] hover:text-[#25103D]"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>删除</span>
                    </button>
                  )}
                </div>

                {photos.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setSelectedPhotoIndex((prev) => (prev === null || prev === photos.length - 1 ? 0 : prev + 1));
                    }}
                    className="px-3 py-1.5 bg-[#7B5EA7] border-2 border-[#FFE8F5] text-[#FFE8F5] text-[10px] font-pixel font-bold flex items-center gap-1 cursor-pointer hover:bg-[#8D6CAB]"
                  >
                    <span>下一张</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <div className="w-16" />
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
