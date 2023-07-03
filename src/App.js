import Header from "./Components/Header";
import Map from "./Components/Map";
import Results from "./Components/Results";
import styled from "styled-components";
import { useState, useEffect } from "react";
import axios from "axios";

const Container = styled.div``;

const Content = styled.div`
  padding: 10px;
  width: 95%;
  height: 71vh;
  margin: auto;
  display: flex;
  justify-content: space-between;
  position: relative;
  overflow: auto;
`;

const Hr = styled.hr`
  width: 90%;
  margin-left: 5%;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 70vh;
`;

const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3; /* Light gray */
  border-top: 4px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

function App() {
  const [location, setLocation] = useState(297586);
  const [filter, setFilter] = useState("Attractions");
  const [data, setData] = useState([]);
  const [center, setCenter] = useState({ lat: 17.379908, lng: 78.48787 });
  const [loaded, setLoaded] = useState(false);
  const [locationFound, setLocationFound] = useState(true);
  const [error, setError] = useState(false);
  const [date, setDate] = useState("");

  const apikey = "API_KEY";

  useEffect(() => {
    const fetchData = async () => {
      let options = {};

      if (filter === "Restaurants") {
        options = {
          method: "GET",
          url: "https://travel-advisor.p.rapidapi.com/restaurants/list",
          params: {
            location_id: `${location}`,
            currency: "USD",
            lunit: "km",
            limit: "30",
            lang: "en_US",
          },
          headers: {
            "X-RapidAPI-Key": `${apikey}`,
            "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
          },
        };
      } else if (filter === "Hotels") {
        options = {
          method: "GET",
          url: "https://travel-advisor.p.rapidapi.com/hotels/list",
          params: {
            location_id: `${location}`,
            adults: "1",
            rooms: "1",
            currency: "USD",
            limit: "30",
            sort: "recommended",
            lang: "en_US",
          },
          headers: {
            "X-RapidAPI-Key": `${apikey}`,
            "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
          },
        };
      } else {
        options = {
          method: "GET",
          url: "https://travel-advisor.p.rapidapi.com/attractions/list",
          params: {
            location_id: `${location}`,
            currency: "USD",
            lang: "en_US",
            lunit: "km",
            limit: "30",
            sort: "recommended",
          },
          headers: {
            "X-RapidAPI-Key": `${apikey}`,
            "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
          },
        };
      }
      try {
        const response = await axios.request(options);

        const data2 = response.data.data.filter((data) => data.name);
        setData(data2);
        setLoaded(true);
      } catch (error) {}
    };

    if (locationFound) {
      setError(false);
      fetchData();
    } else {
      setError(true);
    }
  }, [location, filter]);

  useEffect(() => {
    setLoaded(false);
  }, [filter]);

  return (
    <Container>
      <Header
        setLocation={setLocation}
        setFilter={setFilter}
        setCenter={setCenter}
        setLoaded={setLoaded}
        setLocationFound={setLocationFound}
        setError={setError}
        setDate={setDate}
      />
      <Hr></Hr>
      {loaded && !error ? (
        <Content>
          <Results data={data} filter={filter} />
          <Map center={center} data={data} filter={filter} />
        </Content>
      ) : (
        <LoadingContainer>
          {!error && <LoadingSpinner />}
          {error && <h3>Location not found! Check for typos and try again!</h3>}
        </LoadingContainer>
      )}
    </Container>
  );
}

export default App;
