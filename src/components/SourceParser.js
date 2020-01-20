import React, { useState, useCallback, useEffect } from "react";
import { useAlert } from "react-alert";

import useCodeReviewer from "./hooks/useCodeReviewer";
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
  copyToClipboard,
  getDirectiveName,
  getDirectiveDependencies,
  removeAllLineBreaks,
  removeAllSpaces,
  getServiceDependencies,
  getFactoryDependencies
} from "./utils";
import ReviewComponent from "./ReviewComponent";

const SourceParser = () => {
  const [display, setDisplay] = useState("");
  const [modalDisplay, setModalDisplay] = useState({
    show: false,
    testNesting: {},
    magicStrings: null,
    forbiddenKeywords: null,
    globalDeclarations: null,
    orphanStatements: null,
    statements: null
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
      const cleanSource = removeAllSpaces(
        removeAllLineBreaks(sourceWithoutComments)
      );
      const module = getModule(cleanSource);
      const name = getFactoryName(cleanSource);
      const dependencies = getFactoryDependencies(cleanSource);
      const variableDefinitions = getVariableDefinitions(dependencies);
      const stubs = getStubs(dependencies, cleanSource);
      const providers = getProviders(dependencies);
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
      const cleanSource = removeAllSpaces(
        removeAllLineBreaks(sourceWithoutComments)
      );
      const module = getModule(cleanSource);
      const name = getServiceName(cleanSource);
      const dependencies = getServiceDependencies(cleanSource);
      const variableDefinitions = getVariableDefinitions(dependencies);
      const stubs = getStubs(dependencies, cleanSource);
      const providers = getProviders(dependencies);
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
        copyToClipboard(
          serviceSnippet,
          () => {
            alert.success("Copied to clipboard");
          },
          () => {
            alert.error("Some error. Try again!");
          }
        );
        break;
      }
      case "directive": {
        setDisplay(directiveSnippet);
        copyToClipboard(
          directiveSnippet,
          () => {
            alert.success("Copied to clipboard");
          },
          () => {
            alert.error("Some error. Try again!");
          }
        );
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
      globalDeclarations,
      orphanStatements,
      statements
    } = useCodeReviewer(source);

    setModalDisplay({
      testNesting,
      show: true,
      magicStrings,
      forbiddenKeywords,
      globalDeclarations,
      orphanStatements,
      statements
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
      {modalDisplay.show && <ReviewComponent modalDisplay={modalDisplay} />}
    </>
  );
};

export default SourceParser;
