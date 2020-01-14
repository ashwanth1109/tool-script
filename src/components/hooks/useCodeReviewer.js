import {
  removeComments,
  removeAllLineBreaks,
  removeMultiSpaces
} from "../utils";

class Describe {
  constructor(name) {
    this.name = name;
    this.tests = [];
    this.subtests = [];
    this.parent = null;
    this.curly = 0;
  }

  addTest(test) {
    this.tests.push(test);
  }

  addSubtest(subtest) {
    this.subtests.push(subtest);
  }
}

const unwrapDescribeStatements = src => {
  // Identify describe block
  let currentLevel = null;
  let test = null;
  while (src.length > 0) {
    if (src[0] === "d") {
      if (src.slice(0, 8) === "describe") {
        src = src.slice(10);
        const name = src.slice(0, src.indexOf(`"`));
        src = src.slice(src.indexOf(`"`));
        src = src.slice(src.indexOf(`{`) + 1);
        const describe = new Describe(name);
        if (test === null) {
          test = describe;
          currentLevel = test;
        } else {
          currentLevel.addSubtest(describe);
          describe.parent = currentLevel;
          currentLevel = describe;
        }
        currentLevel.curly += 1;
      }
    }
    if (src[0] === "i") {
      if (src.slice(0, 4) === 'it("') {
        src = src.slice(4);
        const name = src.slice(0, src.indexOf(`"`));
        src = src.slice(src.indexOf(`"`));
        src = src.slice(src.indexOf(`{`) + 1);
        currentLevel.addTest(name);
        currentLevel.curly += 1;
      }
    }
    if (currentLevel && src[0] === "{") currentLevel.curly += 1;
    if (currentLevel && src[0] === "}") currentLevel.curly -= 1;
    if (currentLevel && currentLevel.curly === 0)
      currentLevel = currentLevel.parent;
    src = src.slice(1);
  }
  return test;
};

const useCodeReviewer = source => {
  let src = removeMultiSpaces(removeAllLineBreaks(removeComments(source)));
  // This flag can later be used for checking multiple IQBs
  let passesAllChecks = true;
  return unwrapDescribeStatements(src);
};

export default useCodeReviewer;
