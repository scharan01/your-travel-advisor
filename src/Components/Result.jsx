import React from "react";
import styled from "styled-components";
import { Rating } from "@mui/material";
import { styled as muiStyled } from "@mui/material/styles";
import CircleIcon from "@mui/icons-material/Circle";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";

const Container = styled.div`
  display: flex;
  height: 150px;
  padding: 10px;
  width: 100%;
`;

const Image = styled.img`
    border  1px solid black;
    border-radius : 5px;
    cursor : pointer;
    max-width : 35%;
    &:hover {
    opacity : .8; 
    }
`;

const InfoContainer = styled.div`
  margin-left: 15px;
  position: relative;
  bottom: 15px;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    text-decoration: underline !important;
  }
`;

const SubType = styled.p`
  font-size: 14px;
  color: gray;
  position: relative;
  bottom: 20px;
`;

const NumReviews = styled.p`
  font-size: 12px;
  color: gray;
  margin-left: 5px;
`;

const Neighborhood = styled.p`
  font-size: 14px;
  color: gray;
  position: relative;
  bottom: 20px;
`;

const StyledRating = muiStyled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#00af87",
  },
});

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  bottom: 20px;
`;

const Result = ({ data, index, filter }) => {
  return (
    <Container>
      <Image src={data?.photo?.images?.small.url} />
      <InfoContainer>
        <Title>
          {index}. {data.name}
        </Title>
        <RatingContainer>
          <StyledRating
            name="customized-color"
            value={data.rating}
            precision={0.5}
            icon={<CircleIcon fontSize="small" />}
            emptyIcon={<CircleOutlinedIcon fontSize="small" />}
            readOnly
          />
          <NumReviews> {data.num_reviews}</NumReviews>
        </RatingContainer>
        {filter === "Attractions" && (
          <SubType>
            {data?.subtype?.[0]?.name}{" "}
            {data?.subtype?.[1]?.name && <span>.</span>}{" "}
            {data?.subtype?.[1]?.name}
          </SubType>
        )}
        {filter === "Restaurants" && (
          <SubType>
            {data?.cuisine?.[0]?.name}{" "}
            {data?.cuisine?.[1]?.name && <span>.</span>}{" "}
            {data?.cuisine?.[1]?.name}
          </SubType>
        )}
        {filter === "Hotels" && (
          <SubType>
            {Number(data?.hotel_class)} star {data?.price && <span>.</span>}{" "}
            {data?.price}
          </SubType>
        )}
        <Neighborhood>
          {data.isclosed ? "Closed" : "Open now"}{" "}
          {data?.neighborhood_info?.[0]?.name && <span>.</span>}{" "}
          {data?.neighborhood_info?.[0]?.name}
        </Neighborhood>
      </InfoContainer>
    </Container>
  );
};

export default Result;
