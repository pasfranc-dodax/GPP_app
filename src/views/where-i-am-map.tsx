import React, { useEffect } from 'react';
import { View, ScrollView, Image, StyleSheet, Dimensions } from 'react-native';
import { Button, Divider, StyleService, Text, TopNavigation, TopNavigationAction, useStyleSheet, Layout, Select } from '@ui-kitten/components';
import { MenuIcon } from '../components/icons';
import { categoryOptions } from './where-i-am/data-category';
import { getBoundByRegion } from '../services/maps';
import MapView, {PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { Region } from 'react-native-maps';
import { SafeAreaLayout } from '../components/safe-area-layout.component';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppOptions } from '../services/app-options';
import I18n from './../i18n/i18n';

const { height, width } = Dimensions.get( 'window' );
const LATITUDE_DELTA = 60;
const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);

interface RegionBoudaries {
  northWestLatitude: number;
  northWestLongitude: number;
  southEastLatitude: number;
  southEastLongitude: number;
}

const initialMapRegion: Region = {
  latitude: 48.368141,
  longitude: 35.412676,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};

const initialBoudaries: RegionBoudaries = {
  northWestLatitude: 0,
  northWestLongitude: 0,
  southEastLatitude: 0,
  southEastLongitude: 0,
};

export const WhereIAmMapScreen = (props): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);

  const [filter, setFilter] = React.useState(props.selectedOption);
  const [mapRegion, setMapRegion] = React.useState<Region>(initialMapRegion);
  const [regionBoundaries, setRegionBoundaries] = React.useState<RegionBoudaries>(initialBoudaries);
  const [isMapReady, setMapReady] = React.useState(false);
  const [markers, setMarkers] = React.useState([]);
  const onSelectFilter = (option) => {
    setFilter(option);
  };

  async function getMyRegion(Lat1, Lon1, Lat2, Lon2) {
    // get position

    // ask structures
    const token = await AsyncStorage.getItem('token');
    const query_start = '{';
    const where = `"where":{
      "latitudeNorthWest": ` + Lat1 + `,
      "longitudeNorthWest": ` + Lon1 + `,
      "latitudeSouthEast": ` + Lat2 + `,
      "longitudeSouthEast": ` + Lon2 + `},
      `;
    const fields = '"fields":{"idStructure":true,"idOrganization":false,"organizationname":false,"alias":false,"structurename":true,"address":true,"city":true,"latitude":true,"longitude":true,"email":false,"phoneNumberPrefix":false,"phoneNumber":false,"website":false,"idIcon":false,"iconimage":false,"iconmarker":true}';
    const query_end = '}';
    axios
    .get(AppOptions.getServerUrl() + 'structures/?filter=' + query_start + where + fields + query_end, {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    })
    .then(function (response) {
       setMarkers(response.data);
    })
    .catch(function (error) {
      // alert(JSON.stringify(error));
      throw error;
    });
  }

  /*useEffect(() => {
    getMyRegion();
  }, []);*/

  const handleMapReady = () => {
    setMapReady(true);
  };

  const onListButtonPress = (): void => {
    props.navigation && props.navigation.navigate('WhereIAmList');
  };

  const onCountryButtonPress = (): void => {
    props.navigation && props.navigation.navigate('WhereIAmCountry');
  };

  const onRegionChange = (curMapRegion): void => {
    setMapRegion(curMapRegion);
    const boundaries = getBoundByRegion(curMapRegion);
    setRegionBoundaries(boundaries);
    /* console.log("NWLat: " + boundaries.northWestLatitude);
    console.log("NWLon: " + boundaries.northWestLongitude);
    console.log("SELat: " + boundaries.southEastLatitude);
    console.log("SELon: " + boundaries.southEastLongitude); */
    getMyRegion(
      boundaries.northWestLatitude,
      boundaries.northWestLongitude,
      boundaries.southEastLatitude,
      boundaries.southEastLongitude,
      );
  };

  const renderDrawerAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={MenuIcon}
      onPress={props.navigation.toggleDrawer}
    />
  );

  const { region } = props;

  return (
    <SafeAreaLayout
      style={styles.safeArea}
      insets='top'>
      <TopNavigation
        title='Structures Map'
        leftControl={renderDrawerAction()}
      />
      <Divider/>
      <ScrollView>
        <Layout style={styles.filtersContainer}>
          <Text style={styles.labelWhat}>What are you searching for?</Text>
          <Select
                {...props}
                style={styles.select}
                selectedOption={filter}
                data={categoryOptions}
                placeholder='Show All'
                onSelect={onSelectFilter}
              />
        </Layout>
        <Layout style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={isMapReady ? styles.Map : {}}
            region={mapRegion}
            onRegionChangeComplete={onRegionChange}
            zoomControlEnabled={true}
            onMapReady={handleMapReady}
            >
            {markers.map( (structure) => {
              // console.log(structure);
              return (
              <Marker
                key={structure.idStructure}
                coordinate={{ latitude: structure.latitude, longitude: structure.longitude }}
                title={structure.structurename}
              />
              );
            })}
            </MapView>
        </Layout>
        <Layout style={styles.buttonsContainer}>
         <Layout style={styles.buttonLeft} >
          <Button style={styles2.button} status='basic' size='small' onPress={onListButtonPress}>Show List</Button>
         </Layout>
         <Layout style={styles.buttonRight} >
          <Button style={styles2.button} status='basic'
            size='small' onPress={onCountryButtonPress}>Country Informations</Button>
         </Layout>
        </Layout>
        <Layout style={styles.downContainer}>
          <Text style={styles.downText}>Now you are on:</Text>
          <Text style={styles.downTextBold}>ITALY</Text>
        </Layout>
      </ScrollView>
    </SafeAreaLayout>
  );
};

const styles2 = StyleSheet.create({
  button: { width: '100%' },
});

const themedStyles = StyleService.create({
  safeArea: {
    flex: 1,
  },
  labelWhat: {
    textAlign: 'left',
    color: 'grey',
    marginTop: 4,
  },
  select: {
    marginTop: 8,
    marginBottom: 8,
    width: '100%',
  },
  topContainer: {
    padding: 6,
    paddingLeft: 12,
    paddingRight: 12,
  },
  downContainer: {
    flexDirection: 'column',
    marginTop: 10,
  },
  downText: {
    textAlign: 'center',
  },
  downTextBold: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonRight: {
    width: '50%',
    height: 'auto',
    flex: 1,
    marginLeft: 5,
    marginRight: 10,
    alignItems: 'center',
  },
  buttonLeft: {
    width: '50%',
    height: 'auto',
    flex: 1,
    marginLeft: 10,
    marginRight: 5,
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  filtersContainer: {
    marginHorizontal: 10,
  },
  mapContainer: {
    width: '100%',
  },
  Map: {
    width: '100%',
    height: 350,
    margin: 0,
  },
  button: {
    width: '100%',
  },
});
