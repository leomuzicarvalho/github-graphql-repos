import React, { useState, useEffect } from "react";
import {
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Typography,
  Box,
} from "@material-ui/core";
import { AppWrapper, StyledTable } from "./styled/components";
import { useQuery, gql } from "@apollo/client";
import base64 from "base-64";

const subject = "react";

const repoQuery = gql`
  query listRepos(
    $queryString: String!
    $itemsPerPage: Int!
    $before: String
    $after: String
  ) {
    rateLimit {
      cost
      remaining
      resetAt
    }
    search(
      query: $queryString
      type: REPOSITORY
      first: $itemsPerPage
      before: $before
      after: $after
    ) {
      repositoryCount
      pageInfo {
        endCursor
        startCursor
      }
      edges {
        node {
          ... on Repository {
            id
            name
            url
            forkCount
            stargazerCount
          }
        }
      }
    }
  }
`;

function App() {
  //States
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  //Effects
  useEffect(() => {
    refetch({
      itemsPerPage: itemsPerPage,
    });
  }, [itemsPerPage]);

  const { loading, error, data, refetch, previousData } = useQuery(repoQuery, {
    variables: {
      queryString: subject,
      itemsPerPage: 10,
      before: null,
      after: null,
    },
  });

  if (loading) return <p>Loading table...</p>;
  if (error) {
    console.log(error);
    return <p>Error! Check console for more information</p>;
  }
  if (data?.rateLimit?.remaining < 1000)
    return <p>Running out of API calls!</p>;

  const resultCount = data.search?.repositoryCount;
  const rows = data.search?.edges;
  const nextPage = data.search.pageInfo.endCursor;

  const handleFetch = async (toPage) => {
    const previousPage = base64.encode(
      "cursor:" +
        (
          parseInt(
            base64.decode(data?.search.pageInfo.startCursor).split(":")[1]
          ) - itemsPerPage
        ).toString()
    );

    toPage > page
      ? refetch({
          after: nextPage,
        })
      : refetch({
          before: previousPage,
          after: null,
        });

    setPage(toPage);
  };

  return (
    <AppWrapper
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      p={4}
    >
      <Box mb={5}>
        <Typography variant="h3" component="h1">
          My GitHub Repo Table :)
        </Typography>
      </Box>
      <StyledTable>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">🌟 Stars</TableCell>
            <TableCell align="right">🍴 Forks</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.node.id}>
              <TableCell component="th" scope="row">
                <a href={row.node.url}>{row.node.name}</a>
              </TableCell>
              <TableCell align="right">{row.node.stargazerCount}</TableCell>
              <TableCell align="right">{row.node.forkCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </StyledTable>
      <TablePagination
        style={{ color: "#d6d6d6" }}
        component="div"
        count={resultCount}
        page={page}
        onChangePage={(e: any, toPage: number) => {
          handleFetch(toPage);
        }}
        rowsPerPage={itemsPerPage}
        onChangeRowsPerPage={(e: any) => {
          setItemsPerPage(e.target.value);
        }}
      />
    </AppWrapper>
  );
}

export default App;
