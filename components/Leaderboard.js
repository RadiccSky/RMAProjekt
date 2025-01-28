import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Image } from 'react-native';
import { supabase } from '../SupabaseClient'; // Ensure SupabaseClient is correctly set up
import Background from './Background';

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
      // Fetching game_scores data with user_id
      const { data: scoresData, error: scoresError } = await supabase
        .from('game_scores')
        .select('user_id, score_2048, score_memori')
        .order('score_2048', { ascending: false });  // Sorting by score_2048

      if (scoresError) {
        console.error('Error fetching scores data:', scoresError);
        return;
      }

      // Fetching user data based on user_ids
      const userIds = scoresData.map(score => score.user_id);
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('user_id, name, avatar_url') // Fetching name and avatar_url
        .in('user_id', userIds);

      if (usersError) {
        console.error('Error fetching users data:', usersError);
        return;
      }

      const leaderboard2048Data = [];
      const leaderboardMemoriData = [];

      // Processing scores data and linking with user data
      scoresData.forEach((scoreData) => {
        const user = usersData.find(user => user.user_id === scoreData.user_id);
        if (user) {
          if (scoreData.score_2048 !== null) {
            leaderboard2048Data.push({ name: user.name, score: scoreData.score_2048, avatar_url: user.avatar_url });
          }
          if (scoreData.score_memori !== null) {
            leaderboardMemoriData.push({ name: user.name, time: scoreData.score_memori, avatar_url: user.avatar_url });
          }
        }
      });

      // Sorting the leaderboards
      leaderboard2048Data.sort((a, b) => b.score - a.score);  // Sort 2048 scores descending
      leaderboardMemoriData.sort((a, b) => a.time - b.time);  // Sort Memori scores ascending

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
            <Image source={{ uri: leaderboard[2].avatar_url }} style={styles.avatar} />
            <Text style={styles.podiumText}>3</Text>
            <Text style={styles.podiumUser}>{leaderboard[2].name}</Text>
            <Text style={styles.podiumScore}>{selectedGame === '2048' ? `Score: ${leaderboard[2].score}` : `Time: ${leaderboard[2].time} seconds`}</Text>
          </View>
          <View style={styles.firstPlace}>
            <Image source={{ uri: leaderboard[0].avatar_url }} style={styles.avatar} />
            <Text style={styles.podiumText}>1</Text>
            <Text style={styles.podiumUser}>{leaderboard[0].name}</Text>
            <Text style={styles.podiumScore}>{selectedGame === '2048' ? `Score: ${leaderboard[0].score}` : `Time: ${leaderboard[0].time} seconds`}</Text>
          </View>
          <View style={styles.secondPlace}>
            <Image source={{ uri: leaderboard[1].avatar_url }} style={styles.avatar} />
            <Text style={styles.podiumText}>2</Text>
            <Text style={styles.podiumUser}>{leaderboard[1].name}</Text>
            <Text style={styles.podiumScore}>{selectedGame === '2048' ? `Score: ${leaderboard[1].score}` : `Time: ${leaderboard[1].time} seconds`}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (

    <Background>
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
  <View key={item.name} style={styles.leaderboardItemContainer}>
    <Text style={styles.rank}>{index + 4}</Text>
    <View style={styles.leaderboardRectangle}>
      <Image source={{ uri: item.avatar_url }} style={styles.avatarSmall} />
      <Text style={styles.name}>{item.name}</Text>
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
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    
  },
  buttonContainer: {
    flexDirection: 'row', // Change to row to make buttons horizontal
    justifyContent: 'space-around',
    marginBottom: 5,
    marginTop: 45,
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
    backgroundColor: '#E82561',
    marginTop: 100,
    width: 100,
    height: 210,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    borderRadius: 20,
  },
  secondPlace: {
    backgroundColor: '#F4887C',
    width: 100,
    height: 170,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    borderRadius: 20,
  },
  thirdPlace: {
    backgroundColor: '#edc08a',
    width: 100,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    borderRadius: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'white',
    top: -50,
  },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
    marginRight: 10,
  },
  podiumText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    top: -35,
  },
  podiumUser: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    top:-35,
  },
  podiumScore: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    top: -35,
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
    marginTop: '80%',
    width: '100%', // Cover 100% of the screen width
    height: '150%',
    backgroundColor: 'white',
    borderRadius: 30,
  },
  scrollViewContent: {
    marginTop: '25%',
  },
  leaderboardRectangle: {
    width: "85%", // Da zauzme sav horizontalni prostor
    backgroundColor: '#F8F8F8', // Svetla boja pozadine
    borderRadius: 15, // Zaobljeni uglovi
    padding: 15, // Unutrašnji razmak
    elevation: 2, // Blaga senka (Android)
    shadowColor: '#000', // Senka (iOS)
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginLeft: 10,
    flexDirection: 'row', // Da ime, avatar i rezultat budu u redu
    alignItems: 'center',
  },

  leaderboardItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  rank: {
    fontSize: 16,
    fontWeight: 'bold',  
    paddingLeft: 15,  
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  score: {
    fontSize: 14,
    marginLeft: 10,
  },
});

export default Leaderboard;
