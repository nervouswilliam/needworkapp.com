import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
} from "@mui/material";

function JobCard({ job }) {
  return (
    <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={600}>
          {job.job_title}
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          {job.employer_name} — {job.job_city}, {job.job_country}
        </Typography>

        <Typography sx={{ mt: 1 }}>
          {job.job_description.slice(0, 160)}...
        </Typography>

        {job.job_employment_type && (
          <Typography color="primary" sx={{ mt: 1 }}>
            {job.job_employment_type}
          </Typography>
        )}
      </CardContent>

      <CardActions>
        <Button
          variant="contained"
          href={job.job_apply_link}
          target="_blank"
          fullWidth
          sx={{ borderRadius: 2 }}
        >
          Apply
        </Button>
      </CardActions>
    </Card>
  );
}

export default JobCard;
