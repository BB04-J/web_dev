import { useState, useEffect } from 'react'
import Navigation from '../components/Navigation'
import { Search, Coffee, BookOpen, ExternalLink, Flame, ChevronLeft, ChevronRight, User, ShoppingBag, Heart } from 'lucide-react'

interface CoffeeDrink {
  idMeal: string
  strMeal: string
  strMealThumb: string
  apiImage?: string
  strCategory: string
  strArea: string
  strInstructions: string
  strYoutube: string
  ingredients: string[]
}

// 1. High-Fidelity Static Coffee Dataset mirroring Starbucks Seasonal Campaigns (No Price Fields)
const PREMIUM_COFFEES: CoffeeDrink[] = [
  {
    idMeal: "pc_matcha",
    strMeal: "Matcha Whipped Frappuccino",
    strMealThumb: "/affogato.png", // Plated cup silhouette overlayed on matcha green background glow
    strCategory: "Coffee Corner",
    strArea: "Japanese Fusion",
    strInstructions: "A dreamy, velvety blend of premium organic Kyoto ceremonial matcha green tea, sweet vanilla bean, and chilled milk, crowned with dense cloud whipped cream.",
    strYoutube: "https://www.youtube.com/results?search_query=Matcha+Green+Tea+Frappuccino",
    ingredients: ["Ceremonial Matcha Powder", "Whole Steamed Milk", "Sweet Vanilla Syrup", "Cloud Whipped Cream", "Chilled Crushed Ice"]
  },
  {
    idMeal: "pc_caramel",
    strMeal: "Golden Caramel Macchiato",
    strMealThumb: "/caramel_latte.png",
    strCategory: "Coffee Corner",
    strArea: "Italian Café",
    strInstructions: "Freshly steamed microfoam milk sweetened with vanilla syrup, marked with a bold double shot of espresso and finished with a luxurious grid of crosshatch caramel drizzle.",
    strYoutube: "https://www.youtube.com/results?search_query=Caramel+Macchiato",
    ingredients: ["Fresh Espresso Shot", "Steamed Vanilla Milk", "Crosshatch Caramel Sauce", "Vanilla Pod Extract", "Velvety Foam"]
  },
  {
    idMeal: "pc_vanilla",
    strMeal: "Vanilla Cloud Sweet Cream Cold Brew",
    strMealThumb: "/cold_brew.png",
    strCategory: "Coffee Corner",
    strArea: "Specialty Cold Brew",
    strInstructions: "Slow-steeped 20-hour signature cold brew coffee, lightly sweetened with vanilla syrup and topped with a floating cloud layer of house-made vanilla sweet cream cold foam.",
    strYoutube: "https://www.youtube.com/results?search_query=Vanilla+Sweet+Cream+Cold+Brew",
    ingredients: ["Signature 20h Cold Brew", "Vanilla Bean Syrup", "Sweet Milk Foam", "Vanilla Flower Drops", "Crystal Ice Cubes"]
  },
  {
    idMeal: "pc_mocha",
    strMeal: "Cozy Chocolate Dark Mocha",
    strMealThumb: "/dark_mocha.png",
    strCategory: "Coffee Corner",
    strArea: "Chocolate Lounge",
    strInstructions: "A rich fusion of premium bittersweet chocolate sauce, bold signature espresso shot, and velvety steamed milk, topped with cloud foam and dark cocoa dustings.",
    strYoutube: "https://www.youtube.com/results?search_query=Dark+Chocolate+Mocha",
    ingredients: ["Premium Espresso Shot", "Bittersweet Cocoa Sauce", "Steamed Creamy Milk", "Whipped Chocolate Foam", "Fine Cocoa Dust"]
  },
  {
    idMeal: "pc_affogato",
    strMeal: "Gelato Espresso Affogato",
    strMealThumb: "/affogato.png",
    strCategory: "Coffee Corner",
    strArea: "Gelato Lounge",
    strInstructions: "A scoop of premium, velvety double-churned vanilla bean gelato, gracefully 'drowned' in a piping-hot, double shot of bold house espresso.",
    strYoutube: "https://www.youtube.com/results?search_query=Espresso+Affogato+Recipe",
    ingredients: ["Vanilla Bean Gelato", "Fresh Hot Espresso Shot", "Toasted Hazelnut Crumb", "Grated Dark Chocolate"]
  },
  {
    idMeal: "pc_cappuccino",
    strMeal: "Cozy Spiced Cappuccino",
    strMealThumb: "/caramel_latte.png",
    strCategory: "Coffee Corner",
    strArea: "Classic Café",
    strInstructions: "A classic barista recipe featuring equal parts dark bold espresso shot, hot steamed milk, and a thick, luxurious layer of spiced cinnamon microfoam.",
    strYoutube: "https://www.youtube.com/results?search_query=Classic+Cappuccino",
    ingredients: ["Bold Espresso Shot", "Hot Steamed Milk", "Thick Cinnamon Foam", "Cinnamon Bark Dust"]
  },
  {
    idMeal: "pc_grape",
    strMeal: "Yamanashi Grape Frappuccino",
    strMealThumb: "/affogato.png", // Starbucks seasonal novelty grapes theme
    strCategory: "Coffee Corner",
    strArea: "Seasonal Novelty",
    strInstructions: "A premium white chocolate vanilla cream blend, swirled with a rich, glossy Yamanashi grape purée and topped with light lavender grape whipped cream.",
    strYoutube: "https://www.youtube.com/results?search_query=Starbucks+Grape+Frappuccino",
    ingredients: ["Yamanashi Grape Purée", "Sweet White Chocolate", "Vanilla Cream Blend", "Lavender Grape Cream", "Grapes Crumb"]
  }
]

