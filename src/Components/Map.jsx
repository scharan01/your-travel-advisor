import React from "react";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import { styled } from "styled-components";
import { getBoundsOfDistance } from "geolib";

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
  margin: 10px;
`;

const Map = ({ setLocation, center, data, filter, setCenter }) => {
  let icon = "beachflag";
  if (filter === "Restaurants") {
    icon = "library_maps";
  } else if (filter === "Hotels") {
    icon = "info-i_maps";
  }

  const getBounds = (loc) => {
    try {
      const bounds = getBoundsOfDistance(
        { latitude: loc.latitude, longitude: loc.longitude },
        5000
      );
      return bounds;
    } catch (e) {}
  };

  const handleMapClick = (event) => {
    const { latLng } = event;
    const latitude = latLng.lat();
    const longitude = latLng.lng();
    const bounds = getBounds({ latitude, longitude });

    setLocation({ latitude: latitude, longitude: longitude, bounds: bounds });
    setCenter({
      lat: latitude,
      lng: longitude,
    });
  };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "API_KEY",
  });

  return isLoaded ? (
    <ContentWrapper>
      <GoogleMap
        onClick={handleMapClick}
        mapContainerStyle={containerStyle}
        center={center}
        zoom={11}
      >
        <MarkerF position={center} />
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
