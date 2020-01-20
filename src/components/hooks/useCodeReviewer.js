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
  let statement = null;
  let magicStrings = [];
  let forbiddenKeywords = [];
  let globalDeclarations = [];
  let statements = [];
  let orphanStatements = [];

  const statementChecks = (sliceVal = 1) => {
    const next = src.slice(sliceVal);
    // console.log("next", next);
    statement = next.slice(0, next.indexOf(";") + 1);
    if (
      statement.indexOf("=") === -1 &&
      statement.indexOf("let") === -1 &&
      statement.indexOf("})") === -1
    ) {
      orphanStatements.push(statement);
    }
    statements.push(statement);
  };

  while (src.length > 0) {
    switch (src[0]) {
      case "{": {
        currentLevel.curly += 1;
        break;
      }
      case "}": {
        currentLevel.curly -= 1;
        break;
      }
      case "=": {
        if (src[1] === ">") {
          statementChecks(2);
        }
        break;
      }
      case ";": {
        statementChecks();
        break;
      }
      case '"': {
        if (!magicStrings.includes(statement)) {
          magicStrings.push(statement);
        }
        break;
      }
      case "d": {
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
          statementChecks();
        }
        break;
      }
      case "i": {
        if (src.slice(0, 4) === 'it("') {
          src = src.slice(4);
          const name = src.slice(0, src.indexOf(`"`));
          src = src.slice(src.indexOf(`"`));
          src = src.slice(src.indexOf(`{`) + 1);
          currentLevel.addTest(name);
          currentLevel.curly += 1;
          statementChecks();
        } else if (src.slice(0, 4) === "if (") {
          if (!forbiddenKeywords.includes(statement)) {
            forbiddenKeywords.push(statement);
          }
        }
        break;
      }
      case "f": {
        if (
          src.slice(0, 9) === "fdescribe" ||
          src.slice(0, 3) === "fit" ||
          src.slice(0, 5) === "for (" ||
          src.slice(0, 8) === "forEach("
        ) {
          if (!forbiddenKeywords.includes(statement)) {
            forbiddenKeywords.push(statement);
          }
        }
        break;
      }
      case "x": {
        if (src.slice(0, 9) === "xdescribe" || src.slice(0, 3) === "xit") {
          if (!forbiddenKeywords.includes(statement)) {
            forbiddenKeywords.push(statement);
          }
        }
        break;
      }
      case "a": {
        if (src.slice(0, 3) === "any") {
          if (!forbiddenKeywords.includes(statement)) {
            forbiddenKeywords.push(statement);
          }
        }
        break;
      }
      case "s": {
        if (src.slice(0, 6) === "switch") {
          if (!forbiddenKeywords.includes(statement)) {
            forbiddenKeywords.push(statement);
          }
        }
        break;
      }
      case "m": {
        if (src.slice(0, 3) === "map") {
          if (!forbiddenKeywords.includes(statement)) {
            forbiddenKeywords.push(statement);
          }
        }
        break;
      }
      case "c": {
        if (src.slice(0, 5) === "clock") {
          if (!forbiddenKeywords.includes(statement)) {
            forbiddenKeywords.push(statement);
          }
        }
      }
      case "w": {
        if (src.slice(0, 7) === "window.") {
          globalDeclarations.push(statement);
        }
      }
      default:
        break;
    }

    if (currentLevel && currentLevel.curly === 0) {
      currentLevel = currentLevel.parent;
    }
    src = src.slice(1);
  }
  return {
    testNesting: test,
    magicStrings,
    forbiddenKeywords,
    globalDeclarations,
    orphanStatements,
    statements
  };
};

const useCodeReviewer = source => {
  let src = removeMultiSpaces(removeAllLineBreaks(removeComments(source)));
  // This flag can later be used for checking multiple IQBs
  let passesAllChecks = true;
  return unwrapDescribeStatements(src);
};

export default useCodeReviewer;
