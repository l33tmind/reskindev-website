import React from 'react';
import { renderToString } from 'react-dom/server';

const gig = {
  "packages": [
    {
      "featureChecks": [],
      "price": 999,
      "deliveryDays": 7,
      "description": "i will develop app viison pro app ",
      "name": "Premium"
    }
  ],
  "authorImage": "https://lh3.googleusercontent.com/a/ACg8ocKK7gnbk95lyyLZFWRLNGMCxlh1uxeRf-5VcxV5efR2pw_v28qU=s96-c",
  "description": "আমি আমার Apple Vision Pro",
  "authorName": "Robius Sani",
  "authorId": "xROY6CgkQkVsEXMWK6QGKVbH2Uv1",
  "youtubeUrls": [
    "https://www.youtube.com/watch?v=yMyPNMtwfjA"
  ],
  "category": "Service",
  "status": "active",
  "title": "i will develop Apple Vision Pro app",
  "updatedAt": {
    "type": "firestore/timestamp/1.0",
    "seconds": 1789247179,
    "nanoseconds": 446000000
  },
  "createdAt": {
    "type": "firestore/timestamp/1.0",
    "seconds": 1789247179,
    "nanoseconds": 446000000
  },
  "youtubeUrl": "https://www.youtube.com/watch?v=yMyPNMtwfjA"
};

// Sanitize Firestore timestamps so they can be passed to Client Components safely
if (gig.createdAt && typeof gig.createdAt.toDate === 'function') {
  gig.createdAt = gig.createdAt.toDate().toISOString();
}
if (gig.updatedAt && typeof gig.updatedAt.toDate === 'function') {
  gig.updatedAt = gig.updatedAt.toDate().toISOString();
}
// Remove any remaining complex objects
const sanitizedGig = JSON.parse(JSON.stringify(gig));
console.log(sanitizedGig);
