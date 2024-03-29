#! /usr/bin/env node
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configureInstallAppDepsCommand = configureInstallAppDepsCommand;
exports.installAppDeps = installAppDeps;

function _builderUtil() {
  const data = require("builder-util");

  _builderUtil = function () {
    return data;
  };

  return data;
}

function _promise() {
  const data = require("builder-util/out/promise");

  _promise = function () {
    return data;
  };

  return data;
}

function _config() {
  const data = require("app-builder-lib/out/util/config");

  _config = function () {
    return data;
  };

  return data;
}

function _electronVersion() {
  const data = require("app-builder-lib/out/electron/electronVersion");

  _electronVersion = function () {
    return data;
  };

  return data;
}

function _packageDependencies() {
  const data = require("app-builder-lib/out/util/packageDependencies");

  _packageDependencies = function () {
    return data;
  };

  return data;
}

function _yarn() {
  const data = require("app-builder-lib/out/util/yarn");

  _yarn = function () {
    return data;
  };

  return data;
}

function _fsExtra() {
  const data = require("fs-extra");

  _fsExtra = function () {
    return data;
  };

  return data;
}

function _lazyVal() {
  const data = require("lazy-val");

  _lazyVal = function () {
    return data;
  };

  return data;
}

var path = _interopRequireWildcard(require("path"));

function _readConfigFile() {
  const data = require("read-config-file");

  _readConfigFile = function () {
    return data;
  };

  return data;
}

function _yargs() {
  const data = _interopRequireDefault(require("yargs"));

  _yargs = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/** @internal */
function configureInstallAppDepsCommand(yargs) {
  // https://github.com/yargs/yargs/issues/760
  // demandOption is required to be set
  return yargs.parserConfiguration({
    "camel-case-expansion": false
  }).option("platform", {
    choices: ["linux", "darwin", "win32"],
    default: process.platform,
    description: "The target platform"
  }).option("arch", {
    choices: (0, _builderUtil().getArchCliNames)().concat("all"),
    default: process.arch === "arm" ? "armv7l" : process.arch,
    description: "The target arch"
  });
}
/** @internal */


async function installAppDeps(args) {
  try {
    _builderUtil().log.info({
      version: "21.2.0"
    }, "electron-builder");
  } catch (e) {
    // error in dev mode without babel
    if (!(e instanceof ReferenceError)) {
      throw e;
    }
  }

  const projectDir = process.cwd();
  const packageMetadata = new (_lazyVal().Lazy)(() => (0, _readConfigFile().orNullIfFileNotExist)((0, _fsExtra().readJson)(path.join(projectDir, "package.json"))));
  const config = await (0, _config().getConfig)(projectDir, null, null, packageMetadata);
  const results = await Promise.all([(0, _config().computeDefaultAppDirectory)(projectDir, (0, _builderUtil().use)(config.directories, it => it.app)), (0, _electronVersion().getElectronVersion)(projectDir, config, packageMetadata)]); // if two package.json — force full install (user wants to install/update app deps in addition to dev)

  await (0, _yarn().installOrRebuild)(config, results[0], {
    frameworkInfo: {
      version: results[1],
      useCustomDist: true
    },
    platform: args.platform,
    arch: args.arch,
    productionDeps: (0, _packageDependencies().createLazyProductionDeps)(results[0], null)
  }, results[0] !== projectDir);
}

function main() {
  return installAppDeps(configureInstallAppDepsCommand(_yargs().default).argv);
}

if (process.mainModule === module) {
  _builderUtil().log.warn("please use as subcommand: electron-builder install-app-deps");

  main().catch(_promise().printErrorAndExit);
} 
// __ts-babel@6.0.4
//# sourceMappingURL=install-app-deps.js.map