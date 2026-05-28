import React from 'react'
import { X, Youtube, BookOpen, Coffee } from 'lucide-react'
import { Dessert } from '../context/DessertContext'

interface RecipeDetailsModalProps {
  dessert: Dessert
  onClose: () => void
}

const getYoutubeEmbedUrl = (url?: string) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11)
    ? `https://www.youtube.com/embed/${match[2]}`
    : '';
}

const RecipeDetailsModal: React.FC<RecipeDetailsModalProps> = ({ dessert, onClose }) => {
  const embedUrl = getYoutubeEmbedUrl(dessert.youtube);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative bg-card text-foreground w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border shadow-2xl p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-secondary/80 hover:bg-muted text-foreground transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-8 mt-2">
          
          {/* Left Column: Image, Video, Quick Specs */}
          <div className="space-y-6">
            <div className="relative h-64 md:h-80 overflow-hidden rounded-xl border border-border bg-secondary">
              <img
                src={dessert.image}
                alt={dessert.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 px-3 py-1 bg-primary text-primary-foreground font-semibold text-xs rounded-full shadow-md">
                {dessert.category || 'Dessert'}
              </div>
            </div>

            {/* Embed Video if present */}
            {embedUrl ? (
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <Youtube className="w-5 h-5 text-red-500" />
                  Embedded Video Tutorial
                </h4>
                <div className="relative pt-[56.25%] overflow-hidden rounded-xl border border-border bg-black">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={embedUrl}
                    title={`${dessert.name} Recipe Tutorial`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
            ) : (
              <div className="p-4 bg-secondary/40 border border-border rounded-xl flex items-center gap-3 text-muted-foreground">
                <Youtube className="w-6 h-6 opacity-40" />
                <p className="text-sm">No video tutorial available for this dessert.</p>
              </div>
            )}
          </div>

          {/* Right Column: Title, Ingredients, Instructions */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2 leading-tight">
                {dessert.name}
              </h2>
              {dessert.country && (
                <p className="text-sm text-primary font-semibold flex items-center gap-1">
                  🌍 Origin: <span className="text-muted-foreground font-normal">{dessert.country}</span>
                </p>
              )}
            </div>

            {/* Ingredients */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-lg text-foreground border-b border-border pb-2 flex items-center gap-2">
                <Coffee className="w-5 h-5 text-primary" />
                Ingredients
              </h4>
              {dessert.ingredients && dessert.ingredients.length > 0 ? (
                <ul className="grid grid-cols-2 gap-2 text-sm">
                  {dessert.ingredients.map((ing, index) => (
                    <li key={index} className="flex items-center gap-2 text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      {ing}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground italic">Ingredients loaded via instructions.</p>
              )}
            </div>

            {/* Instructions */}
            <div className="space-y-3">
              <h4 className="font-serif font-bold text-lg text-foreground border-b border-border pb-2 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Instructions
              </h4>
              <div className="text-sm text-muted-foreground max-h-60 overflow-y-auto pr-2 leading-relaxed whitespace-pre-line space-y-2">
                {dessert.instructions || 'Mix all items and serve cold! Enjoy your sweet cravings!'}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}

export default RecipeDetailsModal
