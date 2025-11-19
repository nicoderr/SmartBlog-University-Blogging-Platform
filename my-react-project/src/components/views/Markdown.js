import * as React from 'react';
import ReactMarkdown from 'markdown-to-jsx';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import matter from "gray-matter"; // ✅ Import YAML front-matter parser

function MarkdownListItem(props) {
  return <Box component="li" sx={{ mt: 1, typography: 'body1' }} {...props} />;
}

const options = {
  overrides: {
    h1: {
      component: Typography,
      props: {
        gutterBottom: true,
        variant: 'h4',
        component: 'h1',
      },
    },
    h2: {
      component: Typography,
      props: { gutterBottom: true, variant: 'h6', component: 'h2' },
    },
    h3: {
      component: Typography,
      props: { gutterBottom: true, variant: 'subtitle1' },
    },
    h4: {
      component: Typography,
      props: {
        gutterBottom: true,
        variant: 'caption',
        paragraph: true,
      },
    },
    p: {
      component: Typography,
      props: { paragraph: true },
    },
    a: { component: Link },
    li: {
      component: MarkdownListItem,
    },
  },
};

export default function Markdown({ children }) {
  // ✅ Ensure children is a string before parsing
  const markdownContent = typeof children === 'string' ? children : '';

  // ✅ Extract metadata safely
        let content = markdownContent;
        let data = {};

        try {
          const parsed = matter(markdownContent);
          content = parsed.content;
          data = parsed.data;
          console.log("Extracted Metadata:", data); // ✅ Debugging Log
        } catch (error) {
          console.error("Error parsing Markdown:", error);
        }


  return (
    <Box>
      {/* ✅ Debugging: Show metadata if extracted */}
      {data && Object.keys(data).length > 0 && (
        <>
          {data && Object.keys(data).length > 0 && (
            <Typography variant="h5" component="h2" gutterBottom>
              {data.title}
            </Typography>
          )}

          {data.date && data.author && (
            <Typography variant="subtitle2" color="textSecondary">
              {data.date} by {data.author}
            </Typography>
          )}
        </>
      )}

      {/* ✅ Render the actual Markdown content */}
      <ReactMarkdown options={options}>{content}</ReactMarkdown>
    </Box>
  );
}
