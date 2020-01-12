import React, { useState, useCallback, useEffect } from "react";
import { useAlert } from "react-alert";

import {
  ParserContainer,
  ParserInput,
  ButtonColumn,
  MiniButton,
  ParserDisplay
} from "./styles";
import {
  removeComments,
  extractDependencies,
  getModule,
  getControllerName,
  getControllerDependencies,
  getVariableDefinitions,
  getStubs,
  getProviders,
  getControllerSnippet,
  copyToClipboard
} from "./utils";

const SourceParser = () => {
  const [display, setDisplay] = useState("");
  const [source, setSource] = useState("");
  const [params, setParams] = useState({
    module: "",
    name: "",
    dependencies: [],
    variableDefinitions: "",
    stubs: "",
    providers: "",
    type: ""
  });
  const alert = useAlert();
  const serviceSnippet = `
/**
 * Generated at https://ashwanth1109.github.io/tool-script/
 */
describe("${params.name}", () => {
    // variable definition
    let $service;
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
        inject((${params.name}) => {
            $service = ${params.name};
        });
    });

    describe("Initialization", () => {
        it("should", () => {
            // Arrange
            // Act
            // Assert
        });
    });
});
`;
  const directiveSnippet = `
/**
 * Generated at https://ashwanth1109.github.io/tool-script/
 */
describe("${params.name}", () => {
    // variable definition
    let $compile;
    let $rootScope;
    let $scope;
    let element;
    let scope;
    ${params.variableDefinitions}

    const getIsolatedScope = (elem) => elem.isolateScope() || elem.scope();


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
        inject((_$compile_, _$rootScope_) => {
          $compile = _$compile_;
          $rootScope = _$rootScope_;
          $scope = $rootScope.$new(true);
      })
    });

    describe("Initialization", () => {
        it("should", () => {
            // Arrange
            element = angular.element('');
            $compile(element)($scope);
            // Act
            $scope.$digest();
            scope = getIsolatedScope(element);
            // Assert
            expect(scope).toBeDefined();
        });
    });
});
`;
  const controllerSnippet = getControllerSnippet(params);

  const generateFactory = useCallback(() => {
    if (source) {
      const sourceWithoutComments = removeComments(source);
      const module = sourceWithoutComments
        .split(".module")[1]
        .split('",')[0]
        .substring(2);

      const name = sourceWithoutComments
        .split(".factory")[1]
        .split(`",`)[0]
        .substring(2);

      const dependencies = sourceWithoutComments
        .split(".factory")[1]
        .split("function(")[1]
        .split(") {")[0]
        .split(",")
        .map(str => str.trim());
      const variableDefinitions = dependencies.reduce(
        (acc, val) => acc + `let ${val}; `,
        ""
      );
      const stubs = dependencies.reduce((acc, val) => {
        const instancesFound = sourceWithoutComments.split(`${val}`);
        if (instancesFound.length <= 1)
          return acc + `${val} = jasmine.createSpy(); `;
        return acc + extractDependencies(instancesFound.slice(2), val);
      }, "");

      const providers = dependencies.reduce((acc, val) => {
        return acc + `$provide.value("${val}", ${val}); `;
      }, "");

      setParams({
        module,
        name,
        dependencies,
        variableDefinitions,
        stubs,
        providers,
        type: "service"
      });
    }
  }, [source]);

  const generateServiceClass = useCallback(() => {
    if (source) {
      const sourceWithoutComments = removeComments(source);
      const module = sourceWithoutComments
        .split(".module")[1]
        .split('",')[0]
        .substring(2);
      const name = sourceWithoutComments
        .split(".service")[1]
        .split(`",`)[0]
        .substring(2);
      const dependencies = sourceWithoutComments
        .split("constructor(")[1]
        .split(")")[0]
        .split(",")
        .map(str => str.trim());
      const variableDefinitions = dependencies.reduce(
        (acc, val) => acc + `let ${val}; `,
        ""
      );
      const stubs = dependencies.reduce((acc, val) => {
        const instancesFound = sourceWithoutComments.split(`${val}`);
        if (instancesFound.length <= 1)
          return acc + `${val} = jasmine.createSpy(); `;
        return acc + extractDependencies(instancesFound.slice(2), val);
      }, "");

      const providers = dependencies.reduce((acc, val) => {
        return acc + `$provide.value("${val}", ${val}); `;
      }, "");
      setParams({
        module,
        name,
        variableDefinitions,
        stubs,
        providers,
        type: "service"
      });
    }
  }, [source]);

  const generateDirective = useCallback(() => {
    if (source) {
      const sourceWithoutComments = removeComments(source);
      const module = sourceWithoutComments
        .split(".module")[1]
        .split('",')[0]
        .substring(2);
      const name = sourceWithoutComments
        .split(".directive")[1]
        .split(`",`)[0]
        .substring(2);
      const dependencies = sourceWithoutComments
        .split("controller:")[1]
        .split("function(")[1]
        .split(")")[0]
        .split(",")
        .map(str => str.trim())
        .filter(str => str !== "$scope");
      // console.log("dependencies", dependencies);
      const variableDefinitions = dependencies.reduce(
        (acc, val) => acc + `let ${val}; `,
        ""
      );
      const stubs = dependencies.reduce((acc, val) => {
        const instancesFound = sourceWithoutComments.split(`${val}`);
        if (instancesFound.length <= 1)
          return acc + `${val} = jasmine.createSpy(); `;
        return acc + extractDependencies(instancesFound.slice(2), val);
      }, "");

      const providers = dependencies.reduce((acc, val) => {
        return acc + `$provide.value("${val}", ${val}); `;
      }, "");
      setParams({
        module,
        name,
        variableDefinitions,
        stubs,
        providers,
        type: "directive"
      });
    }
  }, [source]);

  const generateController = useCallback(() => {
    if (source) {
      const sourceWithoutComments = removeComments(source);
      const module = getModule(sourceWithoutComments);
      const name = getControllerName(sourceWithoutComments);
      const dependencies = getControllerDependencies(sourceWithoutComments);
      const variableDefinitions = getVariableDefinitions(dependencies);
      const stubs = getStubs(dependencies, sourceWithoutComments);
      const providers = getProviders(dependencies);
      setParams({
        module,
        name,
        variableDefinitions,
        stubs,
        providers,
        type: "controller"
      });
    }
  }, [source]);

  useEffect(() => {
    switch (params.type) {
      case "service":
      case "factory": {
        setDisplay(serviceSnippet);
        break;
      }
      case "directive": {
        setDisplay(directiveSnippet);
        break;
      }
      case "controller": {
        setDisplay(controllerSnippet);
        copyToClipboard(
          controllerSnippet,
          () => {
            alert.success("Copied to clipboard");
          },
          () => {
            alert.error("Some error. Try again!");
          }
        );
      }
      default:
        break;
    }
  }, [params]);

  return (
    <ParserContainer>
      <ParserInput
        data-gramm_editor="false"
        spellCheck="false"
        onChange={e => setSource(e.target.value)}
      />
      <ButtonColumn>
        <MiniButton onClick={generateFactory}>Factory Snippet</MiniButton>
        <MiniButton onClick={generateServiceClass}>
          Service Class Snippet
        </MiniButton>
        <MiniButton onClick={generateDirective}>Directive Snippet</MiniButton>
        <MiniButton onClick={generateController}>Controller Snippet</MiniButton>
      </ButtonColumn>
      <ParserDisplay>{display}</ParserDisplay>
    </ParserContainer>
  );
};

export default SourceParser;
