import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import { useSettings } from '../contexts/settingsContext';
import { useGame } from '../contexts/gameContext';

import { colors, STATIONS } from '../consts';
import { fetchData } from '../util';

import Loading from '../components/Loading';
import Header from '../components/Header';
import { ColorAndroid } from 'react-native/Libraries/StyleSheet/PlatformColorValueTypesAndroid';

export default function SettingsScreen() {
  const { settings, settingsDispatch } = useSettings();
  const { stationChangeError } = settings;

  const { realData, dispatch } = useGame();
  const { loading } = realData;

  async function handleSelectStation(e, station) {
    settingsDispatch({ type: 'STATION_CHANGE_ERROR', payload: '' });
    dispatch({ type: 'FETCHING', error: '', loading: true });

    try {
      const allData = await fetchData(station.name);

      // first make sure the request succeed
      if (!allData || allData.error) {
        throw Error(''); // Error is hardcoded below in catch block.
      } else {
        // Set the newly selected station.
        settingsDispatch({ type: 'SELECT_STATION', payload: station });

        // Update game data.
        dispatch({
          type: 'SET_FETCHED_DATA',
          error: '',
          payload: allData,
        });

        // Update 'has station changed?' boolean. Game screen relies on this to know when to kill games.
        dispatch({ type: 'SET_STATION_CHANGED', payload: true });
      }
    } catch (err) {
      // Station is not actually changed if the request does not succeed so use settings screen error. The game screen does not need to know.
      settingsDispatch({
        type: 'STATION_CHANGE_ERROR',
        payload: `Sorry, couldn't load ${
          station.displayName ? station.displayName : '.'
        }.`,
      });

      // Game screen does not need to know about errors (because it will continue as if there was no attempt to change the station) but it needs to know about loading to display a spinner. Loading is set to true above when gameReducer 's action is used for the request but it has to be manually set back to false on error.
      dispatch({ type: 'SET_LOADING', loading: false });
    }
  }

  function renderStations({ item }) {
    return (
      <TouchableOpacity onPress={(e) => handleSelectStation(e, item)}>
        <View
          style={
            settings.selectedStation === item.name
              ? styles.selectedStation
              : styles.station
          }
        >
          <Text style={styles.text}>{item.displayName}</Text>
        </View>
      </TouchableOpacity>
    );
  }
  return (
    <>
      <Header title="Irish Rain Sweeper" />
      <View style={styles.settingsScreenWrap}>
        {!!stationChangeError && (
          <Text style={styles.stationError}>{stationChangeError}</Text>
        )}

        {!!loading && (
          <>
            <View
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                backgroundColor: 'transparent',
                zIndex: 2,
              }}
            >
              <Loading />
            </View>

            {/* Don't delete overlay. It's because of transparancy problems with full screen loading spinner. */}
            <View opacity={0.8} style={styles.overlay} />
          </>
        )}
        <Text style={styles.instructions}>Choose a weather station...</Text>
        <FlatList
          keyExtractor={(item) => item.name}
          numColumns={2}
          data={STATIONS}
          renderItem={renderStations}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: colors.black,
    zIndex: 1,
  },
  settingsScreenWrap: {
    flex: 1,
    backgroundColor: colors.darkBlack,
    padding: 16,
    justifyContent: 'center',
  },
  instructions: {
    marginHorizontal: 8,
    marginBottom: 16,
    paddingVertical: 2,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignContent: 'flex-start',
    backgroundColor: colors.black,
    color: colors.gray,
    fontSize: 14,
  },
  station: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 4,
    margin: 8,
    elevation: 8,
    minWidth: '30%',
    color: colors.black,
  },
  selectedStation: {
    flex: 1,
    backgroundColor: colors.orange,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 4,
    margin: 8,
    minWidth: '30%',
    elevation: 8,
    color: colors.black,
    alignContent: 'stretch',
    justifyContent: 'space-between',
  },
  text: {
    color: colors.black,
    flex: 1,
    fontFamily: 'monospace',
    width: '100%',
  },
  red: {
    backgroundColor: colors.red,
  },
  green: {
    backgroundColor: 'green',
  },
  stationError: {
    color: colors.white,
    backgroundColor: colors.red,
    padding: 8,
    borderRadius: 4,
    marginBottom: 16,
    marginHorizontal: 8,
    fontSize: 12,
  },
});
