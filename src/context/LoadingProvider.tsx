import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Loading from "../components/Loading";

interface LoadingType {
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
  setLoading: (percent: number) => void;
}

export const LoadingContext = createContext<LoadingType | null>(null);

export const LoadingProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(() => {
    if (window.innerWidth <= 768) return false;
    return true;
  });
  const [loading, setLoading] = useState(0);
  // Track the highest value ever set — never go backwards
  const maxPercent = useRef(0);

  const safeSetLoading = (value: number) => {
    if (value > maxPercent.current) {
      maxPercent.current = value;
      setLoading(value);
    }
  };

  const value = {
    isLoading,
    setIsLoading,
    setLoading: safeSetLoading,
  };

  useEffect(() => {
    // Mobile: no loading screen, just fire initial FX
    if (window.innerWidth <= 768) {
      import("../components/utils/initialFX").then((module) => {
        if (module.initialFX) setTimeout(() => module.initialFX(), 100);
      });
      return;
    }

    // Desktop: auto-drive 0→99, then Scene.tsx's progress.loaded() pushes to 100
    let current = 0;
    const tick = () => {
      const step = current < 60 ? Math.floor(Math.random() * 8) + 4
                 : current < 85 ? Math.floor(Math.random() * 3) + 1
                 : 1;
      current = Math.min(current + step, 99);
      safeSetLoading(current);
      if (current < 99) {
        setTimeout(tick, current < 60 ? 40 : current < 85 ? 80 : 150);
      }
      // Stop at 99 — the 3D model finishing load calls setLoading(100) via setProgress
    };
    setTimeout(tick, 50);
  }, []);

  return (
    <LoadingContext.Provider value={value as LoadingType}>
      {isLoading && <Loading percent={loading} />}
      <main className="main-body">{children}</main>
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) throw new Error("useLoading must be used within a LoadingProvider");
  return context;
};
