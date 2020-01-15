import React, { useState, useCallback } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import {
  DescribeContainer,
  DescribeName,
  DescribeTests,
  DescribeTest
} from "./styles";
import TestItem from "./TestItem";

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
        {tests.map((test, id) => (
          <TestItem test={test} key={test} />
        ))}
      </DescribeTests>
      {children}
    </DescribeContainer>
  );
};

export default DescribeBlock;
