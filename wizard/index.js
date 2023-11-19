import fs from "fs";
import esbuild from "esbuild";
import inquirer from "inquirer";
import { readFileAsync, deleteFileAsync } from "./fsOperation.js";
import sendSourceMap from "./sendSourceMap.js";

const wizard = async () => {
  try {
    const mainQuestion = [
      {
        type: "confirm",
        name: "continue",
        message: "Do you want to upload source map file?",
        default: false,
      },
    ];

    const mainAns = await inquirer.prompt(mainQuestion);
    if (!mainAns.continue) {
      console.log("Exiting the program, see you again!");
      process.exit();
    }

    const subQuestions = [
      {
        type: "input",
        name: "path",
        message: "Please enter the path of the entry file",
        validate: (input) => {
          if (!fs.existsSync(input)) {
            return "no a valid path";
          }

          const pathArr = input.split(".");
          const fileExtension = pathArr[pathArr.length - 1];

          if (fileExtension !== "js") {
            return "not a valid file";
          }

          return true;
        },
      },
      {
        type: "input",
        name: "userKey",
        message: "Please enter your user key",
        validate: (input) => {
          if (input === "") {
            return "user key can't be empty";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "clientToken",
        message: "Please enter your client token for your project",
        validate: (input) => {
          if (input === "") {
            return "client token can't be empty";
          }
          return true;
        },
      },
    ];
    const subAns = await inquirer.prompt(subQuestions);
    const { path, userKey, clientToken } = subAns;
    console.log("generating source map file...");
    await esbuild.build({
      entryPoints: [path],
      bundle: true,
      sourcemap: true,
      format: "esm",
      platform: "node",
      outfile: "./bundle.js",
    });
    console.log("uploading source map file...");

    const map = await readFileAsync("./bundle.js.map");

    const result = await sendSourceMap(map, userKey, clientToken);
    // await deleteFileAsync("./bundle.js");
    // await deleteFileAsync("./bundle.js.map");
    console.log(result.data);
  } catch (err) {
    console.error(err.message);
    process.exit();
  }
};

await wizard();
