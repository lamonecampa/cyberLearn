import app from './server-app';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`[CyberMentor Server] Running on http://localhost:${PORT}`);
});
