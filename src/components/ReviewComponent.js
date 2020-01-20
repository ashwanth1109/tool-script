import React, { Fragment } from "react";

import DescribeBlock from "./DescribeBlock";
import { ModalDisplay, Heading, MagicString, Text } from "./styles";

const ReviewComponent = ({ modalDisplay }) => {
  return (
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
            return (
              <MagicString key={str}>
                {parts.map((part, id) => {
                  if (id % 2 === 0) return <Fragment key={id}>{part}</Fragment>;
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

      <Heading>Orphan Statements (needs some more filtering):</Heading>
      {modalDisplay.orphanStatements.length > 0 &&
        modalDisplay.orphanStatements.map(str => (
          <>
            <Text>{str}</Text>
            <br />
          </>
        ))}

      <Heading>
        Statements (temporary section for measuring tool accuracy): Remove Later
      </Heading>
      {modalDisplay.statements.length > 0 &&
        modalDisplay.statements.map(st => (
          <>
            <Text>{st}</Text>
            <br />
          </>
        ))}
    </ModalDisplay>
  );
};

export default ReviewComponent;
