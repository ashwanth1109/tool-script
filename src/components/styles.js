import styled from "styled-components";

export const Container = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Heading = styled.h1`
  color: #4285f4;
`;

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
  display: flex;
  flex-direction: column;
`;
export const MiniButton = styled.button`
  margin-bottom: 8px;
`;
export const ParserDisplay = styled.div`
  border: 1px solid #3185fc;
  flex: 1;
  white-space: pre-line;
  overflow-y: auto;
`;

export const ModalDisplay = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  overflow-y: auto;
  box-shadow: 0 5px 11px 0 rgba(0, 0, 0, 0.18), 0 4px 15px 0 rgba(0, 0, 0, 0.15);
  background: white;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 16px;
`;

export const DescribeContainer = styled.div`
  border-left: 1px solid #3185fc;
  padding-left: 24px;
`;
export const DescribeName = styled.div`
  color: #3185fc;
  font-size: 1.4rem;
`;
export const DescribeTests = styled.div``;

export const DescribeTest = styled.div`
  text-decoration: ${props => (props.isChecked ? "line-through" : "")};
`;

export const MagicString = styled.div`
  font-weight: semi-bold;
  > span {
    font-weight: bold;
    color: #00a878;
  }
`;

export const Text = styled.div`
  font-weight: semi-bold;
`;