// Helper function to shuffle array (Fisher-Yates)
const shuffleCoffeeList = (array: CoffeeDrink[]): CoffeeDrink[] => {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

const CoffeePage = () => {
  const [coffees, setCoffees] = useState<CoffeeDrink[]>([])
  const [rawCoffees, setRawCoffees] = useState<CoffeeDrink[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCoffee, setSelectedCoffee] = useState<CoffeeDrink | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [rotationAngle, setRotationAngle] = useState(0)
  
  // Local favorites state
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('cravediary_coffee_favs')
    if (saved) {
      try {
        setFavorites(JSON.parse(saved))
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  // Fetch hot and iced coffee drinks from sampleapis dynamically
  useEffect(() => {
    const fetchLiveCoffees = async () => {
      try {
        const hotApi = (import.meta as any).env?.VITE_COFFEE_HOT_API || 'https://api.sampleapis.com/coffee/hot'
        const icedApi = (import.meta as any).env?.VITE_COFFEE_ICED_API || 'https://api.sampleapis.com/coffee/iced'

        const [hotRes, icedRes] = await Promise.all([
          fetch(hotApi),
          fetch(icedApi)
        ])

        if (!hotRes.ok || !icedRes.ok) {
          throw new Error("Failed to fetch coffee API data")
        }

        const hotData = await hotRes.json()
        const icedData = await icedRes.json()

        const englishHotDescriptions: Record<string, string> = {
          "Latte": "As the most popular coffee drink out there, the latte consists of a shot of espresso and steamed milk with just a touch of foam. It can be ordered plain or flavored with vanilla to pumpkin spices.",
          "Caramel Latte": "If you like flavored lattes, a caramel latte is the perfect choice to enjoy the natural sweetness and creaminess of steamed milk infused with rich caramel.",
          "Cappuccino": "A cappuccino is an espresso-based drink made with more foam than steamed milk, often dusted with cocoa powder or cinnamon on top.",
          "Americano": "With a flavor profile similar to black coffee, the Americano consists of an espresso shot diluted with hot water.",
          "Espresso": "A single shot of bold espresso, served straight or used as the foundational base for most premium specialty coffee beverages.",
          "Macchiato": "The macchiato is a bold espresso-based drink marked with a small dollop of velvety foam on top, sitting perfectly between a cappuccino and a double shot.",
          "Mocha": "For chocolate lovers, the mocha is a rich combination of sweet chocolate, bold espresso, steamed milk, and light foam.",
          "Hot Chocolate": "A cozy, warm, and rich chocolate blend steamed with fresh milk, topped with optional whipped cream or cocoa powder.",
          "Matcha Latte": "A vibrant green, healthy recipe featuring finely ground ceremonial Kyoto matcha whisked with sweet steamed milk.",
          "Seasonal Brew": "A fresh, rotating seasonal cup highlighting unique tasting notes like caramel, hazelnut, fruits, or chocolate.",
          "Svart Te": "A premium black tea brewed from Camellia sinensis leaves, offering a warm, aromatic, and comforting classic brew."
        }

        const mappedHot = hotData
          .filter((item: any) => item.id !== 999 && item.title && item.title.toLowerCase() !== "espresso shot")
          .map((item: any) => {
            const title = item.title || "Specialty Hot Brew"
            const desc = englishHotDescriptions[title] || item.description || "A premium classic hot brew."
            
            // Map transparent PNG thumbnail asset for 3D orbital carousel
            let thumb = "/caramel_latte.png"
            const t = title.toLowerCase()
            if (t.includes('matcha')) thumb = "/affogato.png"
            else if (t.includes('affogato')) thumb = "/affogato.png"
            else if (t.includes('mocha') || t.includes('chocolate') || t.includes('choklad')) thumb = "/dark_mocha.png"
            else if (t.includes('cold brew') || t.includes('iced') || t.includes('is')) thumb = "/cold_brew.png"
            
            return {
              idMeal: `api_hot_${item.id}`,
              strMeal: title,
              strMealThumb: item.image || thumb,
              apiImage: item.image || "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=60",
              strCategory: "Coffee Corner",
              strArea: "Classic Hot",
              strInstructions: desc,
              strYoutube: `https://www.youtube.com/results?search_query=${encodeURIComponent(title + " recipe")}`,
              ingredients: item.ingredients && item.ingredients.length > 0 ? item.ingredients : ["Espresso", "Steamed Milk"]
            }
          })

        const mappedIced = icedData.map((item: any) => {
          const title = item.title || "Specialty Iced Brew"
          const desc = item.description || "A chilling iced specialty brew."
          
          let thumb = "/cold_brew.png"
          const t = title.toLowerCase()
          if (t.includes('matcha')) thumb = "/affogato.png"
          else if (t.includes('mocha') || t.includes('chocolate')) thumb = "/dark_mocha.png"
          else if (t.includes('latte') || t.includes('macchiato') || t.includes('cappuccino') || t.includes('frapino')) thumb = "/caramel_latte.png"
          
          return {
            idMeal: `api_iced_${item.id}`,
            strMeal: title,
            strMealThumb: item.image || thumb,
            apiImage: item.image || "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500&auto=format&fit=crop&q=60",
            strCategory: "Coffee Corner",
            strArea: "Chilled Iced",
            strInstructions: desc,
            strYoutube: `https://www.youtube.com/results?search_query=${encodeURIComponent(title + " recipe")}`,
            ingredients: item.ingredients && item.ingredients.length > 0 ? item.ingredients : ["Coffee", "Ice", "Chilled Milk"]
          }
        })

        const combined = [...mappedHot, ...mappedIced]
        setRawCoffees(combined)
        setCoffees(shuffleCoffeeList(combined))
        setIsLoading(false)
      } catch (err) {
        console.error("Failed to load live sampleapis coffee data:", err)
        // Graceful fallback to premium static dataset
        setRawCoffees(PREMIUM_COFFEES)
        setCoffees(shuffleCoffeeList(PREMIUM_COFFEES))
        setIsLoading(false)
      }
    }

    fetchLiveCoffees()
  }, [])

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    let updated = [...favorites]
    if (favorites.includes(id)) {
      updated = updated.filter(favId => favId !== id)
    } else {
      updated.push(id)
    }
    setFavorites(updated)
    localStorage.setItem('cravediary_coffee_favs', JSON.stringify(updated))
  }

  // Filter coffees dynamically based on search, and shuffle when reset/empty
  useEffect(() => {
    if (isLoading) return
    if (!searchQuery.trim()) {
      setCoffees(shuffleCoffeeList(rawCoffees))
      setActiveIndex(0)
      setRotationAngle(0)
      return
    }
    const filtered = rawCoffees.filter(c => 
      c.strMeal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.strArea.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setCoffees(filtered)
    setActiveIndex(0)
    setRotationAngle(0)
  }, [searchQuery, isLoading, rawCoffees])

  const handlePrev = () => {
    if (coffees.length === 0) return
    const prevIdx = (activeIndex - 1 + coffees.length) % coffees.length
    setActiveIndex(prevIdx)
    setRotationAngle((prev) => prev + (360 / coffees.length))
  }

  const handleNext = () => {
    if (coffees.length === 0) return
    const nextIdx = (activeIndex + 1) % coffees.length
    setActiveIndex(nextIdx)
    setRotationAngle((prev) => prev - (360 / coffees.length))
  }

  const handleCupClick = (idx: number, coffee: CoffeeDrink) => {
    if (idx === activeIndex) {
      setSelectedCoffee(coffee)
      return
    }
    const len = coffees.length
    if (len === 0) return
    
    let diff = idx - activeIndex
    // Find shortest path in circular list
    while (diff > len / 2) diff -= len
    while (diff < -len / 2) diff += len
    
    setActiveIndex(idx)
    setRotationAngle((prev) => prev - diff * (360 / len))
  }

  // Generate color mapping matching active drink (Highly integrated shades of coffee drinks)
  const getThemeColors = (name: string) => {
    const n = name.toLowerCase()
    
    // 1. Matcha forest green
    if (n.includes('matcha') || n.includes('green tea')) {
      return {
        cardBg: 'from-[#2E4133] via-[#435B49] to-[#5B7962]',
        bgPage: 'from-[#0E150F] via-[#1E2E20] to-[#324D37]', 
        glowColor: 'bg-[#435B49]/40',
        textPrimary: 'text-[#2E4133]',
        btnBg: 'bg-[#2E4133] hover:bg-[#1C2920]',
        outlineText: 'MATCHA'
      }
    }
    
    // 2. Apelsinjuice (Orange Juice) - vibrant orange
    if (n.includes('apelsin') || n.includes('orange') || n.includes('juice')) {
      return {
        cardBg: 'from-[#52290B] via-[#753D14] to-[#9E5722]',
        bgPage: 'from-[#1F1105] via-[#3D210A] to-[#603512]', 
        glowColor: 'bg-[#753D14]/40',
        textPrimary: 'text-[#52290B]',
        btnBg: 'bg-[#52290B] hover:bg-[#321705]',
        outlineText: 'ORANGE'
      }
    }
    
    // 3. Lemonad / Lemonade / Frozen Lemonade - soft yellow-green
    if (n.includes('lemonad') || n.includes('lemon') || n.includes('limon')) {
      return {
        cardBg: 'from-[#424722] via-[#5C6332] to-[#7B8547]',
        bgPage: 'from-[#191C0C] via-[#2E3316] to-[#4A5224]', 
        glowColor: 'bg-[#5C6332]/40',
        textPrimary: 'text-[#424722]',
        btnBg: 'bg-[#424722] hover:bg-[#252912]',
        outlineText: 'LEMON'
      }
    }
    
    // 4. Cocoa / Mocha / Hot Chocolate - warm cocoa brown
    if (n.includes('mocha') || n.includes('chocolate') || n.includes('choklad') || n.includes('mocka')) {
      return {
        cardBg: 'from-[#3E2316] via-[#553221] to-[#734731]',
        bgPage: 'from-[#160D0A] via-[#2D1B15] to-[#452A20]', 
        glowColor: 'bg-[#553221]/45',
        textPrimary: 'text-[#3E2316]',
        btnBg: 'bg-[#3E2316] hover:bg-[#20120B]',
        outlineText: 'MOCHA'
      }
    }
    
    // 5. Espresso / Americano / Black Coffee - deep dark espresso obsidian
    if (n.includes('espresso') || n.includes('americano') || n.includes('svart') || n.includes('black') || n.includes('nitro')) {
      return {
        cardBg: 'from-[#1F1714] via-[#2C211D] to-[#3B2C27]',
        bgPage: 'from-[#090605] via-[#150F0D] to-[#261C19]', 
        glowColor: 'bg-[#2C211D]/45',
        textPrimary: 'text-[#1F1714]',
        btnBg: 'bg-[#1F1714] hover:bg-[#100C0A]',
        outlineText: 'ESPRESSO'
      }
    }
    
    // 6. Caramel Macchiato - warm caramel gold
    if (n.includes('caramel') || n.includes('macchiato')) {
      return {
        cardBg: 'from-[#50301B] via-[#6D4229] to-[#8F5B3C]',
        bgPage: 'from-[#1D110A] via-[#351E12] to-[#50301B]', 
        glowColor: 'bg-[#6D4229]/40',
        textPrimary: 'text-[#50301B]',
        btnBg: 'bg-[#50301B] hover:bg-[#321E11]',
        outlineText: 'CARAMEL'
      }
    }
    
    // 7. Tea / Svart Te / Seasonal Brew - deep amber mahogany
    if (n.includes('te') || n.includes('tea') || n.includes('seasonal')) {
      return {
        cardBg: 'from-[#47220B] via-[#663518] to-[#874A27]',
        bgPage: 'from-[#140B05] via-[#2E190D] to-[#4C2B18]', 
        glowColor: 'bg-[#663518]/40',
        textPrimary: 'text-[#47220B]',
        btnBg: 'bg-[#47220B] hover:bg-[#2A1304]',
        outlineText: 'BREWED'
      }
    }
    
    // 8. Default Latte / Cappuccino - cozy latte beige/brown
    return {
      cardBg: 'from-[#4D3525] via-[#6B4B36] to-[#8A634A]',
      bgPage: 'from-[#1C120C] via-[#362319] to-[#523728]', 
      glowColor: 'bg-[#6B4B36]/35',
      textPrimary: 'text-[#4D3525]',
      btnBg: 'bg-[#4D3525] hover:bg-[#2C1D14]',
      outlineText: 'COFFEE'
    }
  }

  const activeCoffee = coffees[activeIndex]
  const activeTheme = activeCoffee ? getThemeColors(activeCoffee.strMeal) : getThemeColors('')

  // Calculate inline styles for true 3D circular/orbital glide rotation
  const getCupStyle = (idx: number) => {
    const len = coffees.length
    if (len === 0) return {}
    
    let diff = idx - activeIndex
    // Find shortest path in circular list
    while (diff > len / 2) diff -= len
    while (diff < -len / 2) diff += len
    
    const absDiff = Math.abs(diff)
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    
    // CRITICAL FIX: Hide any cups that are not the immediate left/right neighbors 
    // to focus the layout and prevent overlapping stacks of JPEG photos
    if (absDiff > 2) {
      return {
        transform: `translateX(${diff * (isMobile ? 80 : 240)}px) translateY(20px) translateZ(-400px) scale(0)`,
        opacity: 0,
        pointerEvents: 'none',
        zIndex: 0,
      } as React.CSSProperties
    }

    // Calculate the raw relative angle
    const rawRelAngle = (idx * (360 / len)) + rotationAngle
    
    // Normalize to [-180, 180] for proximity calculations
    let relAngle = rawRelAngle % 360
    if (relAngle > 180) relAngle -= 360
    if (relAngle < -180) relAngle += 360
    
    // MATHEMATICAL MASTERPIECE: Scale the angle step to exactly 45 degrees
    // by multiplying by (len / 8). This ensures visible items are placed at 
    // exactly -90, -45, 0, 45, and 90 degrees, creating a perfect wide spacing
    // independent of the number of items fetched from the live API!
    const virtualRelAngle = relAngle * (len / 8)
    const absAngle = Math.abs(virtualRelAngle)
    
    // Radii of the 3D orbital path
    const Rx = isMobile ? 120 : 350
    const Rz = isMobile ? 60 : 160
    
    // Steer cups slightly downward as they move left/right to form a curved "smile" arc
    const baseTranslateY = isMobile ? 12 : 24
    const rad = (virtualRelAngle * Math.PI) / 180
    const cosVal = Math.cos(rad)
    const sinVal = Math.sin(rad)
    
    const translateY = baseTranslateY * (1 - cosVal)
    const translateX = Rx * sinVal
    const translateZ = Rz * (cosVal - 1) // 0 at front, negative at back
    
    // Scale transitions smoothly from active scale to base scale
    const activeScale = isMobile ? 1.12 : 1.25
    const baseScale = isMobile ? 0.65 : 0.72
    const scale = baseScale + (activeScale - baseScale) * Math.max(0, cosVal)
    
    // Opacity fades out for cups as they rotate to the back
    let opacity = 0
    let blurVal = 0
    let pointerEvents: 'auto' | 'none' = 'none'
    let zIndex = 0
    
    if (cosVal > -0.3) {
      // In the front hemisphere
      opacity = cosVal > 0 
        ? 0.45 + 0.55 * cosVal // front cups range from 0.45 to 1.0
        : 0.45 * (cosVal + 0.3) / 0.3 // fade out to 0 at cosVal = -0.3
      
      blurVal = (1 - cosVal) * (isMobile ? 2.5 : 4)
      pointerEvents = 'auto'
      zIndex = Math.round((cosVal + 1) * 20) // z-index between 0 and 40
    }
    
    // Pin center cup to front and sharp focus
    const isCenter = absAngle < 5
    if (isCenter) {
      opacity = 1
      blurVal = 0
      zIndex = 50
    }

    return {
      transform: `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateY(${virtualRelAngle * 0.45}deg) scale(${scale})`,
      opacity: opacity,
      filter: blurVal > 0.1 ? `blur(${blurVal}px)` : 'none',
      zIndex: zIndex,
      pointerEvents: pointerEvents,
    } as React.CSSProperties
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${activeTheme.bgPage} relative transition-all duration-1000 ease-in-out flex flex-col justify-between overflow-hidden text-white`}>
      <Navigation />
      <main className="flex-1 flex flex-col justify-between overflow-visible py-6 relative z-10">
        
        {/* Soft Dreamy Ambient top highlight lighting glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-white/10 blur-[140px] rounded-full pointer-events-none z-0" />

        {/* 2. CENTER HERO SLIDER VIEWPORT (Cylindrical circle track slider) */}
        <div className="flex-1 flex flex-col justify-center relative w-full overflow-visible z-20 py-10">
          
          {/* Elegant Search Input Bar centered above carousel (enlarged for prominence) */}
          {!isLoading && coffees.length > 0 && (
            <div className="max-w-sm sm:max-w-md mx-auto w-full px-6 mb-8 flex items-center justify-center gap-3 z-40">
              <div className="relative w-full flex items-center bg-white/10 backdrop-blur-md border border-white/15 rounded-full px-5 py-2.5 hover:bg-white/15 focus-within:bg-white/20 focus-within:border-white/30 transition-all shadow-md">
                <Search className="w-5 h-5 text-white/70" />
                <input
                  type="text"
                  placeholder="Search premium brews..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full ml-3 bg-transparent text-sm text-white placeholder-white/60 focus:outline-none font-semibold tracking-wide"
                />
              </div>
            </div>
          )}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 select-none">
              <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-white animate-spin mb-4" />
              <p className="text-xs font-black tracking-[0.25em] text-white/70 uppercase animate-pulse">Brewing Live Menu...</p>
            </div>
          ) : coffees.length > 0 ? (
            <div className="relative w-full max-w-7xl mx-auto flex items-center justify-center overflow-visible select-none px-6">
              
              {/* Left Outline Circular Navigation Chevron */}
              <button
                onClick={handlePrev}
                className="absolute left-6 md:left-12 z-40 p-4 border border-white/20 rounded-full bg-black/10 hover:bg-white hover:text-black hover:scale-110 hover:border-white active:scale-95 text-white transition-all shadow-lg backdrop-blur-md cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Huge Background Transparent Outline Title behind cups */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none text-center w-full z-10 transition-all duration-700">
                <h2 className="text-8xl md:text-[13rem] font-black text-stroke-premium tracking-[0.2em] leading-none uppercase select-none opacity-40">
                  {activeTheme.outlineText}
                </h2>
              </div>

              {/* WIDESCREEN CIRCULAR CAROUSEL CONTAINER (Dynamic horizontal slide glide!) */}
              <div className="relative w-full h-80 md:h-[360px] flex items-center justify-center overflow-visible z-20 carousel-3d-viewport">
                           {coffees.map((coffee, idx) => {
                  const len = coffees.length
                  const rawRelAngle = (idx * (360 / len)) + rotationAngle
                  let relAngle = rawRelAngle % 360
                  if (relAngle > 180) relAngle -= 360
                  if (relAngle < -180) relAngle += 360
                  const absAngle = Math.abs(relAngle)
                  const cosVal = Math.cos((relAngle * Math.PI) / 180)
                  const isCenter = absAngle < 5
                  
                  return (
                    <div
                      key={coffee.idMeal}
                      onClick={() => handleCupClick(idx, coffee)}
                      className="absolute cursor-pointer carousel-cup-3d"
                      style={getCupStyle(idx)}
                    >
                      <div className="relative w-40 h-40 md:w-52 md:h-52 flex items-center justify-center overflow-visible">
                        {/* Smoothly fading Glowing Spotlight behind featured drink */}
                        <div 
                          className={`absolute inset-4 rounded-full ${activeTheme.glowColor} blur-3xl scale-125 z-0 pointer-events-none transition-opacity duration-500`}
                          style={{ opacity: Math.pow(Math.max(0, cosVal), 6) }} 
                        />
                        
                        {/* Coffee tone highlights for neighbor cups - fades out at the center */}
                        <div 
                          className="absolute inset-2 rounded-full bg-black/15 blur-lg mix-blend-color z-10 pointer-events-none transition-opacity duration-500" 
                          style={{ opacity: 1 - Math.pow(Math.max(0, cosVal), 4) }}
                        />

                        {/* Premium curved glassmorphic card for the API JPEG photo */}
                        <div className="relative w-[85%] h-[85%] rounded-3xl overflow-hidden border-2 border-white shadow-2xl bg-white/20 backdrop-blur-md z-20 flex items-center justify-center">
                          <img 
                            src={coffee.strMealThumb} 
                            alt={coffee.strMeal}
                            className="w-full h-full object-cover select-none"
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}

              </div>

              {/* Right Outline Circular Navigation Chevron */}
              <button
                onClick={handleNext}
                className="absolute right-6 md:right-12 z-40 p-4 border border-white/20 rounded-full bg-black/10 hover:bg-white hover:text-black hover:scale-110 hover:border-white active:scale-95 text-white transition-all shadow-lg backdrop-blur-md cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

            </div>
          ) : (
            <div className="text-center py-20 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 max-w-md mx-auto p-8 shadow-sm">
              <Coffee className="w-12 h-12 text-white/50 mx-auto mb-4 animate-bounce" />
              <h3 className="font-serif font-black text-lg text-white mb-1.5">No seasonal brews found</h3>
              <p className="text-xs text-white/70 leading-normal">Try searching for other options or adjust your query.</p>
            </div>
          )}
        </div>

        {/* 3. BOTTOM DETAILS SECTION (No Price displays) */}
        {!isLoading && activeCoffee && (
          <div className="max-w-4xl mx-auto w-full px-6 z-30 transition-all duration-1000 mt-4">
            
            {/* Centered Coffee Title */}
            <div className="text-center mb-6">
              <span className="text-[9px] font-black tracking-[0.25em] text-white/60 uppercase">
                {activeCoffee.strArea} BARISTA SPECIALTY
              </span>
              <h3 className="text-3xl md:text-4xl font-serif font-black text-white leading-tight mt-1 uppercase tracking-wider drop-shadow-md">
                {activeCoffee.strMeal}
              </h3>
            </div>

            {/* Split Grid: Description vs Outline Button */}
            <div className="grid md:grid-cols-[2fr_1fr] gap-8 items-center border-t border-white/15 pt-6 pb-8">
              {/* Left: Description */}
              <div className="text-center md:text-left">
                <p className="text-xs md:text-sm text-white/85 leading-relaxed font-semibold uppercase tracking-wider select-none line-clamp-3">
                  {activeCoffee.strInstructions}
                </p>
              </div>

              {/* Right: elegant white outline button */}
              <div className="flex justify-center md:justify-end">
                <button
                  onClick={() => setSelectedCoffee(activeCoffee)}
                  className="w-full py-4 px-8 border-2 border-white hover:bg-white hover:text-black text-white text-xs font-black tracking-[0.2em] uppercase rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_12px_30px_rgba(0,0,0,0.15)] flex items-center justify-center gap-2"
                >
                  Brew Recipe - Free
                </button>
              </div>
            </div>

            {/* Little indicator */}
            <p className="text-center text-[9px] font-black text-white/35 uppercase tracking-[0.3em] pb-4">
              &bull; Click side cups or chevrons to slide &bull; Click brew recipe to view details &bull;
            </p>
          </div>
        )}

        {/* 4. EXPLORE MORE SELECTION GRID (Aesthetic perfectly circular rounded-full images) */}
        {coffees.length > 0 && (
          <div className="bg-[#FAF6F0] text-[#291C0E] py-16 px-6 md:px-12 w-full z-30">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-3.5 mb-10 border-b border-[#BEB5A9]/30 pb-4">
                <Coffee className="w-6 h-6 text-[#523A28] animate-pulse" />
                <h2 className="text-2xl font-serif font-black text-[#291C0E] uppercase tracking-wider">
                  Explore More Coffee Beverages
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {coffees.map((coffee, idx) => (
                  <div
                    key={coffee.idMeal}
                    onClick={() => setSelectedCoffee(coffee)}
                    className="bg-transparent border-0 overflow-visible dessert-card-3d animate-float-cozy flex flex-col items-center text-center p-3 relative group cursor-pointer"
                    style={{ animationDelay: `${(idx * 0.7) % 5}s` }}
                  >
                    {/* Plated cup graphics with beautiful curvy rounded-3xl shape and reduced size */}
                    <div className="relative w-28 h-28 rounded-3xl bg-transparent flex items-center justify-center overflow-visible">
                      <div className="absolute inset-1 rounded-3xl bg-black/10 blur-md group-hover:bg-[#523A28]/15 group-hover:blur-lg transition-all duration-500 transform translate-y-3 scale-90" />
                      
                      {/* Soft coffee tone highlights for list cups */}
                      <div className="absolute inset-2 rounded-3xl bg-black/5 blur-md z-0 pointer-events-none" />

                      {/* Curvy Rounded-3xl Shape with premium glassmorphic border */}
                      <div className="relative w-full h-full rounded-3xl overflow-hidden border-2 border-white shadow-md bg-white/30 backdrop-blur-md transition-transform duration-500 group-hover:scale-105 z-10 flex items-center justify-center">
                        <img
                          src={coffee.apiImage || coffee.strMealThumb}
                          alt={coffee.strMeal}
                          className={`transition-transform duration-700 ease-out group-hover:rotate-[8deg] ${coffee.apiImage ? 'w-full h-full object-cover' : 'w-[78%] h-[78%] object-contain'}`}
                        />
                      </div>
                    </div>

                    {/* Content details */}
                    <div className="w-full mt-5 flex flex-col items-center px-1">
                      <span className="text-[8px] tracking-widest text-[#523A28] font-black uppercase mb-1 bg-[#523A28]/10 px-2 py-0.5 rounded-full">
                        {coffee.strArea}
                      </span>
                      <h3 className="font-serif font-black text-sm text-[#291C0E] mb-1 line-clamp-1 group-hover:text-[#523A28] transition-colors truncate">
                        {coffee.strMeal}
                      </h3>
                      <p className="text-[10px] text-muted-foreground leading-normal mb-3 line-clamp-2 max-w-[160px]">
                        {coffee.strInstructions}
                      </p>
                      <span className="px-4 py-1.5 bg-[#523A28] text-white text-[9px] font-black tracking-wider uppercase rounded-full hover:bg-black hover:shadow-md transition-all duration-300 shadow-sm">
                        View & Brew ☕
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. DYNAMIC RECIPE POP-UP MODAL (Perfect circular rounded-full images) */}
        {selectedCoffee && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
            onClick={() => setSelectedCoffee(null)}
          >
            <div
              className="relative bg-[#FAF6F0] text-[#291C0E] w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-[35px] border border-[#BEB5A9]/35 shadow-2xl p-6 md:p-8 animate-in fade-in zoom-in-95 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedCoffee(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#BEB5A9]/30 hover:bg-[#BEB5A9]/50 text-foreground flex items-center justify-center transition-all z-10 font-bold text-sm"
              >
                ✕
              </button>

              {/* Content Grid */}
              <div className="grid md:grid-cols-2 gap-6 items-center">
                
                {/* Left Column: Curvy rounded-[32px] Specular cup illustration (Reduced size) */}
                <div className="flex flex-col items-center justify-center">
                  <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-[32px] bg-transparent flex items-center justify-center overflow-visible">
                    <div className="absolute inset-2 rounded-[32px] bg-black/10 blur-xl transform translate-y-6 scale-90" />
                    
                    <div className="absolute inset-6 rounded-[32px] bg-black/5 blur-xl z-0 pointer-events-none" />

                    <div className="relative w-full h-full rounded-[32px] overflow-hidden border-4 border-white shadow-lg bg-white/30 backdrop-blur-md flex items-center justify-center">
                      <img
                        src={selectedCoffee.apiImage || selectedCoffee.strMealThumb}
                        alt={selectedCoffee.strMeal}
                        className={`z-10 ${selectedCoffee.apiImage ? 'w-full h-full object-cover' : 'w-[78%] h-[78%] object-contain'}`}
                      />
                    </div>
                  </div>
                  
                  <span className="text-[10px] tracking-widest font-black text-[#523A28] mt-6 bg-[#523A28]/10 px-4 py-1.5 rounded-full uppercase">
                    {selectedCoffee.strArea} BARISTA SPECIALTY
                  </span>
                </div>

                {/* Right Column: details */}
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-serif font-black text-[#291C0E] mb-1 leading-tight uppercase tracking-wider">
                      {selectedCoffee.strMeal}
                    </h2>
                    <p className="text-xs text-[#523A28] italic font-bold flex items-center gap-1.5 uppercase tracking-wider">
                      <Flame className="w-4 h-4 animate-bounce" />
                      Signature Dessert Coffee Drink
                    </p>
                  </div>

                  {/* Ingredients list */}
                  <div className="space-y-1.5">
                    <h4 className="font-serif font-black text-sm text-[#291C0E] border-b border-[#BEB5A9]/30 pb-1 uppercase tracking-wider">
                      Ingredients
                    </h4>
                    <ul className="grid grid-cols-1 gap-1.5 text-xs text-muted-foreground font-bold uppercase tracking-wider">
                      {selectedCoffee.ingredients.map((ing, idx) => (
                        <li key={idx} className="flex items-center gap-2 py-0.5">
                          <span className="w-2 h-2 rounded-full bg-[#523A28] flex-shrink-0" />
                          {ing}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Brewing Guide step list */}
                  <div className="space-y-1.5">
                    <h4 className="font-serif font-black text-sm text-[#291C0E] border-b border-[#BEB5A9]/30 pb-1 flex items-center gap-2 uppercase tracking-wider">
                      <BookOpen className="w-4.5 h-4.5 text-[#523A28]" />
                      Brewing Guide
                    </h4>
                    <p className="text-xs leading-relaxed text-muted-foreground whitespace-pre-line max-h-36 overflow-y-auto pr-1">
                      {selectedCoffee.strInstructions}
                    </p>
                  </div>

                  {/* YouTube Video link button */}
                  <a
                    href={selectedCoffee.strYoutube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 px-5 py-3.5 bg-red-700 hover:bg-red-800 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-md transform hover:-translate-y-0.5"
                  >
                    <ExternalLink className="w-4.5 h-4.5" />
                    Watch Brewing Video Tutorial
                  </a>

                </div>

              </div>

              {/* Cafe Quote footer */}
              <div className="mt-6 pt-4 border-t border-[#BEB5A9]/30 text-center">
                <p className="text-[10px] text-muted-foreground/60 italic font-sans">
                  &ldquo;Cozy café vibes are best shared with dessert-loving friends. Enjoy your sweet escape!&rdquo;
                </p>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  )
}

export default CoffeePage
