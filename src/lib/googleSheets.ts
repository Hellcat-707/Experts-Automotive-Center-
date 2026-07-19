import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User,
  signOut
} from "firebase/auth";
import firebaseConfig from "../../firebase-applet-config.json";
import { Booking } from "../types";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/spreadsheets");
provider.addScope("https://www.googleapis.com/auth/drive.file");

// In-memory token cache
let cachedAccessToken: string | null = null;
let isSigningIn = false;

// Initialize auth state and try to restore session
export const initAuth = (
  onAuthSuccess: (user: User, token: string) => void,
  onAuthFailure: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      // In a real app, if the token is not cached, we can request a refresh or prompt
      if (cachedAccessToken) {
        onAuthSuccess(user, cachedAccessToken);
      } else {
        // Token is not cached yet, we might need a re-auth or wait for signInWithPopup
        onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      onAuthFailure();
    }
  });
};

// Start Google sign-in popup
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error("Failed to get Google Sheets access token from authentication.");
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error("Sign-in error:", error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

// Get current token
export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

// Logout
export const logoutGoogle = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

// --- Google Sheets API Helpers ---

// Create a new spreadsheet in Google Drive
export const createBookingsSpreadsheet = async (accessToken: string): Promise<string> => {
  const response = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      properties: {
        title: "Experts Automotive Bookings",
      },
      sheets: [
        {
          properties: {
            title: "Sheet1",
            gridProperties: {
              frozenRowCount: 1,
            },
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData.error?.message || "Failed to create Google Sheet.");
  }

  const data = await response.json();
  if (!data.spreadsheetId) {
    throw new Error("Spreadsheet created but no ID was returned.");
  }

  return data.spreadsheetId;
};

// Check if a spreadsheet is accessible
export const checkSpreadsheetExists = async (accessToken: string, spreadsheetId: string): Promise<boolean> => {
  try {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=spreadsheetId`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.ok;
  } catch {
    return false;
  }
};

// Sync all bookings to a specific spreadsheet
export const syncBookingsToSheet = async (
  accessToken: string,
  spreadsheetId: string,
  bookings: Booking[]
): Promise<void> => {
  // 1. Clear existing content in Sheet1
  const clearUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:Z1000:clear`;
  const clearResponse = await fetch(clearUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!clearResponse.ok) {
    const errData = await clearResponse.json();
    throw new Error(errData.error?.message || "Failed to clear the Google Sheet.");
  }

  // 2. Prepare headers and rows
  const values = [
    [
      "Booking ID",
      "Customer Name",
      "Phone Number",
      "Vehicle Brand",
      "Vehicle Model",
      "Vehicle Year",
      "Service Requested",
      "Date of Arrival",
      "Garage Branch",
      "Customer Notes",
      "Booking Status",
      "Created At"
    ],
    ...bookings.map((b) => [
      b.id,
      b.fullName,
      b.phoneNumber,
      b.brand,
      b.model,
      b.year,
      b.serviceType,
      b.date,
      b.branch,
      b.notes || "",
      b.status,
      new Date(b.createdAt).toLocaleString()
    ]),
  ];

  // 3. Write new data starting at Sheet1!A1
  const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1?valueInputOption=USER_ENTERED`;
  const updateResponse = await fetch(updateUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      values,
    }),
  });

  if (!updateResponse.ok) {
    const errData = await updateResponse.json();
    throw new Error(errData.error?.message || "Failed to write bookings to Google Sheet.");
  }

  // Optional: Auto-format header row (bold & custom background) to look incredibly premium
  try {
    const formatUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`;
    await fetch(formatUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: 0,
                startRowIndex: 0,
                endRowIndex: 1,
                startColumnIndex: 0,
                endColumnIndex: 12
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: {
                    red: 0.1,
                    green: 0.1,
                    blue: 0.12
                  },
                  textFormat: {
                    foregroundColor: {
                      red: 1.0,
                      green: 0.34,
                      blue: 0.13
                    },
                    bold: true,
                    fontSize: 10
                  },
                  horizontalAlignment: "CENTER"
                }
              },
              fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)"
            }
          }
        ]
      })
    });
  } catch (err) {
    console.warn("Failed to apply header styling, but values were written successfully.", err);
  }
};
