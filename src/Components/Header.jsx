import { React, forwardRef } from "react";
import { styled } from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";

const Container = styled.div`
  margin: auto;
  padding: 10px;
  display: flex;
  align-items: center;
  width: 90%;
  justify-content: space-between;
`;

const Date = styled.button`
  width: 130px;
  height: 35px;
  border: 1.5px solid black;
  border-radius: 20px;
  font-weight: 700;
  padding: 7px;
  margin-left: 3px;
  background-color: white;
  cursor: pointer;
  font-size: 13px;
`;

const Calender = styled.div`
  visibility: ${(props) => (props.value === "Hotels" ? "visible" : "hidden")};
`;

const SearchBar = styled.input`
  width: 500px;
  height: 25px;
  border: none;
  outline: none;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  width: 500px;
  height: 25px;
  border: 1.5px solid black;
  border-radius: 20px;
  padding: 8px;
  box-shadow: 0 2px 4px 1px rgba(0, 0, 0, 0.2);
`;

const Filter = styled.div`
  display: flex;
  align-items: center;
`;

const FilterText = styled.p`
  padding: 5px;
  width: 50px;
  height: 20px;
  border: 1.5px solid black;
  border-radius: 20px;
  font-size: 15px;
  text-align: center;
  margin-right: 5px;
`;

const Selection = styled.select`
  padding: 5px;
  width: 140px;
  height: 32px;
  border: 2px solid black;
  border-radius: 20px;
  font-weight: 500;
  cursor: pointer;
`;

const Option = styled.option``;

const Header = ({
  setLocation,
  setFilter,
  setCenter,
  setLoaded,
  setLocationFound,
  setError,
  setDate,
}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedValue, setSelectedValue] = useState("");
  const [searchText, setSearchText] = useState("");

  const apikey = "API_KEY";

  const handleDropdownChange = (event) => {
    setSelectedValue(event.target.value);
    setFilter(event.target.value);
  };

  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <Date onClick={onClick} ref={ref}>
      {value ? value : "Enter dates"}
    </Date>
  ));

  const handleSearch = (e) => {
    if (e.key === "Enter") setSearchText(e.target.value.toLowerCase());
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://travel-advisor.p.rapidapi.com/locations/search",
          {
            params: {
              query: `${searchText}`,
              limit: "30",
              offset: "0",
              units: "km",
              location_id: "1",
              currency: "USD",
              sort: "relevance",
              lang: "en_US",
            },
            headers: {
              "X-RapidAPI-Key": `${apikey}`,
              "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
            },
          }
        );
        if (!response.data.data.length) {
          setLocation("");
          setLocationFound(false);
        } else {
          setLocation(response.data.data[0].result_object.location_id);
          setLocationFound(true);
        }

        setCenter({
          lat: Number(response.data.data[0].result_object.latitude),
          lng: Number(response.data.data[0].result_object.longitude),
        });
      } catch (error) {}
    };

    if (searchText !== "") fetchData();
  }, [searchText]);

  useEffect(() => {
    setError(false);
    setLoaded(false);
    setDate("");
  }, [searchText]);

  /*useEffect(() => {
    const convertDate = (date) => {
      const ndate = new Date(date);
      const year = ndate.getFullYear();
      const month = String(ndate.getMonth() + 1).padStart(2, "0");
      const day = String(ndate.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      setDate(formattedDate);
      console.log(formattedDate);
    };
    convertDate();
  }, [selectedDate]);*/

  return (
    <Container>
      <Calender value={selectedValue}>
        <DatePicker
          showIcon
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="dd/MM/yyyy"
          customInput={<CustomInput />}
        />
      </Calender>
      <SearchContainer>
        <SearchIcon />
        <SearchBar placeholder="Where to?" onKeyDown={(e) => handleSearch(e)} />
      </SearchContainer>

      <Filter>
        <FilterText>Filters</FilterText>

        <Selection value={selectedValue} onChange={handleDropdownChange}>
          <Option default value="Attractions">
            Attractions
          </Option>
          <Option value="Hotels">Hotels</Option>
          <Option value="Restaurants">Restaurants</Option>
        </Selection>
      </Filter>
    </Container>
  );
};

export default Header;
