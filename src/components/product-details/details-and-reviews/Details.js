import React from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const Details = ({ description }) => {
  const theme = useTheme();
  const baseStyle = {
    color: theme.palette.neutral[400],
    fontSize: "12px",
    lineHeight: 1.7,
  };

  const renderInline = (text, keyPrefix) => {
    const parts = [];
    const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
    let lastIndex = 0;
    let match;

    while ((match = pattern.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      const token = match[0];
      if (token.startsWith("**")) {
        parts.push(
          <Box component="strong" key={`${keyPrefix}-b-${match.index}`} sx={{ fontWeight: 700 }}>
            {token.slice(2, -2)}
          </Box>
        );
      } else {
        parts.push(
          <Box component="em" key={`${keyPrefix}-i-${match.index}`} sx={{ fontStyle: "italic" }}>
            {token.slice(1, -1)}
          </Box>
        );
      }

      lastIndex = match.index + token.length;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts;
  };

  const lines = (description || "").replace(/\r\n/g, "\n").split("\n");

  return (
    <Box>
      {lines.map((line, index) => {
        const trimmed = line.trim();
        const bulletMatch = trimmed.match(/^[-*]\s+(.+)/);
        const numberedMatch = trimmed.match(/^(\d+\.)\s+(.+)/);

        if (!trimmed) {
          return <Box key={`empty-${index}`} sx={{ height: 8 }} />;
        }

        if (bulletMatch || numberedMatch) {
          const marker = numberedMatch ? numberedMatch[1] : "•";
          const text = bulletMatch ? bulletMatch[1] : numberedMatch[2];
          return (
            <Typography key={`line-${index}`} component="p" sx={baseStyle}>
              <Box component="span" sx={{ display: "inline-block", minWidth: 18 }}>
                {marker}
              </Box>
              {renderInline(text, `line-${index}`)}
            </Typography>
          );
        }

        return (
          <Typography key={`line-${index}`} component="p" sx={baseStyle}>
            {renderInline(line, `line-${index}`)}
          </Typography>
        );
      })}
    </Box>
  );
};

Details.propTypes = {};

export default Details;
