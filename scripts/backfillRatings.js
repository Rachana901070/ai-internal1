import mongoose from "mongoose";
import Feedback from "../server/src/models/Feedback.js";
import User from "../server/src/models/User.js";
import db from "../server/src/config/db.js";

async function backfillRatings() {
  try {
    await db();

    console.log("Starting backfill of ratings...");

    // Get all collectors
    const collectors = await User.find({ role: "collector" });
    console.log(`Found ${collectors.length} collectors`);

    for (const collector of collectors) {
      const agg = await Feedback.aggregate([
        { $match: { collector: collector._id } },
        { $group: { _id: '$collector', avg: { $avg: '$rating' }, count: { $sum: 1 } } }
      ]);

      if (agg.length > 0) {
        const avg = agg[0].avg;
        const count = agg[0].count;
        const roundedAvg = Math.round(avg * 10) / 10;

        await User.findByIdAndUpdate(collector._id, { ratingAvg: roundedAvg, ratingCount: count });
        console.log(`Updated ${collector.name}: ${roundedAvg} (${count} reviews)`);
      } else {
        await User.findByIdAndUpdate(collector._id, { ratingAvg: 0, ratingCount: 0 });
        console.log(`No ratings for ${collector.name}`);
      }
    }

    console.log("Backfill completed successfully");
  } catch (error) {
    console.error("Backfill failed:", error);
  } finally {
    await mongoose.connection.close();
  }
}

backfillRatings();
