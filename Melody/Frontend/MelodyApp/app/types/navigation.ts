// types/navigation.ts
export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  OtherProfile: { userId: string };
  FriendsList: undefined;
  SearchResults: { searchTerm: string };
  PostCreator: undefined;
  // Add other screens and their parameters here
};
