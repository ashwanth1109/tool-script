export const removeComments = str =>
  str.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "");

export const extractDependencies = (arr, val) => {
  let dependencyArr = [];
  arr.map(item => {
    const word = item.split(" ")[0];
    const separator = word[0];
    // dep is a function
    if (separator === "(") return `${val} = jasmine.createSpy(); `;
    else if (separator === ".") {
      let dependency = "";
      word
        .substr(1)
        .split("")
        .every(c => {
          switch (c) {
            case "(": {
              if (!dependencyArr.includes(dependency))
                dependencyArr.push(dependency);
              return false;
            }
            case ".": {
              if (!dependencyArr.includes(dependency))
                dependencyArr.push(dependency);
              return false;
            }
            case ",": {
              if (!dependencyArr.includes(dependency))
                dependencyArr.push(dependency);
              return false;
            }
            default: {
              dependency += c;
              return true;
            }
          }
        });
    }
  });
  if (dependencyArr.length) {
    let tempString = "";
    for (const item of dependencyArr) {
      tempString += `${item}: jasmine.createSpy(), `;
    }
    return `${val} = {${tempString}}; `;
  }
  return `${val} = jasmine.createSpy(); `;
};
