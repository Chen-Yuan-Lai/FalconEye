import fs from "fs";

const readFileAsync = (path) => {
  const promise = new Promise((resolve, reject) => {
    fs.readFile(path, "utf-8", (err, data) => {
      if (err) {
        reject(err);
      }

      resolve(data);
    });
  });

  return promise;
};

const deleteFileAsync = (path) => {
  const promise = new Promise((resolve, reject) => {
    fs.unlink(path, (err) => {
      if (err) {
        reject(err);
      }

      resolve("delete the file successfully!");
    });
  });

  return promise;
};

export { readFileAsync, deleteFileAsync };
