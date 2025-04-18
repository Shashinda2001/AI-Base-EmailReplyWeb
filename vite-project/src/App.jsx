import { useState } from 'react';
import './App.css';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper
} from '@mui/material';
import axios from 'axios';

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [type, setType] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:8080/api/email/generate', {
        emailContent,
        tone,
        type
      });
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    } catch (error) {
      setError('Failed to generate reply. Please try again');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, #667eea, #764ba2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={10}
          sx={{
            borderRadius: 4,
            p: 4,
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            align="center"
            gutterBottom
            sx={{
              background: 'linear-gradient(to right, #764ba2, #667eea)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
            }}
          >
            ✉️ AI MailBot
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            label="Original Email Content"
            value={emailContent}
            sx={{ mb: 3, mt: 2 }}
            onChange={(e) => setEmailContent(e.target.value)}
          />

<Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
  <FormControl sx={{ flex: 1 }}>
    <InputLabel>Tone (Optional)</InputLabel>
    <Select
      value={tone}
      label="Tone (Optional)"
      onChange={(e) => setTone(e.target.value)}
    >
      <MenuItem value="">None</MenuItem>
      <MenuItem value="professional">Professional</MenuItem>
      <MenuItem value="casual">Casual</MenuItem>
      <MenuItem value="friendly">Friendly</MenuItem>
    </Select>
  </FormControl>

  <FormControl sx={{ flex: 1 }}>
    <InputLabel>Type (Optional)</InputLabel>
    <Select
      value={type}
      label="Type (Optional)"
      onChange={(e) => setType(e.target.value)} // corrected setTone ➝ setType
    >
      <MenuItem value="">None</MenuItem>
      <MenuItem value="positive">Positive</MenuItem>
      <MenuItem value="negative">Negative</MenuItem>
      <MenuItem value="neutral">Neutral</MenuItem>
    </Select>
  </FormControl>
</Box>


          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            onClick={handleSubmit}
            disabled={!emailContent || loading}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: 3,
            }}
          >
            {loading ? <CircularProgress size={24} /> : '✨ Generate Reply'}
          </Button>

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          {generatedReply && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                📝 Generated Reply:
              </Typography>

              <TextField
                fullWidth
                multiline
                rows={6}
                variant="outlined"
                value={generatedReply}
                inputProps={{ readOnly: true }}
              />

              <Button
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={() => navigator.clipboard.writeText(generatedReply)}
              >
                📋 Copy to Clipboard
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default App;
