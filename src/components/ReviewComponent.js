import React, { Fragment, useState, useCallback } from "react";

import DescribeBlock from "./DescribeBlock";
import { ModalDisplay, Heading, MagicString, Text, BlueText } from "./styles";
import TabPane from "./TabPane";

const ReviewComponent = ({ modalDisplay }) => {
  const [selected, setSelected] = useState(0);

  const renderTab = useCallback(() => {
    switch (selected) {
      case 0:
        return (
          <div>
            <Heading>Checks Passing</Heading>
          </div>
        );
      case 1:
        return (
          <>
            <DescribeBlock
              name={modalDisplay.testNesting.name}
              tests={modalDisplay.testNesting.tests}
              subtests={modalDisplay.testNesting.subtests}
            />
          </>
        );
      case 2:
        return (
          <>
            {modalDisplay.magicStrings.length > 0 &&
              modalDisplay.magicStrings.map(str => {
                if (str) {
                  const parts = str.split(`"`);
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
          </>
        );
      case 3:
        return (
          <>
            {modalDisplay.forbiddenKeywords.length > 0 &&
              modalDisplay.forbiddenKeywords.map(str => (
                <MagicString>{str}</MagicString>
              ))}
          </>
        );
      case 4:
        return (
          <>
            {modalDisplay.globalDeclarations.length > 0 &&
              modalDisplay.globalDeclarations.map(str => (
                <MagicString>{str}</MagicString>
              ))}
          </>
        );
      case 5:
        return (
          <>
            {modalDisplay.redFindings.length > 0 &&
              modalDisplay.redFindings.map(str => (
                <>
                  <BlueText>{str.type}</BlueText>
                  <Text>{str.statement}</Text>
                  <br />
                </>
              ))}
          </>
        );
      case 6:
        return (
          <>
            {modalDisplay.orphanStatements.length > 0 &&
              modalDisplay.orphanStatements.map(str => (
                <>
                  <Text>{str}</Text>
                  <br />
                </>
              ))}
          </>
        );
      default:
        return <div>Test</div>;
    }
  }, [selected]);

  return (
    <ModalDisplay>
      <TabPane
        tabs={[
          "Report",
          "Test Nesting",
          "Magic Strings",
          "Forbidden Keywords",
          "Global Declarations",
          "Red Findings",
          "Orphan Statements"
        ]}
        selected={selected}
        setSelected={setSelected}
      />

      {renderTab()}
    </ModalDisplay>
  );
};

export default ReviewComponent;
