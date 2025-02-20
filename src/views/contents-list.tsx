// React import
import React, { useEffect } from 'react';

// React Native import
import { ListRenderItemInfo, View } from 'react-native';

// UIKitten import
import { Button, List, Layout, StyleService, Text, TopNavigation,
  TopNavigationAction, useStyleSheet, Modal as ModalUiKitten } from '@ui-kitten/components';

// Locale import
import I18n from './../i18n/i18n';

// Component import
import { SafeAreaLayout } from '../components/safe-area-layout.component';
import { CompliantItem } from './compliants/compliant-item.component';
import { MenuIcon } from '../components/icons';

// Environment import
import { AppOptions } from '../services/app-env';

// Model import
import { MenuItem } from '../model/menu-item.model';

// Axios import
import axios from 'axios';

// AsyncStorage import
// import AsyncStorage from '@react-native-async-storage/async-storage';

// Other imports
import Spinner from 'react-native-loading-spinner-overlay';

// REMOVE IMPORTS
import data_compliants, { Compliant } from './compliants/data';

export interface LayoutData extends MenuItem {
  route: string;
}

// Redux import
import { useSelector } from 'react-redux';
import { selectToken } from '../redux/tokenSlice';

export const ContentsListScreen = (props): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);
  const [compliants, setCompliants] = React.useState([]);
  const [modalAlertVisible, setModalAlertVisible] = React.useState(false);
  const [modalVisible, setmodalVisible] = React.useState(false);
  const [modalDeleteVisible, setModalDeleteVisible] = React.useState(false);
  const [compliantDelete, setCompliantDelete] = React.useState((): any => {});
  const [compliantDeleteIndex, setCompliantDeleteIndex] = React.useState(0);
  const [alertTitle, setAlertTitle] = React.useState('');
  const [alertMessage, setAlertMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  // Get Token from Redux
  const token = useSelector(selectToken);

  const { abuseAlarm } = props.route.params;
   // let abuseAlarm = null;


  const onItemRemove = (compliant: Compliant, index: number): void => {
    // DeleteDocument(document,index);
    setCompliantDelete(compliant);
    setCompliantDeleteIndex(index);
    setModalDeleteVisible(true);

  };

  async function DeleteCompliant() {
    setLoading(true);
    // const token = await AsyncStorage.getItem('token');
    /*axios
    .delete(AppOptions.getServerUrl() + 'documents/' + documentDelete.idDocument, {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    })
    .then(function (response) {*/
      setLoading(false);
      compliants.splice(compliantDeleteIndex, 1);
      setCompliants([...compliants]);
      setModalDeleteVisible(false);
      // alert('removed');
    /*})
    .catch(function (error) {
      setLoading(false);
      // alert(JSON.stringify(error));
      throw error;
    });*/
  }

  const addElement = (): void => {
    props.navigation && props.navigation.navigate('ContentsDetails', { item: null, abuseAlarm: abuseAlarm });
  };

  const onItemPress = (compliant: Compliant, index: number): void => {
    props.navigation && props.navigation.navigate('ContentsDetails', { item: compliant, abuseAlarm: abuseAlarm });
  };

  const renderCompliantItem = (info: ListRenderItemInfo<Compliant>): React.ReactElement => (
    <CompliantItem
      style={styles.item}
      index={info.index}
      compliant={info.item}
      onRemove={onItemRemove}
      onItemPress={onItemPress}
    />
  );

  async function getMyCompliants() {
    setLoading(true);
    /*const token = await AsyncStorage.getItem('token');
    axios
    .get(AppOptions.getServerUrl() + 'documents', {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    })
    .then(function (response) {*/
      setLoading(false);
      // setCompliants(response.data);
      setCompliants(data_compliants);

      // alert(JSON.stringify(response));
    /*})
    .catch(function (error) {
      setLoading(false);
      // alert(JSON.stringify(error));
      throw error;
    });*/
  }

  useEffect(() => {
    getMyCompliants();
    // console.log(abuseAlarm);
  }, []);



  /* ALERT MESSAGE */
  const showAlertMessage = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setModalAlertVisible(true);
  };

  const navigateBack = () => {
    props.navigation.goBack();
  };

  // <TopNavigationAction icon={ArrowBackIcon} onPress={navigateBack} />
  const renderDrawerAction = (): React.ReactElement => (
      <TopNavigationAction
        icon={MenuIcon}
        onPress={props.navigation.toggleDrawer}
      />
  );

  return (
    <SafeAreaLayout
      style={styles.safeArea}
      insets='top'>
      <TopNavigation
        title={abuseAlarm === true ? I18n.t('AbuseAlarm - List') : I18n.t('News&Stories - List')}
        titleStyle={styles.topBarTitle}
        leftControl={renderDrawerAction() }
        style={styles.topBar}
      />
      <Layout
      style={styles.container}
      level='2'>
      <Spinner
          visible={loading}
          textContent={I18n.t('Please wait') + '...'}
          textStyle={styles.spinnerTextStyle}
        />
        { abuseAlarm === true && (
        <View>
          <View style={styles.addButtonContainer}>
        <Button
          status='primary'
          style={styles.addButton}
          onPress={addElement}>{I18n.t('New AbuseAlarm')}</Button>
          </View>
        <Text
          style={styles.infoSection}>
          {I18n.t('Tap on AbuseAlarm for the preview') + '. '
          + I18n.t('Swipe left on AbuseAlarm to delete it') + '.' }
        </Text>
        </View>
        )}
        { abuseAlarm === false && (
        <View>
          <View style={styles.addButtonContainer}>
        <Button
          status='primary'
          style={styles.addButton}
          onPress={addElement}>{I18n.t('New News&Story')}</Button>
          </View>
        <Text
        style={styles.infoSection}>
        {I18n.t('Tap on News&Story for the preview') + '. '
        + I18n.t('Swipe left on News&Story to delete it') + '.' }
        </Text>

        </View>
        )}
        <List style={styles.container}
          data={compliants}
          renderItem={renderCompliantItem}
        />
      </Layout>

      <ModalUiKitten
        visible={ modalAlertVisible }
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setModalAlertVisible(false)}>
        <Layout style={ styles.modal } >
          <Text style={ styles.modalText } category='h6' >{alertTitle}</Text>
          <Text style={ styles.modalText } >{alertMessage}</Text>
          <Button status='basic' onPress={() => setModalAlertVisible(false)}>{I18n.t('CLOSE')}</Button>
        </Layout>
      </ModalUiKitten>

      <ModalUiKitten
        visible={ modalDeleteVisible }
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setModalDeleteVisible(false)}>
        <Layout style={ styles.modal } >
          <Text style={ styles.modalText } category='h6' >
            {I18n.t('Are you sure to delete the selected compliant?')}
          </Text>
          <Button status='primary' onPress={DeleteCompliant}>{I18n.t('DELETE')}</Button>
          <Button status='basic' onPress={() => setModalDeleteVisible(false)}>{I18n.t('CLOSE')}</Button>
        </Layout>
      </ModalUiKitten>
    </SafeAreaLayout>
  );
};

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    backgroundColor: 'background-basic-color-4',
  },
  safeArea: {
    flex: 1,
  },
  infoSection: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
    marginHorizontal: 16,
    color: 'color-light-100',
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: 'background-basic-color-3',
  },
  generateTokenButton: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 10,
  },
  backdrop: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  backdrop_black: { backgroundColor: 'rgba(0, 0, 0, 1)' },
  modal: {
    textAlign: 'center',
    margin: 12,
    padding: 12,
  },
  modalText: {
    marginBottom: 4,
    textAlign: 'center',
  },
  modalTitle: {
    marginBottom: 4,
    textAlign: 'center',
  },
  errorText: {
    marginBottom: 4,
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
  },
  imageStyle: {
    width: 150,
    height: 150,
    margin: 5,
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
  topBar: {
    backgroundColor: 'color-primary-default',
  },
  topBarTitle: {
    color: '#FFFFFF',
  },
  topBarIcon: {
    color: '#FFFFFF',
    tintColor: '#FFFFFF',
  },
  addButton: {
    margin: 10,
    width: 200,
  },
  addButtonContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },

});
