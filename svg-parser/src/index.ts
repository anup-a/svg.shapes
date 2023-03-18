import fs from "fs";
import path from "path";
import { parse } from "svg-parser";
import { optimize } from "svgo";
import crypto from "crypto";

const SVG_FILES_PATH = path.join(__dirname, "./../factory/input/");
const SVG_OUTPUT_PATH = path.join(__dirname, "./../factory/output/svg.json");

const files = fs.readdirSync(SVG_FILES_PATH);
const outputFile = fs.openSync(SVG_OUTPUT_PATH, "w+");
const content = fs.readFileSync(outputFile);

let svgDataArray = {};
if (content.toString().length > 0) {
  svgDataArray = JSON.parse(content.toString());
}

let hasUpdate = false;

files.forEach((file) => {
  const data = fs.readFileSync(SVG_FILES_PATH + file, "utf8");
  if (!svgDataArray.hasOwnProperty(file)) {
    const result = optimize(data, {
      multipass: true,
      plugins: [
        {
          name: "preset-default",
          params: {
            overrides: {
              removeViewBox: false,
              cleanupIds: false,
              convertShapeToPath: {
                convertArcs: true,
              },
            },
          },
        },
      ],
    });
    svgDataArray[file] = result.data;
    // svgDataArray[file] = data;
    hasUpdate = true;
  }
});

hasUpdate &&
  fs.write(
    outputFile,
    JSON.stringify(svgDataArray, null, 2),
    (err, written, number) => {}
  );
