import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { supabase } from '../SupabaseClient'; // Ensure SupabaseClient is correctly set up

const { width } = Dimensions.get('window');

const Leaderboard = () => {
  const [selectedGame, setSelectedGame] = useState('2048'); // State to manage selected game
  const [leaderboard2048, setLeaderboard2048] = useState([]); // State to store 2048 leaderboard data
  const [leaderboardMemori, setLeaderboardMemori] = useState([]); // State to store Memori leaderboard data
  const [loading, setLoading] = useState(true); // State to show loading indicator

  // Function to fetch leaderboard data from Supabase
  const fetchLeaderboardData = async () => {
    console.log('Fetching leaderboard data...');
    try {
      const { data: scoresData, error: scoresError } = await supabase
        .from('game_scores')
        .select('scores_id, score_2048, score_memori');

      if (scoresError) {
        console.error('Error fetching scores data:', scoresError);
        return;
      }

      const userIds = scoresData.map(score => score.scores_id);
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('user_id, email')
        .in('user_id', userIds);

      if (usersError) {
        console.error('Error fetching users data:', usersError);
        return;
      }

      const leaderboard2048Data = [];
      const leaderboardMemoriData = [];

      scoresData.forEach((scoreData) => {
        const user = usersData.find(user => user.user_id === scoreData.scores_id);
        if (user) {
          if (scoreData.score_2048) {
            leaderboard2048Data.push({ email: user.email, score: scoreData.score_2048 });
          }
          if (scoreData.score_memori) {
            leaderboardMemoriData.push({ email: user.email, time: scoreData.score_memori });
          }
        }
      });

      // Sort the leaderboards
      leaderboard2048Data.sort((a, b) => b.score - a.score);
      leaderboardMemoriData.sort((a, b) => a.time - b.time);

      console.log('2048 Leaderboard:', leaderboard2048Data);
      console.log('Memori Leaderboard:', leaderboardMemoriData);

      setLeaderboard2048(leaderboard2048Data);
      setLeaderboardMemori(leaderboardMemoriData);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
    } finally {
      setLoading(false); // Loading finished
    }
  };

  // Fetch leaderboard data when the component mounts
  useEffect(() => {
    console.log('Component mounted, fetching leaderboard data...');
    fetchLeaderboardData();
  }, []);

  const renderPodium = (leaderboard) => {
    if (leaderboard.length < 3) return null;

    return (
      <View style={styles.podiumContainer}>
        <View style={styles.podium}>
          <View style={styles.thirdPlace}>
            <Text style={styles.podiumText}>3</Text>
            <Text style={styles.podiumUser}>{leaderboard[2].email}</Text>
          </View>
          <View style={styles.firstPlace}>
            <Text style={styles.podiumText}>1</Text>
            <Text style={styles.podiumUser}>{leaderboard[0].email}</Text>
          </View>
          <View style={styles.secondPlace}>
            <Text style={styles.podiumText}>2</Text>
            <Text style={styles.podiumUser}>{leaderboard[1].email}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, selectedGame === '2048' && styles.selectedButton]}
          onPress={() => {
            console.log('2048 button clicked');
            setSelectedGame('2048');
          }}
        >
          <Text style={styles.buttonText}>2048</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, selectedGame === 'Memori' && styles.selectedButton]}
          onPress={() => {
            console.log('Memori button clicked');
            setSelectedGame('Memori');
          }}
        >
          <Text style={styles.buttonText}>Memori</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <View style={styles.leaderboardBackgroundContainer}>
          <View style={styles.leaderboardBackground} />
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            {renderPodium(selectedGame === '2048' ? leaderboard2048 : leaderboardMemori)}
            <View style={styles.additionalBackground} />
            {(selectedGame === '2048' ? leaderboard2048 : leaderboardMemori).slice(3).map((item, index) => (
              <View key={item.email} style={styles.leaderboardItemContainer}>
                <Text style={styles.rank}>{index + 4}</Text>
                <View style={styles.leaderboardItem}>
                  <Text style={styles.email}>{item.email}</Text>
                  <Text style={styles.score}>
                    {selectedGame === '2048' ? `Score: ${item.score}` : `Time: ${item.time} seconds`}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5E8D8', // Body color
  },
  buttonContainer: {
    flexDirection: 'row', // Change to row to make buttons horizontal
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#F4887C', // Unclicked button color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20, // Make buttons rounded
  },
  selectedButton: {
    backgroundColor: '#E82561', // Clicked button color
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  podiumContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  podium: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  firstPlace: {
    backgroundColor: '#FFD700',
    marginTop: 120,
    width: 100,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    borderRadius: 20,
  },
  secondPlace: {
    backgroundColor: '#C0C0C0',
    width: 100,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    borderRadius: 20,
  },
  thirdPlace: {
    backgroundColor: '#CD7F32',
    width: 100,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    borderRadius: 20,
  },
  podiumText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  podiumUser: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  leaderboardBackgroundContainer: {
    position: 'relative',
    flex: 1,
  },
  leaderboardBackground: {
    position: 'absolute',
    top: '10%', // Overlap podium by 10%
    backgroundColor: 'white', // Background color for the leaderboard
    borderRadius: 20, // Rounded corners
    zIndex: -1,
  },
  additionalBackground: {
    position: 'absolute',
    marginTop: '96%',
    width: '100%', // Cover 100% of the screen width
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 30,
  },
  scrollViewContent: {
    paddingTop: '15%', // Adjust padding to ensure content is not hidden behind the background
  },
  leaderboardItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  leaderboardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    borderRadius: 20, // Rounded shape for rank items
    backgroundColor: '#F4887C', // Rank item color
    left: 10,
  },
  rank: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginRight: 10,
    left: 10,
  },
  email: {
    fontSize: 16,
    color: 'white',
    width: width * 0.5, // Adjust width based on screen size
  },
  score: {
    fontSize: 16,
    color: 'white',
    width: width * 0.25, // Adjust width based on screen size
  },
});

export default Leaderboard;