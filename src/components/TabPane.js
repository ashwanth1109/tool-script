import React, { useState } from "react";
import styled from "styled-components";

const PaneContainer = styled.div`
  margin-top: 8px;
  display: flex;
  margin-bottom: 32px;
`;

const PaneTab = styled.div`
  cursor: pointer;
  font-size: 1.4rem;
  color: ${props => (props.isSelected ? "#3185fc" : "#e5e6e4")};
  border-bottom: 5px solid
    ${props => (props.isSelected ? "#3185fc" : "#e5e6e4")};
  margin-right: 16px;
  padding-bottom: 4px;
`;

export default ({ tabs, selected, setSelected }) => {
  return (
    <PaneContainer>
      {tabs.map((tab, id) => (
        <PaneTab
          key={id}
          isSelected={selected === id}
          onClick={() => setSelected(id)}
        >
          {tab}
        </PaneTab>
      ))}
    </PaneContainer>
  );
};
