/**
 * MKP Mobile Cloud Functions
 *
 * This file is the entry point for Firebase Cloud Functions.
 * Functions will be added in BE-05+ as features require them.
 *
 * Planned functions (deferred):
 * - joinChurch: validate join code, add member to church
 * - submitCareRequest: create care request with server timestamp
 * - createCareThread: open private in-app care thread after request submission
 * - respondToCareThread: allow one church reply max per thread
 * - notifyPastor: send push notification for care escalation
 * - notifyMemberCareReply: send push notification when church reply arrives
 */

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

// Placeholder export to ensure deployment works
// Remove this comment block when adding real functions
export const helloWorld = functions.https.onRequest((req, res) => {
  res.send("MKP Functions initialized");
});
