import styled from "styled-components";
import { Box, Table } from "@material-ui/core";

export const AppWrapper = styled(Box)`
  background-color: #272727;
  color: #d6d6d6;
`;

export const StyledTable = styled(Table)`
  border-radius: 10px;
  background-color: #1d1d1d;
  th,
  tr,
  td {
    color: #d6d6d6;
  }
  a {
    text-decoration: none;
    color: #d1d16a;

    &:hover {
      opacity: 0.8;
    }
  }
`;
