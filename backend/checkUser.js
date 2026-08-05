import connectDB from './db.js';
import User from './models/user.js';

const run = async () => {
  const ok = await connectDB();
  console.log('dbReady=', ok);
  const users = await User.find({ email: { $regex: '^(anjali@gmail\\.com)$', $options: 'i' } });
  console.log(JSON.stringify(users, null, 2));
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
