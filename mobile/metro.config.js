const fs = require('fs');
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
// The website and the app share pure logic and data in ../shared (no packages imported there).
config.watchFolders = [path.resolve(__dirname, '../shared')];
config.resolver.nodeModulesPaths = [path.resolve(__dirname, 'node_modules')];

// The largest data files ship as assets beside the code, not inside it, so an update downloads only the files that
// changed (shared/appData.ts). Each is copied to .appdata/ as a .jdata asset, and importing the JSON gives that asset's
// number, which mobile/src/lib/appData.ts reads before the app starts. Restart Metro after rebuilding one of them.
const out = path.resolve(__dirname, '.appdata');
fs.mkdirSync(out, { recursive: true });
const stubs = new Map();
for (const name of require('../shared/appDataFiles.json')) {
  const source = path.resolve(__dirname, '../shared/data', `${name}.json`);
  const flat = name.replace(/\//g, '__');
  const text = fs.readFileSync(source);
  const asset = path.join(out, `${flat}.jdata`);
  if (!fs.existsSync(asset) || !fs.readFileSync(asset).equals(text)) fs.writeFileSync(asset, text);
  const stub = path.join(out, `${flat}.js`);
  const code = `module.exports = require('./${flat}.jdata');\n`;
  if (!fs.existsSync(stub) || fs.readFileSync(stub, 'utf8') !== code) fs.writeFileSync(stub, code);
  stubs.set(source, stub);
}
config.resolver.assetExts = [...config.resolver.assetExts, 'jdata'];
const upstream = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const resolved = (upstream ?? context.resolveRequest)(context, moduleName, platform);
  return resolved.type === 'sourceFile' && stubs.has(resolved.filePath) ? { type: 'sourceFile', filePath: stubs.get(resolved.filePath) } : resolved;
};

module.exports = config;
