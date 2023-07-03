import styled from "styled-components";
import Result from "./Result";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 45%;
`;

const Hr = styled.hr`
  width: 100%;
`;

const Results = ({ data, filter }) => {
  return (
    <Container>
      {data === "" ? (
        <h1>wait</h1>
      ) : (
        data.map((dat, i) => {
          return dat.name ? (
            <>
              <Result key={i} data={dat} index={i + 1} filter={filter} />{" "}
              <Hr></Hr>
            </>
          ) : null;
        })
      )}
    </Container>
  );
};

export default Results;
