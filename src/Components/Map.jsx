import React from "react";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import { styled } from "styled-components";

let containerStyle = {
  width: "100%",
  height: "100%",
};

const ContentWrapper = styled.div`
  height: 71vh;
  width: 50%;
  position: sticky;
  top: 0;
  border: 1px solid black;
  border-radius: 5px;
`;

const Map = ({ center, data, filter }) => {
  let icon = "beachflag";
  if (filter === "Restaurants") {
    icon = "library_maps";
  } else if (filter === "Hotels") {
    icon = "info-i_maps";
  }

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "API_KEY",
  });

  return isLoaded ? (
    <ContentWrapper>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={11}>
        {data.map((dat, i) => {
          return (
            <MarkerF
              key={i}
              position={{
                lat: Number(dat.latitude),
                lng: Number(dat.longitude),
              }}
              options={{
                icon: {
                  url: `https://developers.google.com/maps/documentation/javascript/examples/full/images/${icon}.png`,
                  scaledSize: new window.google.maps.Size(32, 32),
                },
              }}
            />
          );
        })}
      </GoogleMap>
    </ContentWrapper>
  ) : (
    <div>Loading Google Maps...</div>
  );
};

export default Map;
