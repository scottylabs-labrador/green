const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.sourceExts.push('cjs');
defaultConfig.resolver.unstable_enablePackageExports = false;
defaultConfig.resolver.blockList = [
  /backend\/.*/
];

module.exports = defaultConfig;
