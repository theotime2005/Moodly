/**
 * A record of the navigation params for each route in your app.
 */
export type MainStackParamList = {
  Login?: {};
  Employee: { userId: string };
  Manager: { userId: string };
  DailySuggestion?: {};
  QuickActions?: {};
};
