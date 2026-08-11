export interface Profile {
  id: string;
  name: string;
  passcode: string;
  created_at: string;
}

export interface SetupProfileInput {
  name: string;
  passcode: string;
}