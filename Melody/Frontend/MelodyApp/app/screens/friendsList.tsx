import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert } from 'react-native';
import {
  getFriends,
  getFriendRequests,
  acceptFriendRequest,
  denyFriendRequest,
} from './apiService';

type Friend = {
  id: string;
  name: string;
  email: string;
};

const FriendsList = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<Friend[]>([]);

  const fetchFriends = async () => {
    try {
      const friendsData = await getFriends();
      setFriends(friendsData);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const requestsData = await getFriendRequests();
      setFriendRequests(requestsData);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  };

  useEffect(() => {
    fetchFriends();
    fetchFriendRequests();
  }, []);

  const handleAcceptRequest = async (requesterId: string) => {
    try {
      await acceptFriendRequest(requesterId);
      Alert.alert('Friend request accepted');
      // Refresh lists
      fetchFriends();
      fetchFriendRequests();
    } catch (error) {
      console.error('Error accepting friend request:', error);
      Alert.alert('Error accepting friend request');
    }
  };

  const handleDenyRequest = async (requesterId: string) => {
    try {
      await denyFriendRequest(requesterId);
      Alert.alert('Friend request denied');
      // Refresh lists
      fetchFriends();
      fetchFriendRequests();
    } catch (error) {
      console.error('Error denying friend request:', error);
      Alert.alert('Error denying friend request');
    }
  };

  const renderFriendItem = ({ item }: { item: Friend }) => (
    <View style={styles.friendItem}>
      <Text style={styles.friendName}>{item.name}</Text>
      <Text style={styles.friendEmail}>{item.email}</Text>
    </View>
  );

  const renderFriendRequestItem = ({ item }: { item: Friend }) => (
    <View style={styles.friendItem}>
      <Text style={styles.friendName}>{item.name}</Text>
      <Text style={styles.friendEmail}>{item.email}</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Accept"
          onPress={() => handleAcceptRequest(item.id)}
        />
        <Button
          title="Deny"
          onPress={() => handleDenyRequest(item.id)}
          color="red"
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friend Requests</Text>
      {friendRequests.length > 0 ? (
        <FlatList
          data={friendRequests}
          keyExtractor={(item) => item.id}
          renderItem={renderFriendRequestItem}
        />
      ) : (
        <Text>No friend requests</Text>
      )}
      <Text style={styles.title}>My Friends</Text>
      {friends.length > 0 ? (
        <FlatList
          data={friends}
          keyExtractor={(item) => item.id}
          renderItem={renderFriendItem}
        />
      ) : (
        <Text>No friends yet</Text>
      )}
    </View>
  );
};

export default FriendsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginVertical: 16,
  },
  friendItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  friendName: {
    fontSize: 18,
  },
  friendEmail: {
    fontSize: 14,
    color: '#555',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});