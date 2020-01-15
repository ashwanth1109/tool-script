import React, { useState } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import { DescribeTest } from "./styles";

const TestItem = ({ test }) => {
  const [checked, setChecked] = useState(false);
  return (
    <DescribeTest isChecked={checked}>
      <Checkbox value={checked} onChange={e => setChecked(e.target.checked)} />
      {test}
    </DescribeTest>
  );
};

export default TestItem;
