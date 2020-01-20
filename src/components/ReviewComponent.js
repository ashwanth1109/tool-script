import React, { Fragment } from "react";

import DescribeBlock from "./DescribeBlock";
import { ModalDisplay, Heading, MagicString } from "./styles";

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
            console.log("parts", parts);
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
    </ModalDisplay>
  );
};

export default ReviewComponent;