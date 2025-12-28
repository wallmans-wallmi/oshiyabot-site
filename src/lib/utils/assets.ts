/**
 * Asset path utilities
 * 
 * Maps Figma Make asset imports to Next.js public asset paths
 */

export const ASSETS = {
  oshiyaAvatar: '/assets/ea9d3f873ca76c584ffa18ac5550589db242a0e0.png',
  aboutImage: '/assets/8987b8bb591c6b85bd934a46b81596f6b40dd7d7.png',
  howImage: '/assets/9da14f689d0aad6e5536fd64386b0685a4bf8bb0.png',
  contactImage: '/assets/653a3723dbd14f47ecc15c0eb95c1efeff5624a9.png',
} as const;

/**
 * Get asset path by filename hash
 */
export function getAssetPath(filename: string): string {
  const assetMap: Record<string, string> = {
    'ea9d3f873ca76c584ffa18ac5550589db242a0e0.png': ASSETS.oshiyaAvatar,
    '8987b8bb591c6b85bd934a46b81596f6b40dd7d7.png': ASSETS.aboutImage,
    '9da14f689d0aad6e5536fd64386b0685a4bf8bb0.png': ASSETS.howImage,
    '653a3723dbd14f47ecc15c0eb95c1efeff5624a9.png': ASSETS.contactImage,
  };

  return assetMap[filename] || `/assets/${filename}`;
}
