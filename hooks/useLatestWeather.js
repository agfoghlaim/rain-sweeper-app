import { useState, useEffect } from 'react';

export default function useLatestWeather() {
  const [weather, setWeather] = useState();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = 'https://irish-apis.netlify.app/weather/api';

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        query: `
          query {
            presentObservations(stations: [ATHENRY]) {
              stations {
                name
                symbol
                weather_text
              }
            }
          }
        `,
      }),
    })
      .then((res) => res.json())
      .then((ans) => {
        setWeather(ans.data.presentObservations.stations);
        setLoading(false);
      })
      .catch((e) => {
        console.log('Error', e);
        setError(true);
        setLoading(false);
      });
  }, []);

  return !loading && !error && weather[0];
}
