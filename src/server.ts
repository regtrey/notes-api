import app from './app';
import env from './utils/envValidator';
import mongoose from 'mongoose';

const port = env.PORT;

mongoose
  .connect(env.MONGO_URL)
  .then(() => {
    console.log('Mongoose connected');
  })
  .then(console.error);

app.listen(port, () => {
  console.log('Server running on port: ' + port);
});
