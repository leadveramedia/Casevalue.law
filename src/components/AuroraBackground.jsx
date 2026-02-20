import { useEffect, useRef, memo } from 'react';

const BLOBS = [
  {
    // Gold blob — starts top-left
    style: {
      width: 'clamp(250px, 50vw, 600px)',
      height: 'clamp(250px, 50vw, 600px)',
      top: '-5%',
      left: '-5%',
      background: 'radial-gradient(circle, #FFC447 0%, rgba(255, 196, 71, 0) 70%)',
      opacity: 0.35,
      filter: 'blur(80px)',
    },
    animation: 'auroraFloat1 20s ease-in-out infinite',
  },
  {
    // Teal blob — starts bottom-right
    style: {
      width: 'clamp(220px, 45vw, 550px)',
      height: 'clamp(220px, 45vw, 550px)',
      bottom: '-5%',
      right: '-5%',
      background: 'radial-gradient(circle, #2DD4BF 0%, rgba(45, 212, 191, 0) 70%)',
      opacity: 0.3,
      filter: 'blur(70px)',
    },
    animation: 'auroraFloat2 25s ease-in-out infinite',
  },
  {
    // Light blue blob — starts bottom-left
    style: {
      width: 'clamp(260px, 55vw, 650px)',
      height: 'clamp(260px, 55vw, 650px)',
      bottom: '10%',
      left: '5%',
      background: 'radial-gradient(circle, #60A5FA 0%, rgba(96, 165, 250, 0) 70%)',
      opacity: 0.2,
      filter: 'blur(90px)',
    },
    animation: 'auroraFloat3 15s ease-in-out infinite',
  },
  {
    // Gold-to-teal blend blob — starts center
    style: {
      width: 'clamp(200px, 42vw, 500px)',
      height: 'clamp(200px, 42vw, 500px)',
      top: '30%',
      left: '30%',
      background: 'radial-gradient(ellipse at 30% 40%, #FFC447 0%, #2DD4BF 50%, transparent 70%)',
      opacity: 0.25,
      filter: 'blur(80px)',
    },
    animation: 'auroraFloat4 22s ease-in-out infinite',
  },
];

function AuroraBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    let ticking = false;

    function handleScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (containerRef.current) {
          const offset = window.scrollY * 0.1;
          containerRef.current.style.transform = `translateY(${offset}px)`;
        }
        ticking = false;
      });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {BLOBS.map((blob, i) => (
        <div
          key={i}
          className="absolute rounded-full aurora-blob"
          style={{
            ...blob.style,
            animation: blob.animation,
          }}
        />
      ))}
    </div>
  );
}

export default memo(AuroraBackground);
