import React from 'react';
import {
    AbsoluteFill,
    interpolate,
    spring,
    useCurrentFrame,
    useVideoConfig,
    Img,
} from 'remotion';

interface ProductProps {
    productName: string;
    productImage: string;
    price: string;
    brand?: string;
}

export const ProductComposition: React.FC<ProductProps> = ({
    productName,
    productImage,
    price,
    brand = 'OSART PREMIUM',
}) => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();

    // Animations
    const entrance = spring({
        frame,
        fps,
        config: { damping: 12 },
    });

    const scale = interpolate(entrance, [0, 1], [0.8, 1]);
    const opacity = interpolate(entrance, [0, 1], [0, 1]);
    const yOffset = interpolate(entrance, [0, 1], [50, 0]);

    // Background Glow
    const glowOpacity = interpolate(
        Math.sin(frame / 20),
        [-1, 1],
        [0.1, 0.3]
    );

    return (
        <AbsoluteFill style={{ backgroundColor: '#09090b', color: 'white', fontFamily: 'Inter, system-ui' }}>
            {/* Ambient Background Glow */}
            <div
                style={{
                    position: 'absolute',
                    width: '1000px',
                    height: '1000px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, #0ea5e9 0%, transparent 70%)',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    opacity: glowOpacity,
                    filter: 'blur(100px)',
                }}
            />

            {/* Content Container */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    transform: `scale(${scale}) translateY(${yOffset}px)`,
                    opacity: opacity,
                }}
            >
                {/* Brand Tag */}
                <div
                    style={{
                        fontSize: '24px',
                        fontWeight: 900,
                        letterSpacing: '0.4em',
                        color: '#0ea5e9',
                        marginBottom: '40px',
                        textTransform: 'uppercase',
                    }}
                >
                    {brand}
                </div>

                {/* Product Image Container */}
                <div
                    style={{
                        width: '600px',
                        height: '600px',
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '60px',
                        border: '2px solid rgba(255, 255, 255, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '60px',
                        marginBottom: '60px',
                        boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    <Img
                        src={productImage}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.5))',
                        }}
                    />
                </div>

                {/* Product Info */}
                <h1
                    style={{
                        fontSize: '90px',
                        fontWeight: 950,
                        letterSpacing: '-0.05em',
                        margin: 0,
                        textAlign: 'center',
                        textTransform: 'uppercase',
                        fontStyle: 'italic',
                        lineHeight: 0.9,
                    }}
                >
                    {productName.split(' ').map((word, i) => (
                        <div key={i}>
                            {i % 2 === 1 ? (
                                <span style={{ color: '#0ea5e9' }}>{word}</span>
                            ) : (
                                word
                            )}
                        </div>
                    ))}
                </h1>

                {/* Price Tag */}
                <div
                    style={{
                        marginTop: '60px',
                        padding: '24px 60px',
                        backgroundColor: '#0ea5e9',
                        borderRadius: '30px',
                        fontSize: '48px',
                        fontWeight: 900,
                        boxShadow: '0 20px 40px rgba(14, 165, 233, 0.3)',
                    }}
                >
                    {price}
                </div>
            </div>

            {/* Decorative Grid Overlay */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0.1,
                    backgroundImage: 'radial-gradient(#0ea5e9 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    pointerEvents: 'none',
                }}
            />
        </AbsoluteFill>
    );
};
