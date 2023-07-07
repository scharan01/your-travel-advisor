import styled from "styled-components";
import Result from "./Result";
import { Slider } from "@mui/material";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  width: 45%;
`;

const Hr = styled.hr`
  width: 90%;
  margin-left: 15px;
  color: red;
`;

const SliderContainer = styled.div`
  padding: 10px;
  width: 170px;
  background-color: #f8f8ff;
  border-radius: 5px;
  margin-left: 15px;
`;

const Text = styled.p`
  font-size: 14px;
`;

const TextContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 2px;
  width: 90%;
`;

const Results = ({ data, filter, radius, setRadius }) => {
  return (
    <Container>
      <SliderContainer>
        <TextContainer>
          <Text>Distance</Text>
          <Text>{radius} KM</Text>
        </TextContainer>

        <Slider
          aria-label="Custom marks"
          defaultValue={5}
          step={1}
          min={1}
          max={5}
          onChange={(e) => setRadius(e.target.value)}
          sx={{
            width: 150,
            color: "#228B22",
            marginLeft: "5px",
            "& .MuiSlider-thumb": {
              width: "5px",
              borderRadius: "1px",
              color: "#0096FF",
            },
          }}
        />
      </SliderContainer>
      {data.map((dat, i) => {
        return (
          <>
            <Result key={i} data={dat} index={i + 1} filter={filter} />{" "}
            <Hr></Hr>
          </>
        );
      })}
    </Container>
  );
};

export default Results;
