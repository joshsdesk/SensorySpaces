const mongoose = require('mongoose');
const Event = require('../src/models/Event');
const InferenceEngine = require('../src/services/SensoryInferenceEngine');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sensoryspaces';

const run = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB for reprocessing...');

        const currentVersion = InferenceEngine.version;
        console.log(`Current Inference Engine Version: ${currentVersion}`);

        // Find outdated events where inference version is old OR explicit 'reprocess' flag is needed (omitted for now)
        // Also checks if metadata exists (V2 structure)
        const query = {
            "inference.version": { $lt: currentVersion },
            "metadata": { $exists: true }
        };

        const events = await Event.find(query);
        console.log(`Found ${events.length} events needing reprocessing.`);

        for (const doc of events) {
            console.log(`Reprocessing: ${doc.metadata.title}`);

            const input = {
                title: doc.metadata.title,
                description: doc.metadata.description,
                venueName: doc.metadata.venueName || doc.metadata.location.address, // Shim for venue name extraction
                date: doc.metadata.date
            };

            const result = InferenceEngine.infer(input);

            // Compute Diff (Naive check)
            const oldProfile = JSON.stringify(doc.sensoryProfile.toObject());
            const newProfile = JSON.stringify(result.profile);

            if (oldProfile !== newProfile) {
                doc.inference.history.push({
                    version: doc.inference.version,
                    changedAt: new Date(),
                    changes: { from: 'v' + doc.inference.version } // TODO: Granular diff
                });

                doc.sensoryProfile = result.profile;
                doc.inference.lastInferredAt = new Date();
                doc.inference.version = result.version;

                await doc.save();
                console.log(`  -> Updated to v${result.version}`);
            } else {
                // Just bump version if no semantic change, to avoid re-querying
                doc.inference.version = result.version;
                await doc.save();
                console.log(`  -> Verified (No changes)`);
            }
        }

        console.log('Reprocessing Complete.');

    } catch (err) {
        console.error('Reprocessing Error:', err);
    } finally {
        mongoose.connection.close();
    }
};

run();
