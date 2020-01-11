import React, { useState, useCallback, useEffect } from "react";
import {
  ParserContainer,
  ParserInput,
  ButtonColumn,
  MiniButton,
  ParserDisplay
} from "./styles";
import { removeComments, extractDependencies } from "./utils";

const SourceParser = () => {
  const [display, setDisplay] = useState("");
  const [source, setSource] = useState("");
  const [params, setParams] = useState({
    module: "",
    name: "",
    dependencies: [],
    variableDefinitions: "",
    stubs: "",
    providers: ""
  });
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
        providers
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
      setParams({ module, name, variableDefinitions, stubs, providers });
    }
  }, [source]);

  useEffect(() => {
    if (params.module) {
      setDisplay(serviceSnippet);
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
      </ButtonColumn>
      <ParserDisplay>{display}</ParserDisplay>
    </ParserContainer>
  );
};

export default SourceParser;
