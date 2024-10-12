import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStackParamList } from "../types/navigation";
import { searchUsers } from "./apiService";

type SearchResultsScreenRouteProp = RouteProp<
  RootStackParamList,
  "SearchResults"
>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type User = {
  name: string;
  id: string;
  email: string;
  password: string;
};

const SearchResults = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<SearchResultsScreenRouteProp>();
  const { searchTerm } = route.params;
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await searchUsers(searchTerm, page, 20); // Fetch 20 users per page
      setUsers((prevUsers) => [...prevUsers, ...response.data]);
      setTotal(response.total);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const loadMore = () => {
    if (users.length < total) {
      setPage(page + 1);
    }
  };

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator size="large" color="#0000ff" />;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Results for "{searchTerm}"</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("OtherProfile", { userId: item.id })
            }
          >
            <View style={styles.userItem}>
              <Text style={styles.userText}>Name: {item.name}</Text>
              <Text style={styles.userText}>Email: {item.email}</Text>
            </View>
          </TouchableOpacity>
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

export default SearchResults;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    marginBottom: 8,
  },
  userItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  userText: {
    fontSize: 16,
  },
});
