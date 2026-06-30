export default function App() {
  const [tab, setTab] = useState("swipe");
  const [deck, setDeck] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [activeRecipe, setActiveRecipe] = useState(null);
  const [detailClosing, setDetailClosing] = useState(false);

  const [preferences, setPreferences] = useState({
    goal: null,
    diet: null,
    maxTime: null,
    servings: 2,
  });

  const filteredRecipes = useMemo(() => {
    return RECIPES.filter(r => {
      if (preferences.maxTime) {
        const minutes = parseInt(r.cookTime);
        if (!isNaN(minutes) && minutes > preferences.maxTime) return false;
      }

      if (preferences.diet === "vegetarian" && !r.tags.includes("vegetarisch")) return false;
      if (preferences.diet === "vegan" && !r.tags.includes("vegan")) return false;

      return true;
    });
  }, [preferences]);

  useEffect(() => {
    setDeck(filteredRecipes);
  }, [filteredRecipes]);

  const handleSwipe = useCallback((id, dir) => {
    setDeck(prev => prev.filter(r => r.id !== id));

    if (dir === "right") {
      const recipe = RECIPES.find(r => r.id === id);
      if (recipe) {
        setFavorites(prev =>
          prev.some(r => r.id === id) ? prev : [...prev, recipe]
        );
      }
    }
  }, []);

  const handleRemove = useCallback((id) => {
    setFavorites(prev => prev.filter(r => r.id !== id));
  }, []);

  const openDetail = useCallback((recipe) => {
    setDetailClosing(false);
    setActiveRecipe(recipe);
  }, []);

  const closeDetail = useCallback(() => {
    setDetailClosing(true);
    setTimeout(() => {
      setActiveRecipe(null);
      setDetailClosing(false);
    }, 280);
  }, []);

  const toggleFavoriteActive = useCallback(() => {
    if (!activeRecipe) return;

    setFavorites(prev => {
      const exists = prev.some(r => r.id === activeRecipe.id);
      return exists
        ? prev.filter(r => r.id !== activeRecipe.id)
        : [...prev, activeRecipe];
    });
  }, [activeRecipe]);

  const isActiveFavorite = activeRecipe
    ? favorites.some(r => r.id === activeRecipe.id)
    : false;

  return (
    <>
      {/* UI blijft exact hetzelfde */}
    </>
  );
}
