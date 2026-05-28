import { useDessert } from '../context/DessertContext'
import Navigation from '../components/Navigation'
import DessertCard from '../components/DessertCard'
import { Star, Trash2 } from 'lucide-react'
import { useState } from 'react'

const TriedPage = () => {
  const { tried, ratings, removeFromTried, rateDessert, addNote, notes } = useDessert()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [noteText, setNoteText] = useState<Record<string, string>>({})

  const handleSaveNote = (dessertId: string) => {
    if (noteText[dessertId]) {
      addNote(dessertId, noteText[dessertId])
    }
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-8">
            <Star className="w-8 h-8 text-primary" fill="currentColor" />
            <h1 className="text-4xl font-serif font-bold text-foreground">Tried & Rated</h1>
          </div>

          {tried.length === 0 ? (
            <div className="text-center py-20">
              <Star className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h2 className="text-2xl font-semibold text-foreground mb-2">Nothing tried yet</h2>
              <p className="text-muted-foreground mb-8">Mark desserts as tried from the Discover page!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {tried.map(dessert => (
                <div
                  key={dessert.id}
                  className="bg-card rounded-xl border border-border p-6 hover:border-primary transition-all"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Image */}
                    <div className="md:w-32 md:h-32 flex-shrink-0">
                      <img
                        src={dessert.image}
                        alt={dessert.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold text-foreground mb-2">{dessert.name}</h3>

                      {dessert.category && (
                        <p className="text-sm text-muted-foreground mb-4">{dessert.category}</p>
                      )}

                      {/* Rating */}
                      <div className="mb-4">
                        <label className="text-sm font-medium text-foreground block mb-2">Rate (1-10)</label>
                        <div className="flex gap-2 flex-wrap">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                            <button
                              key={num}
                              onClick={() => rateDessert(dessert.id, num)}
                              className={`px-3 py-1 rounded-lg transition-all ${
                                ratings[dessert.id] === num
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-secondary text-secondary-foreground hover:bg-muted'
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                        {ratings[dessert.id] && (
                          <p className="text-sm text-primary mt-2 font-semibold">
                            Rating: {ratings[dessert.id]}/10
                          </p>
                        )}
                      </div>

                      {/* Note */}
                      {expandedId === dessert.id && (
                        <div className="mb-4">
                          <label className="text-sm font-medium text-foreground block mb-2">Add a Note</label>
                          <textarea
                            value={noteText[dessert.id] || notes[dessert.id] || ''}
                            onChange={(e) => setNoteText({ ...noteText, [dessert.id]: e.target.value })}
                            placeholder="Share your thoughts about this dessert..."
                            className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                            rows={3}
                          />
                          <button
                            onClick={() => {
                              handleSaveNote(dessert.id)
                              setExpandedId(null)
                            }}
                            className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition-colors font-semibold text-sm"
                          >
                            Save Note
                          </button>
                        </div>
                      )}

                      {notes[dessert.id] && (
                        <div className="mb-4 p-3 bg-secondary rounded-lg">
                          <p className="text-sm text-secondary-foreground italic">{notes[dessert.id]}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 flex-wrap">
                        {!expandedId ? (
                          <button
                            onClick={() => setExpandedId(dessert.id)}
                            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-muted transition-colors text-sm font-semibold"
                          >
                            {notes[dessert.id] ? 'Edit Note' : 'Add Note'}
                          </button>
                        ) : null}
                        <button
                          onClick={() => removeFromTried(dessert.id)}
                          className="px-4 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors text-sm font-semibold flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}

export default TriedPage
