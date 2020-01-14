export const removeComments = str =>
  str.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "");

export const removeAllLineBreaks = src => src.replace(/(\r\n|\n|\r)/gm, "");

export const removeAllSpaces = src => src.replace(/\s/g, "");

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
            case ")": {
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

export const getModule = src =>
  src
    .split(".module")[1]
    .split('",')[0]
    .substring(2);

export const getVariableDefinitions = deps =>
  deps.reduce((acc, val) => acc + `let ${val}; `, "");

export const getStubs = (deps, src) =>
  deps.reduce((acc, val) => {
    const instancesFound = src.split(`${val}`);
    if (instancesFound.length <= 1)
      return acc + `${val} = jasmine.createSpy(); `;
    return acc + extractDependencies(instancesFound.slice(2), val);
  }, "");

export const getProviders = deps =>
  deps.reduce((acc, val) => {
    return acc + `$provide.value("${val}", ${val}); `;
  }, "");

// Directive

export const getDirectiveDependencies = src =>
  src
    .split("controller:")[1]
    .split("function(")[1]
    .split(")")[0]
    .split(",")
    .map(str => str.trim())
    .filter(str => str !== "$scope");

export const getDirectiveName = src =>
  src
    .split(".directive")[1]
    .split(`",`)[0]
    .substring(2);

// Controller

export const getControllerName = src =>
  src
    .split(".controller")[1]
    .split(`",`)[0]
    .substring(2);

export const getControllerDependencies = src =>
  src
    .split("controller(")[1]
    .split("function(")[1]
    .split(")")[0]
    .split(",")
    .map(str => str.trim())
    .filter(str => str !== "$scope" && str !== "$controller");

export const getControllerSnippet = params => {
  return `
  /**
   * Generated at https://ashwanth1109.github.io/tool-script/
   */
  describe("${params.name}", () => {
      // variable definition
      let $controller;
      let $rootScope;
      let $scope;
      let controller;
      ${params.variableDefinitions}
  
      beforeEach(() => {
          // mock module
          module("${params.module}");
  
          // provider
          module(($provide) => {
              // stub dependencies
              ${params.stubs}
              
              // supply provider values
              ${params.providers}
          });
          
          // inject
          inject((_$controller_, _$rootScope_) => {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new(true);
        })
      });
  
      describe("Initialization", () => {
          it("should", () => {
              // Act
              controller = $controller("", { $scope });
              
              // Assert
              expect(controller).toBeDefined();
          });
      });
  });
  `;
};

export const copyToClipboard = (str, onSuccess, onError) => {
  navigator.permissions.query({ name: "clipboard-write" }).then(result => {
    if (result.state == "granted" || result.state == "prompt") {
      /* write to the clipboard now */
      navigator.clipboard.writeText(str).then(
        function() {
          /* clipboard successfully set */
          // alert.success("Copied to clipboard");
          onSuccess();
        },
        function() {
          /* clipboard write failed */
          // alert.error("Some error. Try again!");
          onError();
        }
      );
    }
  });
};

export const removeMultiSpaces = str => str.replace(/\s+/g, " ");
