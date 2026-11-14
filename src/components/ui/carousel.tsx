"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";

interface CarouselContextProps {
  currentIndex: number;
  totalSlides: number;
  setTotalSlides: (count: number) => void;
  goTo: (index: number) => void;
  next: () => void;
  prev: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
}

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

export function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  autoPlay?: boolean;
  interval?: number;
  loop?: boolean;
}

export const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      autoPlay = false,
      interval = 4000,
      loop = true,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [totalSlides, setTotalSlides] = React.useState(0);

    const canScrollPrev = loop || currentIndex > 0;
    const canScrollNext = loop || currentIndex < totalSlides - 1;

    const goTo = React.useCallback(
      (index: number) => {
        if (totalSlides === 0) return;
        if (index < 0) {
          setCurrentIndex(loop ? totalSlides - 1 : 0);
        } else if (index >= totalSlides) {
          setCurrentIndex(loop ? 0 : totalSlides - 1);
        } else {
          setCurrentIndex(index);
        }
      },
      [loop, totalSlides]
    );

    const next = React.useCallback(() => {
      goTo(currentIndex + 1);
    }, [currentIndex, goTo]);

    const prev = React.useCallback(() => {
      goTo(currentIndex - 1);
    }, [currentIndex, goTo]);

    React.useEffect(() => {
      if (!autoPlay || totalSlides <= 1) return;
      const timer = setInterval(() => {
        next();
      }, interval);
      return () => clearInterval(timer);
    }, [autoPlay, interval, totalSlides, next]);

    return (
      <CarouselContext.Provider
        value={{
          currentIndex,
          totalSlides,
          setTotalSlides,
          goTo,
          next,
          prev,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          className={cn("relative overflow-hidden w-full", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = "Carousel";

export const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { currentIndex, setTotalSlides } = useCarousel();
  const childrenCount = React.Children.count(children);

  React.useEffect(() => {
    setTotalSlides(childrenCount);
  }, [childrenCount, setTotalSlides]);

  return (
    <div className="overflow-hidden w-full">
      <div
        ref={ref}
        className={cn("flex transition-transform duration-500 ease-out", className)}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        {...props}
      >
        {children}
      </div>
    </div>
  );
});
CarouselContent.displayName = "CarouselContent";

export const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn("min-w-full shrink-0 grow-0 basis-full", className)}
      {...props}
    />
  );
});
CarouselItem.displayName = "CarouselItem";

export const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { prev, canScrollPrev } = useCarousel();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full h-9 w-9 bg-background/80 backdrop-blur shadow",
        className
      )}
      disabled={!canScrollPrev}
      onClick={prev}
      aria-label="Previous slide"
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

export const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { next, canScrollNext } = useCarousel();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full h-9 w-9 bg-background/80 backdrop-blur shadow",
        className
      )}
      disabled={!canScrollNext}
      onClick={next}
      aria-label="Next slide"
      {...props}
    >
      <ChevronRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  );
});
CarouselNext.displayName = "CarouselNext";
