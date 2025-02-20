// React import
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { CommonActions, DrawerActions } from '@react-navigation/native';
// UIKitten import
import {
  Avatar,
  Divider,
  Drawer,
  DrawerElement,
  DrawerHeaderElement,
  DrawerHeaderFooter,
  DrawerHeaderFooterElement,
  Layout,
  Text,
} from '@ui-kitten/components';

// Components import
import { HomeIcon, BellIcon, PinIcon, BookOpenIcon, LockIcon, BookIcon, PersonIcon,
  Settings2Icon, GlobeIcon, LogoutIcon } from '../components/icons';
import { SafeAreaLayout } from '../components/safe-area-layout.component';

// Language import
import I18n from '../i18n/i18n';

// Other imports
import { WebBrowserService } from '../services/web-browser.service';
import { AppInfoService } from '../services/app-info.service';
// Redux import
import { useDispatch, useSelector } from 'react-redux';
import { manageToken } from '../redux/tokenSlice';

const version: string = AppInfoService.getVersion();

export const HomeDrawer = ({ navigation }): DrawerElement => {
  const [data, setData] = React.useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    const menuObj = [
      { title: I18n.t('Homepage'), icon: HomeIcon },
      { title: I18n.t('DocWallet'), icon: BookOpenIcon },
      { title: I18n.t('AroundMe'), icon: PinIcon },
      // { title: I18n.t('AbuseAlarm'), icon: BellIcon },
      // { title: I18n.t('News&Stories'), icon: BookIcon },
      { title: ' ', icon: null },
      { title: I18n.t('My Profile'), icon: PersonIcon },
      { title: I18n.t('Settings'), icon: Settings2Icon },
      { title: I18n.t('Change Password'), icon: LockIcon },
      { title: I18n.t('Kosmopolis'), icon: GlobeIcon },
      { title: I18n.t('Logout'), icon: LogoutIcon },
    ];
    const menuArray = menuObj;
    setData(menuArray);
  }, []);

  const onItemSelect = (index: number): void => {
    switch (index) {
      // Homepage
      case 0: {
        navigation.toggleDrawer();
        navigation.navigate('Home');
        return;
      }

      // DocWallet
      case 1: {
        navigation.toggleDrawer();
        navigation.navigate('DocWallet');
        return;
      }

      // AroundMe
      case 2: {
        navigation.toggleDrawer();
        navigation.navigate('AroundMe');
        return;
      }
      // Work if AbuseAlarm and News & Stories

      // AbuseAlarm
      /*case 3: {
        navigation.toggleDrawer();
        navigation.navigate('AbuseAlarm', {
          screen: 'ContentsList',
          params: { abuseAlarm: true},
        });
        return;
      }

      // News&Stories
      case 4: {
        navigation.toggleDrawer();
        navigation.navigate('NewsStories', {
          screen: 'ContentsList',
          params: { abuseAlarm: false},
        });
        return;
      }

      // My Profile
      case 6: {
        navigation.toggleDrawer();
        navigation.navigate('MyProfile');
        return;
      }

      // Settings
      case 7: {
        navigation.toggleDrawer();
        navigation.navigate('Settings');
        return;
      }

      // Change Password
      case 8: {
        navigation.toggleDrawer();
        navigation.navigate('ChangePassword');
        return;
      }

      // Kosmopolis
      case 9: {
        navigation.toggleDrawer();
        WebBrowserService.openBrowserAsync('http://www.kosmopolis.me/');
        return;
      }

      // Logout
      case 10: {
        dispatch(manageToken(''));
        navigation.toggleDrawer();
        setTimeout(Logout, 100);
        // navigation.navigate('SignIn');
        return;
      }*/

      // to delete if abusealarm and news & stories

      // My Profile
      case 4: {
        navigation.toggleDrawer();
        navigation.navigate('MyProfile');
        return;
      }

      // Settings
      case 5: {
        navigation.toggleDrawer();
        navigation.navigate('Settings');
        return;
      }

      // Change Password
      case 6: {
        navigation.toggleDrawer();
        navigation.navigate('ChangePassword');
        return;
      }

      // Kosmopolis
      case 7: {
        navigation.toggleDrawer();
        WebBrowserService.openBrowserAsync('http://www.kosmopolis.me/');
        return;
      }

      // Logout
      case 8: {
        dispatch(manageToken(''));
        navigation.toggleDrawer();
        setTimeout(Logout, 10);
        // navigation.navigate('SignIn');
        return;
      }


    }
  };

  const Logout = (): void => {
    navigation.dispatch(
      // DrawerActions.closeDrawer();
      CommonActions.reset({
        index: 1,
        routes: [
          { name: 'SignIn' },
        ],
      }),
    );
  };

  const renderHeader = (): DrawerHeaderElement => (
    <Layout
      style={styles.header}
      level='2'>
      <View style={styles.profileContainer}>
        <Avatar
          size='giant'
          source={require('../assets/images/image-app-icon.png')}
        />
        <Text
          style={styles.profileName}
          category='h6'>
          Global Passport Project
        </Text>
      </View>
    </Layout>
  );

  const renderFooter = (): DrawerHeaderFooterElement => (
    <React.Fragment>
      <Divider/>
      <DrawerHeaderFooter
        disabled={true}
        description={`Version ${AppInfoService.getVersion()}`}
      />
    </React.Fragment>
  );

  return (
    <SafeAreaLayout
      style={styles.safeArea}
      insets='top'>
      <Drawer
        header={renderHeader}
        footer={renderFooter}
        data={data}
        onSelect={onItemSelect}
      />
    </SafeAreaLayout>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    height: 128,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileName: {
    marginHorizontal: 8,
  },
});
