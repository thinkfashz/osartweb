import {
    AbsoluteFill,
    interpolate,
    spring,
    useCurrentFrame,
    useVideoConfig,
    Img
} from 'remotion';
import React from 'react';

export interface ShowcaseProps {
    imageUrl: string;
    productName: string;
    price: string;
}

export const ShowcaseComposition: React.FC<ShowcaseProps> = ({
    imageUrl,
    productName,
    price
}) => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();

    // Animations
    const entrance = spring({
        frame,
        fps,
        config: { damping: 12 },
    });

    const zoom = interpolate(frame, [0, 150], [1, 1.1]);
    const opacity = interpolate(frame, [0, 20], [0, 1]);

    const glowOpacity = interpolate(
        Math.sin(frame / 20),
        [-1, 1],
        [0.2, 0.5]
    );

    return (
        <AbsoluteFill style={{ backgroundColor: '#09090b', overflow: 'hidden' }}>
            {/* Background Glow */}
            <div
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    background: `radial-gradient(circle at 50% 50%, rgba(14, 165, 233, ${glowOpacity}) 0%, transparent 70%)`,
                    filter: 'blur(100px)',
                    opacity: opacity,
                }}
            />

            {/* Product Image */}
            <AbsoluteFill style={{
                justifyContent: 'center',
                alignItems: 'center',
                transform: `scale(${zoom * entrance})`,
                opacity: opacity,
            }}>
                <div style={{
                    width: '70%',
                    height: '70%',
                    borderRadius: '40px',
                    overflow: 'hidden',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                }}>
                    <Img
                        src={imageUrl}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                </div>
            </AbsoluteFill>

            {/* Product Info Overlay */}
            <div style={{
                position: 'absolute',
                bottom: 60,
                left: 60,
                color: 'white',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                opacity: opacity,
                transform: `translateY(${interpolate(frame, [0, 30], [50, 0], { extrapolateRight: 'clamp' })}px)`,
            }}>
                <h1 style={{
                    fontSize: 48,
                    fontWeight: 900,
                    margin: 0,
                    textTransform: 'uppercase',
                    letterSpacing: '-2px',
                    color: '#0EA5E9'
                }}>
                    {productName}
                </h1>
                <p style={{
                    fontSize: 24,
                    fontWeight: 700,
                    margin: '10px 0 0',
                    opacity: 0.8,
                    letterSpacing: '2px'
                }}>
                    {price}
                </p>
            </div>

            {/* Technical Border Decoration */}
            <div style={{
                position: 'absolute',
                inset: 30,
                border: '1px solid rgba(14, 165, 233, 0.2)',
                borderRadius: '40px',
                pointerEvents: 'none'
            }} />
        </AbsoluteFill>
    );
};
