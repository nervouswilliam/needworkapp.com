import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Grid,
  Container,
} from "@mui/material";
import JobCard from "./jobcard.jsx";

const App = () => {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
  const OPENCAGE_KEY = import.meta.env.VITE_OPENCAGE_KEY;

  const detectLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this device.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${OPENCAGE_KEY}`
          );
          const data = await res.json();

          if (data.results.length > 0) {
            const city = data.results[0].components.city ||
              data.results[0].components.town ||
              data.results[0].components.state ||
              data.results[0].components.country;

            setLocation(city);
          }
        } catch (err) {
          console.error(err);
        }
      },
      (error) => alert("Unable to fetch location")
    );
  };

  const handleSearch = async () => {
    if (!query) return;

    setLoading(true);
    setJobs([]);

    try {
      const res = await fetch(
        `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(
          `${query} ${location}`
        )}&num_pages=1`,
        {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": API_KEY,
            "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
          },
        }
      );

      const data = await res.json();
      setJobs(data.data || []);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch jobs. Check your API key.");
    }

    setLoading(false);
  };
  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <img
          src="/logo.png"
          alt="Logo"
          style={{ width: 50, height: 50 }}
        />
        <Typography variant="h4" fontWeight={600}>
          Need Work?
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <TextField
          label="Job Title"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          fullWidth
          sx={{
            backgroundColor:"white"
          }}
        />
        <TextField
          label="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          fullWidth
          sx={{
            backgroundColor:"white"
          }}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
        <Button variant="outlined" onClick={detectLocation}>
          Use My Location
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && jobs.length === 0 && (
        <Typography sx={{ mt: 4 }} color="white">
          No jobs found.
        </Typography>
      )}

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {jobs.map((job) => (
          <Grid item xs={12} md={6} lg={4} key={job.id}>
            <JobCard job={job} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default App;
