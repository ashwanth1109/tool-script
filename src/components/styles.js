import styled from "styled-components";

export const Container = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Heading = styled.h1``;

export const Input = styled.input`
  padding: 16px;
  font-size: 1.6rem;
  width: 100%;
  margin-bottom: 16px;
`;

export const Button = styled.button`
  padding: 16px;
`;

export const ParserContainer = styled.div`
  width: 100%;
  height: 500px;
  margin-top: 16px;
  display: flex;
`;
export const ParserInput = styled.textarea`
  width: 500px;
  margin-right: 16px;
  resize: none;
  white-space: nowrap;
`;
export const ButtonColumn = styled.div`
  margin-right: 16px;
`;
export const MiniButton = styled.button``;
export const ParserDisplay = styled.div`
  border: 1px solid #3185fc;
  flex: 1;
  white-space: pre-line;
  overflow-y: auto;
`;
