import { Dessert } from '../context/DessertContext'
import { Heart, Star } from 'lucide-react'
import { useState } from 'react'

interface DessertCardProps {
  dessert: Dessert
  onAddToWishlist: () => void
  onMarkAsTried: () => void
  isInWishlist?: boolean
  isInTried?: boolean
  rating?: number
  onRate?: (rating: number) => void
  onClick?: () => void
}

const DessertCard: React.FC<DessertCardProps> = ({
  dessert,
  onAddToWishlist,
  onMarkAsTried,
  isInWishlist = false,
  isInTried = false,
  rating = 0,
  onRate,
  onClick,
}) => {
  const [hoverRating, setHoverRating] = useState(0)

  return (
    <div 
      onClick={onClick}
      className={`bg-transparent border-0 overflow-visible dessert-card-3d animate-float-cozy flex flex-col items-center text-center p-2 relative group ${
        onClick ? 'cursor-pointer' : ''
      }`}
      style={{ animationDelay: `${(parseInt(dessert.id) || 0) % 5}s` }}
    >
      {/* 3D Circular Floating Plate Image */}
      <div className="relative w-44 h-44 md:w-48 md:h-48 rounded-full overflow-visible bg-transparent dessert-image-container-3d flex items-center justify-center">
        {/* Soft realistic drop-shadow under the plate */}
        <div className="absolute inset-2 rounded-full bg-[#6E473B]/20 blur-xl group-hover:bg-[#6E473B]/30 group-hover:blur-2xl transition-all duration-500 transform translate-y-6 scale-90" />
        
        {/* The Dessert Plate Image with Bevel and Specular Highlights */}
        <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-card shadow-[0_15px_35px_rgba(41,28,14,0.15)] bg-secondary transition-transform duration-500 group-hover:scale-105 group-hover:shadow-[0_25px_50px_rgba(41,28,14,0.25)] z-10">
          <img
            src={dessert.image}
            alt={dessert.name}
            className="w-full h-full object-cover dessert-image-3d transition-transform duration-700 ease-out group-hover:rotate-[8deg]"
          />
          
          {/* 3D Bowl Rim Bevel & Inner Shadow Overlay (Creates physical glazed depth) */}
          <div className="absolute inset-0 rounded-full border border-black/10 shadow-[inset_0_12px_24px_rgba(255,255,255,0.45),_inset_0_-12px_24px_rgba(41,28,14,0.35)] z-15 pointer-events-none" />
          
          {/* 3D Radial Depth Vignette to curve standard flat photos inside the plate */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/15 via-transparent to-black/25 mix-blend-overlay z-16 pointer-events-none" />
          
          {/* Glass Specular Glare/Reflection sweeping across the plate on hover */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/25 to-transparent transform translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-1000 ease-out z-20 pointer-events-none" />
        </div>

        {/* Favorite Heart floating on the plate side */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onAddToWishlist()
          }}
          className={`absolute bottom-2 right-2 p-2.5 rounded-full backdrop-blur-md shadow-lg transition-all duration-300 z-20 ${
            isInWishlist
              ? 'bg-primary text-primary-foreground scale-105'
              : 'bg-card/90 text-foreground hover:bg-primary hover:text-primary-foreground hover:scale-110'
          }`}
        >
          <Heart className="w-4.5 h-4.5" fill={isInWishlist ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Info Details Content (Seamlessly integrated) */}
      <div className="w-full mt-4 flex flex-col items-center px-2">
        {dessert.category && (
          <span className="text-[10px] tracking-widest text-primary font-bold uppercase mb-1 bg-primary/10 px-2 py-0.5 rounded-full">
            {dessert.category}
          </span>
        )}
        
        <h3 className="font-serif font-bold text-lg text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors duration-300">
          {dessert.name}
        </h3>

        {isInTried && onRate && (
          <div className="mb-3 flex gap-1 justify-center z-20">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
              <button
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={(e) => {
                  e.stopPropagation()
                  onRate(star)
                }}
                className={`w-5 h-5 rounded-full transition-all ${
                  (hoverRating || rating) >= star
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-primary/50'
                }`}
              >
                <Star className="w-3 h-3 mx-auto" fill="currentColor" />
              </button>
            ))}
          </div>
        )}

        {isInTried && !onRate && rating > 0 && (
          <div className="mb-3 flex items-center gap-1.5 justify-center">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  className="w-3.5 h-3.5 text-primary"
                  fill="currentColor"
                />
              ))}
            </div>
            <span className="text-xs font-bold text-foreground">({rating}/10)</span>
          </div>
        )}

        {/* Action Button */}
        <div className="w-full mt-1 z-20">
          {!isInTried ? (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onMarkAsTried()
              }}
              className="px-5 py-1.5 bg-primary/95 text-primary-foreground text-xs font-semibold rounded-full hover:bg-accent hover:shadow-md transition-all duration-300"
            >
              Mark as Tried
            </button>
          ) : (
            <span className="inline-block px-4 py-1 bg-secondary/80 text-secondary-foreground text-xs font-semibold rounded-full opacity-70">
              ✓ Tried
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default DessertCard
