import { React, forwardRef } from "react";
import { styled } from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import { getBoundsOfDistance } from "geolib";

const Container = styled.div`
  margin: auto;
  padding: 20px;
  margin: auto;
  display: flex;
  align-items: center;
  width: 80%;
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

const Dropdown = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 43px;
  background-color: white;
  width: 100%;
  border-radius: 10px;
  border: ${(props) => (props.value === "Show" ? "1px solid black" : "none")};
  max-height: 90vh;
  overflow: auto;
  z-index: 3;
`;

const Dropitem = styled.div`
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: lightgray;
  }
`;

const SearchMainContainer = styled.div`
  // display: flex;
  // flex-direction: column;
  position: relative;
`;

const Title = styled.p`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 2px;
`;

const SubTitle = styled.p`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 2px;
`;

const Header = ({ setLocation, setFilter, setCenter, setDate }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedValue, setSelectedValue] = useState("");
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);

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
    if (e.target.value.length >= 3) setSearchText(e.target.value.toLowerCase());
    else {
      setSearchText("");
      setSuggestions([]);
    }
  };

  const getBounds = (loc) => {
    try {
      const bounds = getBoundsOfDistance(
        { latitude: loc.latitude, longitude: loc.longitude },
        5000
      );
      return bounds;
    } catch (e) {}
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://travel-advisor.p.rapidapi.com/locations/v2/auto-complete",
          {
            params: {
              query: `${searchText}`,
              units: "km",
              lang: "en_US",
            },
            headers: {
              "X-RapidAPI-Key": `${apikey}`,
              "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
            },
          }
        );

        const filter_response =
          response?.data?.data?.Typeahead_autocomplete?.results.filter(
            (data) => data.detailsV2
          );

        const searchValues = filter_response.map((data) => {
          const bounds = getBounds(data.detailsV2.geocode);

          return {
            Title: data.detailsV2.names.name,
            SubTitle: data.detailsV2.names.longOnlyHierarchyTypeaheadV2,
            location: {
              latitude: data.detailsV2.geocode?.latitude,
              longitude: data.detailsV2.geocode?.longitude,
              bounds: bounds,
            },
          };
        });

        setSuggestions(searchValues);
      } catch (error) {}
    };

    if (searchText !== "") {
      fetchData();
    }
  }, [searchText]);

  const handleClick = (sug) => {
    setLocation(sug.location);
    setCenter({
      lat: sug.location.latitude,
      lng: sug.location.longitude,
    });
    setSuggestions([]);
  };

  useEffect(() => {
    const convertDate = () => {
      const currdate = new window.Date();
      let prevdate = new window.Date();
      prevdate.setDate(currdate.getDate() - 1);

      const ndate = new window.Date(selectedDate);
      const year = ndate.getFullYear();
      const month = String(ndate.getMonth() + 1).padStart(2, "0");
      const day = String(ndate.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      if (ndate > prevdate) setDate(formattedDate);
    };

    convertDate();
  }, [selectedDate]);

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
      <SearchMainContainer>
        <SearchContainer>
          <SearchIcon />
          <SearchBar placeholder="Where to?" onChange={handleSearch} />
        </SearchContainer>
        <Dropdown value={suggestions.length != 0 ? "Show" : "none"}>
          {suggestions?.map((sug) => {
            return (
              <Dropitem onClick={() => handleClick(sug)}>
                <Title>{sug.Title}</Title>
                <SubTitle>{sug.SubTitle}</SubTitle>
              </Dropitem>
            );
          })}
        </Dropdown>
      </SearchMainContainer>

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
