import React, { useState, useCallback, useRef } from "react";
import { useAlert } from "react-alert";

import SourceParser from "./SourceParser";
import { Input, Heading, Container, Button } from "./styles";

export default () => {
  const [path, setPath] = useState("");
  const [branch, setBranch] = useState("");
  const [result, setResult] = useState("gsw");
  const alert = useAlert();

  const commandRef = useRef(null);

  const trimPath = useCallback(str => {
    str.replace(/ /g, "");
    if (str[0] === "/") return str.substr(1);
    return str;
  }, []);

  const extractSpecPath = useCallback(str => {
    return `${str.slice(0, -3)}Spec.js`;
  }, []);

  const generateCommand = useCallback(() => {
    const trimmedPath = trimPath(path);
    const specPath = extractSpecPath(trimmedPath);
    const newResult = `gsw rem-${branch} ./src/main/resources/com/beckon/${trimmedPath} ./src/test/javascript/unit/${specPath} ./target/coverage-report/${trimmedPath}.html`;
    setResult(newResult);

    navigator.permissions.query({ name: "clipboard-write" }).then(result => {
      if (result.state == "granted" || result.state == "prompt") {
        /* write to the clipboard now */
        navigator.clipboard.writeText(newResult).then(
          function() {
            /* clipboard successfully set */
            alert.success("Copied to clipboard");
          },
          function() {
            /* clipboard write failed */
            alert.error("Some error. Try again!");
          }
        );
      }
    });
  }, [path, branch]);

  return (
    <Container>
      <Heading>Mini Automation Tools</Heading>
      <Input
        onChange={e => setPath(e.target.value)}
        placeholder="Enter your path here"
      />
      <Input
        onChange={e => setBranch(e.target.value)}
        placeholder="Enter your branch here"
      />
      <Button onClick={generateCommand}>Generate Command And Copy</Button>

      <br />
      <div ref={commandRef}>{result}</div>
      <SourceParser />
    </Container>
  );
};
