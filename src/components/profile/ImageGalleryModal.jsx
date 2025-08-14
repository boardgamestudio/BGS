import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageGalleryModal({ images, isOpen, onClose, initialIndex = 0 }) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, initialIndex]);

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
        if (e.key === 'ArrowLeft') goToPrev();
        if (e.key === 'ArrowRight') goToNext();
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, currentIndex]);
    
    if (!isOpen || !images || images.length === 0) return null;

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const goToPrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return (
        <div 
            className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
            onClick={onClose}
        >
            {/* Close Button */}
            <button 
                onClick={onClose} 
                className="absolute top-6 right-6 z-[10000] text-white p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors" 
            >
                <X className="w-6 h-6" />
            </button>
            
            {/* Navigation Buttons */}
            {images.length > 1 && (
                <>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            goToPrev();
                        }} 
                        className="absolute left-6 z-[10000] text-white p-3 rounded-full bg-black/50 hover:bg-black/70 transition-colors" 
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            goToNext();
                        }} 
                        className="absolute right-6 z-[10000] text-white p-3 rounded-full bg-black/50 hover:bg-black/70 transition-colors" 
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>
                </>
            )}

            {/* Main Image */}
            <div className="flex items-center justify-center w-full h-full p-8">
                <img 
                    src={images[currentIndex]} 
                    alt={`Gallery image ${currentIndex + 1}`} 
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                />
            </div>

            {/* Image Counter */}
            {images.length > 1 && (
                <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium">
                    {currentIndex + 1} / {images.length}
                </div>
            )}

            {/* Thumbnail Strip */}
            {images.length > 1 && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-md overflow-x-auto bg-black/50 p-2 rounded-lg">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={(e) => {
                                e.stopPropagation();
                                setCurrentIndex(index);
                            }}
                            className={`flex-shrink-0 w-12 h-12 rounded overflow-hidden border-2 transition-all ${
                                index === currentIndex ? 'border-yellow-400 shadow-lg' : 'border-white/30 opacity-60 hover:opacity-100'
                            }`}
                        >
                            <img
                                src={image}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}