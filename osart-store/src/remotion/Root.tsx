import React from 'react';
import { Composition } from 'remotion';
import { ProductComposition } from './ProductComposition';

export const RemotionRoot: React.FC = () => {
    return (
        <>
            <Composition
                id="ProductShowcase"
                component={ProductComposition as any}
                durationInFrames={150}
                fps={30}
                width={1080}
                height={1920}
                defaultProps={{
                    productName: 'iPhone 15 Pro Display',
                    productImage: 'https://img.freepik.com/free-photo/view-display-parts-smartphones-tablets_23-2150171249.jpg',
                    price: '$129.990',
                    brand: 'OSART PREMIUM',
                }}
            />
        </>
    );
};
