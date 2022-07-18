import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { uglify } from "rollup-plugin-uglify";

import {
  author,
  description,
  homepage,
  license,
  name,
  main,
  module,
  version,
} from "./package.json";

const banner = `/**
  @preserve ${name} - ${description}
  @version v${version}
  @link ${homepage}
  @author ${author}
  @license ${license}
**/`;

const plugins = [
  resolve(),
  commonjs(),
  typescript({
    tsconfig: false,
    lib: ["esnext", "dom"],
    target: "esnext",
    moduleResolution: "node",
    resolveJsonModule: true,
  }),
];

const comments = (_, { type = "", value = "" } = {}) =>
  type === "comment2" ? /@preserve|@license|@cc_on/i.test(value) : "";

const uglifyOutput = {
  output: {
    comments,
  },
};

const ensureArray = (maybeArr) =>
  Array.isArray(maybeArr) ? maybeArr : [maybeArr];

const createConfig = ({ input, output, env = "" }) => {
  if (env === "production") plugins.push(uglify(uglifyOutput));

  return {
    input,
    plugins,
    output: ensureArray(output).map((format) =>
      Object.assign({}, format, {
        banner,
        name,
      })
    ),
  };
};

export const configs = [
  createConfig({
    input: "src/stickybits.ts",
    output: [
      { file: main, format: "umd", name },
      { file: module, format: "es", name },
    ],
  }),
  createConfig({
    input: "src/stickybits.ts",
    output: {
      file: "dist/stickybits.min.ts",
      format: "umd",
      name,
    },
    env: "production",
  }),
  createConfig({
    input: "src/jquery.stickybits.ts",
    output: {
      file: "dist/jquery.stickybits.min.ts",
      format: "umd",
      name,
    },
    env: "production",
  }),
  createConfig({
    input: "src/umbrella.stickybits.js",
    output: {
      file: "dist/umbrella.stickybits.js",
      format: "umd",
      name,
    },
  }),
  createConfig({
    input: "src/jquery.stickybits.js",
    output: {
      file: "dist/jquery.stickybits.js",
      format: "umd",
      name,
    },
  }),
];

export default configs;
