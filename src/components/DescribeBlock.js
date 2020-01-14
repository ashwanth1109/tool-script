import React from "react";

import {
  DescribeContainer,
  DescribeName,
  DescribeTests,
  DescribeTest
} from "./styles";

const DescribeBlock = ({ name, tests, subtests }) => {
  let children = null;

  if (subtests && subtests.length) {
    children = (
      <div>
        {subtests.map((desBlock, id) => (
          <DescribeBlock
            name={desBlock.name}
            subtests={desBlock.subtests}
            tests={desBlock.tests}
            key={desBlock.name}
          />
        ))}
      </div>
    );
  }
  return (
    <DescribeContainer>
      <DescribeName>{name}</DescribeName>
      <DescribeTests>
        {tests.map(test => (
          <DescribeTest>{test}</DescribeTest>
        ))}
      </DescribeTests>
      {children}
    </DescribeContainer>
  );
};

export default DescribeBlock;
