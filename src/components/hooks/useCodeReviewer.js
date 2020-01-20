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
  let redFindings = [];

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
        } else if (src.slice(0, 2) === "==" && src.slice(0, 3) === "===") {
          redFindings.push({ statement, type: "Loose Inequality Check" });
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
      case "`": {
        redFindings.push({ statement, type: "Backtick Unbalanced" });
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
        } else if (src.slice(0, 8) === "debugger") {
          redFindings.push({ statement, type: "Debugger Statement" });
        }
        break;
      }
      case "h": {
        if (src.slice(0, 14) === "hasOwnProperty") {
          redFindings.push({ statement, type: "hasOwnProperty" });
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
        } else if (src.slice(0, 7) === "indexOf") {
          redFindings.push({ statement, type: "indexOf" });
        }
        break;
      }
      case "f": {
        if (
          src.slice(0, 9) === "fdescribe" ||
          src.slice(0, 3) === "fit" ||
          src.slice(0, 5) === "for (" ||
          src.slice(0, 8) === "forEach(" ||
          src.slice(0, 8) === "for each"
        ) {
          if (!forbiddenKeywords.includes(statement)) {
            forbiddenKeywords.push(statement);
          }
        } else if (src.slice(0, 6) === "filter") {
          redFindings.push({ statement, type: "filter" });
        } else if (src.slice(0, 4) === "findIndexOf") {
          redFindings.push({ statement, type: "findIndexOf" });
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
        } else if (src.slice(0, 6) === "assign") {
          redFindings.push({ statement, type: "assign" });
        } else if (src.slice(0, 5) === "await") {
          redFindings.push({ statement, type: "await" });
        }
        break;
      }
      case "s": {
        if (src.slice(0, 6) === "switch") {
          if (!forbiddenKeywords.includes(statement)) {
            forbiddenKeywords.push(statement);
          }
        } else if (src.slice(0, 6) === "splice") {
          redFindings.push({ statement, type: "splice" });
        } else if (src.slice(0, 10) === "setTimeout") {
          redFindings.push({ statement, type: "setTimeout" });
        } else if (src.slice(0, 11) === "setInterval") {
          redFindings.push({ statement, type: "setInterval" });
        }
        break;
      }
      case "l": {
        if (src.slice(0, 3) === "let") {
          if (statement.indexOf("=") !== -1) {
            redFindings.push({ statement, type: "let and =" });
          }
        }
      }
      case "m": {
        if (src.slice(0, 3) === "map") {
          if (!forbiddenKeywords.includes(statement)) {
            forbiddenKeywords.push(statement);
          }
        }
        break;
      }
      case "n": {
        if (src.slice(0, 3) === "new") {
          redFindings.push({ statement, type: "new" });
        }
        break;
      }
      case "c": {
        if (src.slice(0, 5) === "clock") {
          if (!forbiddenKeywords.includes(statement)) {
            forbiddenKeywords.push(statement);
          }
        }
        break;
      }
      case "t": {
        if (src.slice(0, 5) === "throw") {
          redFindings.push({ statement, type: "throw" });
        }
        break;
      }
      case "v": {
        if (src.slice(0, 3) === "var") {
          redFindings.push({ statement, type: "var" });
        }
      }
      case "w": {
        if (src.slice(0, 7) === "window.") {
          globalDeclarations.push(statement);
        }
        break;
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
    redFindings,
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
