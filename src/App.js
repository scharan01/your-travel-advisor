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
  height: 75vh;
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
  const [location, setLocation] = useState({});
  const [filter, setFilter] = useState("Attractions");
  const [data, setData] = useState([]);
  const [center, setCenter] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(true);
  const [date, setDate] = useState("");
  const [radius, setRadius] = useState(5.0);
  const [filteredData, setFilteredData] = useState([]);

  const apikey = "API_KEY";

  useEffect(() => {
    const fetchData = async () => {
      let options = {};

      if (filter === "Restaurants") {
        options = {
          method: "GET",
          url: "https://travel-advisor.p.rapidapi.com/restaurants/list-in-boundary",
          params: {
            tr_longitude: `${location.bounds?.[1].longitude}`,
            tr_latitude: `${location.bounds?.[1].latitude}`,
            bl_longitude: `${location.bounds?.[0].longitude}`,
            bl_latitude: `${location.bounds?.[0].latitude}`,
            limit: "100",
            currency: "USD",
            lunit: "km",
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
          url: "https://travel-advisor.p.rapidapi.com/hotels/list-by-latlng",
          params: {
            latitude: `${location.latitude}`,
            longitude: `${location.longitude}`,

            limit: "100",
            lang: "en_US",
            currency: "INR",
            ...(date !== "" && { checkin: `${date}` }),
          },
          headers: {
            "X-RapidAPI-Key": `${apikey}`,
            "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
          },
        };
      } else {
        options = {
          method: "GET",
          url: "https://travel-advisor.p.rapidapi.com/attractions/list-in-boundary",
          params: {
            tr_longitude: `${location.bounds?.[1].longitude}`,
            tr_latitude: `${location.bounds?.[1].latitude}`,
            bl_longitude: `${location.bounds?.[0].longitude}`,
            bl_latitude: `${location.bounds?.[0].latitude}`,
            limit: "100",
            currency: "USD",
            lunit: "km",
            lang: "en_US",
          },
          headers: {
            "X-RapidAPI-Key": `${apikey}`,
            "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
          },
        };
      }
      try {
        const response = await axios.request(options);
        const data2 = response.data.data.filter(
          (data) => data.name && data.photo && data.rating
        );
        setData(data2);
        setFilteredData(data2);
        setLoaded(true);
        if (data2.length === 0) setError(true);
      } catch (error) {}
    };

    if (Object.keys(location).length !== 0) {
      setError(false);
      setLoaded(false);
      fetchData();
    }
  }, [location, filter, date]);

  useEffect(() => {
    const filtered_data = data.filter((res) => res.distance <= radius);
    setFilteredData(filtered_data);
  }, [radius]);

  return (
    <Container>
      <Header
        setLocation={setLocation}
        setFilter={setFilter}
        setCenter={setCenter}
        setDate={setDate}
      />
      <Hr></Hr>
      {loaded && !error ? (
        <Content>
          <Results
            data={filteredData}
            filter={filter}
            radius={radius}
            setRadius={setRadius}
          />
          <Map
            setLocation={setLocation}
            center={center}
            data={filteredData}
            filter={filter}
            setCenter={setCenter}
          />
        </Content>
      ) : (
        <LoadingContainer>
          {!loaded && !error && <LoadingSpinner />}
          {loaded && error && (
            <h3>
              Something went wrong(API hasn't responded) please try again!
            </h3>
          )}
          {!loaded && error && <h2>Search for a place to explore nearby!</h2>}
        </LoadingContainer>
      )}
    </Container>
  );
}

export default App;
