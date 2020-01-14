import React, { useState, useCallback, useEffect, Fragment } from "react";
import { useAlert } from "react-alert";

import DescribeBlock from "./DescribeBlock";
import useCodeReviewer from "./hooks/useCodeReviewer";
import {
  ParserContainer,
  ParserInput,
  ButtonColumn,
  MiniButton,
  ParserDisplay,
  ModalDisplay,
  Heading,
  MagicString
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
  copyToClipboard,
  getDirectiveName,
  getDirectiveDependencies,
  removeAllLineBreaks,
  removeAllSpaces
} from "./utils";

const SourceParser = () => {
  const [display, setDisplay] = useState("");
  const [modalDisplay, setModalDisplay] = useState({
    show: false,
    testNesting: {},
    magicStrings: null,
    forbiddenKeywords: null,
    globalDeclarations: null
  });
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
      const cleanSource = removeAllSpaces(
        removeAllLineBreaks(sourceWithoutComments)
      );
      const module = getModule(cleanSource);
      const name = getDirectiveName(cleanSource);
      const dependencies = getDirectiveDependencies(cleanSource);
      const variableDefinitions = getVariableDefinitions(dependencies);
      const stubs = getStubs(dependencies, cleanSource);
      const providers = getProviders(dependencies);
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

  const runCodeReviewer = useCallback(() => {
    const {
      testNesting,
      magicStrings,
      forbiddenKeywords,
      globalDeclarations
    } = useCodeReviewer(source);

    setModalDisplay({
      testNesting,
      show: true,
      magicStrings,
      forbiddenKeywords,
      globalDeclarations
    });
  }, [source]);

  return (
    <>
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
          <MiniButton onClick={generateController}>
            Controller Snippet
          </MiniButton>
          <MiniButton onClick={runCodeReviewer}>Review Code</MiniButton>
        </ButtonColumn>
        <ParserDisplay>{display}</ParserDisplay>
      </ParserContainer>
      {modalDisplay.show && (
        <ModalDisplay>
          <Heading>Describe Block Nesting</Heading>
          <DescribeBlock
            name={modalDisplay.testNesting.name}
            tests={modalDisplay.testNesting.tests}
            subtests={modalDisplay.testNesting.subtests}
          />

          <Heading>Magic Strings</Heading>
          {modalDisplay.magicStrings.length > 0 &&
            modalDisplay.magicStrings.map(str => {
              if (str) {
                const parts = str.split(`"`);
                console.log("parts", parts);
                return (
                  <MagicString key={str}>
                    {parts.map((part, id) => {
                      if (id % 2 === 0)
                        return <Fragment key={id}>{part}</Fragment>;
                      return <span key={id}>"{part}"</span>;
                    })}
                  </MagicString>
                );
              }
            })}

          <Heading>
            Possible List of Forbidden Keywords:{" "}
            {modalDisplay.forbiddenKeywords.length === 0 ? "None" : ""}
          </Heading>
          {modalDisplay.forbiddenKeywords.length > 0 &&
            modalDisplay.forbiddenKeywords.map(str => (
              <MagicString>{str}</MagicString>
            ))}

          <Heading>Global Declarations (if any):</Heading>
          {modalDisplay.globalDeclarations.length > 0 &&
            modalDisplay.globalDeclarations.map(str => (
              <MagicString>{str}</MagicString>
            ))}
        </ModalDisplay>
      )}
    </>
  );
};

export default SourceParser;
