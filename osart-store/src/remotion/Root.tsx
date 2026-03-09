import { registerRoot } from 'remotion';
import { ShowcaseComposition } from './ProductShowcase/ShowcaseComposition';
import React from 'react';

export const RemotionRoot: React.FC = () => {
    return (
        <>
            <registerRoot>
                <registerRoot.Composition
                    id="ProductShowcase"
                    component={ShowcaseComposition}
                    durationInFrames={150}
                    fps={30}
                    width={1080}
                    height={1080}
                    defaultProps={{
                        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop",
                        productName: "Producto Premium",
                        price: "$99.990"
                    }}
                />
            </registerRoot>
        </>
    );
};

// If we were using the Remotion CLI, we would call registerRoot(RemotionRoot)
// But for @remotion/player, we just export the components.
